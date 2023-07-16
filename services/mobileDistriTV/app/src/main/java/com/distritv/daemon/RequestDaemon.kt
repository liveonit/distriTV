/**
 * This service starts running in the background when start the app and continues even if the app is closed.
 * Stops only if the app is force stopped.
 *
 * Periodically makes requests to the server to bring the schedules and their contents that correspond to the device.
 * It also deletes schedules that no longer appear in the response.
 */

package com.distritv.daemon


import android.app.Service
import android.content.Intent
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.util.Log
import android.widget.Toast
import com.distritv.BuildConfig
import com.distritv.DistriTVApp
import com.distritv.R
import com.distritv.data.helper.StorageHelper.SDK_VERSION_FOR_MEDIA_STORE
import com.distritv.data.model.Alert
import com.distritv.data.model.Content
import com.distritv.data.model.DeviceInfo
import com.distritv.data.repositories.ContentRepository
import com.distritv.data.repositories.TelevisionRepository
import com.distritv.data.service.ContentService
import com.distritv.data.service.DeviceInfoService
import com.distritv.data.service.ScheduleService
import com.distritv.utils.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import okhttp3.ResponseBody
import org.koin.android.ext.android.inject
import java.net.SocketTimeoutException
import java.util.concurrent.TimeUnit


class RequestDaemon: Service() {

    private val contentRepository: ContentRepository by inject()
    private val televisionRepository: TelevisionRepository by inject()
    private val contentService: ContentService by inject()
    private val scheduleService: ScheduleService by inject()

    private val deviceInfoService:DeviceInfoService by inject()

    private val handler = Handler(Looper.myLooper()!!)
    private lateinit var runnable: Runnable

    private lateinit var errorMessageHandler: Handler

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }

    override fun onCreate() {
        super.onCreate()
        Log.i(TAG, "Service created...")

        val notification = createNotification(this)

        startForeground(100, notification)

        runnable = object : Runnable {
            override fun run() {
                startRequest()

                // Schedule the next execution in periodTime milliseconds:
                handler.postDelayed(this, TimeUnit.SECONDS.toMillis(periodTime))
            }
        }

        errorMessageHandler = Handler(Looper.getMainLooper())
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        Log.i(TAG, "Service started command...")

        // Start the daemon by scheduling the first execution
        handler.post(runnable)

        return START_STICKY
    }

    override fun onTaskRemoved(rootIntent: Intent?) {
        super.onTaskRemoved(rootIntent)
        Log.i(TAG, "Service task removed...")
    }

    override fun onDestroy() {
        super.onDestroy()
        Log.i(TAG, "Service destroyed...")

        // Stop the daemon by removing all future executions:
        handler.removeCallbacks(runnable)

        stopForeground(true)
    }

    private fun startRequest() {
        CoroutineScope(Dispatchers.Main).launch {
            try {

                val deviceInfo = deviceInfoService.getDeviceInfo()
                Log.v(TAG, "$deviceInfo")
                if (deviceInfo.tvCode.isEmpty()) {
                    return@launch
                }

                val scheduleList = scheduleService.getAllSchedules()

                // Fetch schedules with content from the server
                val responseTelevision =
                    televisionRepository.fetchTelevision(deviceInfo) ?: return@launch

                if (checkExternalStorage(deviceInfo)) return@launch

                checkAlert(deviceInfo, responseTelevision.alert)

                // Check if any schedule was removed on the server then delete on TV
                scheduleList.forEach { schedule ->
                    scheduleService.checkAndDeletedSchedule(schedule, responseTelevision.schedules)
                }

                for (schedule in responseTelevision.schedules) {

                    if (!scheduleService.meetAnticipationDays(schedule.startDate) || !schedule.validEndDate()) {
                        continue
                    }

                    if (!schedule.isValidWithContent(TAG)) {
                        continue
                    }

                    schedule.content?.let { contentProcessing(it) }

                    val originalSchedule = scheduleList.firstOrNull { it.id == schedule.id }

                    // If no schedule exists: insert new schedule
                    if (originalSchedule == null) {
                        if (scheduleService.saveNewSchedule(schedule) > 0) {
                            Log.i(TAG, "Schedule was saved: $schedule")
                        }

                        continue
                    }

                    // If schedule already exists and if it has changes: update schedule
                    if (!originalSchedule.areEquals(schedule)) {
                        if (scheduleService.saveExistingSchedule(schedule) > 0) {
                            Log.i(TAG, "Schedule was updated: $schedule")
                        }
                    }

                }

            } catch (e: SocketTimeoutException) {
                Log.e(
                    TAG, "Could not connect to the server -> ${e.javaClass}: ${e.message}"
                )
            } catch (e: Exception) {
                Log.e(TAG, "$e")
            }
        }
    }

    private fun checkAlert(deviceInfo: DeviceInfo, alert: Alert?) {
        if (alert == null) {
            // Clear alert duration left
            if (deviceInfo.alertDurationLeft != null) {
                // Cancel current alert
                if (deviceInfo.alertDurationLeft > 0) {
                    launchAlert(getAlertBlank())
                }
                setNullDurationLeft()
            }
            return
        }
        if ((deviceInfo.alertDurationLeft == null)
            || (getCurrentlyPlayingAlertId() != null && getCurrentlyPlayingAlertId() != alert.id)
            || (!isAlertCurrentlyPlaying() && getCurrentlyPlayingAlertId() != null)) {
            launchAlert(alert)
        } else if (deviceInfo.alertDurationLeft == 0L) {
            // Clear alert duration left
            setNullDurationLeft()
        }
    }

    private fun launchAlert(alert: Alert) {
        val intent = createIntentAlert(applicationContext, alert)
        sendBroadcast(intent)
    }

    private fun getCurrentlyPlayingAlertId(): Long? {
        return (applicationContext.applicationContext as DistriTVApp?)?.getCurrentlyPlayingAlertId()
    }

    private fun isAlertCurrentlyPlaying(): Boolean {
        return (applicationContext.applicationContext as DistriTVApp?)?.isAlertCurrentlyPlaying() ?: false
    }

    private fun setNullDurationLeft() {
        (applicationContext.applicationContext as DistriTVApp?)?.setAlertDurationLeft(null)
    }

    private fun checkExternalStorage(deviceInfo: DeviceInfo): Boolean {
        if (deviceInfo.useExternalStorage && (!deviceInfo.isExternalStorageConnected
                    || ((Build.VERSION.SDK_INT < SDK_VERSION_FOR_MEDIA_STORE)
                    && ((deviceInfo.externalStoragePermissionGranted != null) && !deviceInfo.externalStoragePermissionGranted)))
        ) {
            Log.e(TAG, "External storage may not be found or permission not granted.")
            Log.e(TAG, "External storage is connected?: ${deviceInfo.isExternalStorageConnected}")
            Log.e(TAG, "External storage permission granted?: ${deviceInfo.externalStoragePermissionGranted}")

            errorMessageHandler.post {
                Toast.makeText(
                    applicationContext,
                    getString(R.string.msg_error_external_storage),
                    Toast.LENGTH_LONG
                ).show()
            }

            return true
        }
        return false
    }

    private suspend fun contentProcessing(content: Content) {

        val contentList = contentService.getAllContents()

        if (!content.isValid(TAG)) {
            return
        }

        val originalContent = contentList.firstOrNull { it.id == content.id }

        // If no content exists: insert new content
        if (originalContent == null) {
            if (content.existsContentName(TAG, contentList)) {
                return
            }
            saveContent(
                content,
                contentService::downloadAndInsertContent,
                contentService::saveNewContent,
                "inserted"

            )
            return
        }

        // If content already exists and if it has changes: update content
        if (!originalContent.areEquals(content)) {
            if (content.existsContentName(TAG, contentList)) {
                return
            }
            saveContent(
                content,
                contentService::downloadAndUpdateContent,
                contentService::saveExistingContent,
                "updated"
            )
        }
    }

    private suspend fun saveContent(
        content: Content,
        action: (content: Content, response: ResponseBody) -> Long?,
        actionTypeText: (content: Content) -> Long?,
        msgResult: String
    ) {
        var resultId: Long? = -1L

        if (content.isVideo() || content.isImage()) {
            val response = contentRepository.fetchContent(content.getResourceName())
            resultId = action(content, response)
        } else if (content.isText()) {
            resultId = actionTypeText(content)
        }

        if (resultId != -1L) {
            Log.i(TAG, "Content with id ${content.id} was $msgResult (Id in BD: $resultId)")
        }
    }

    companion object {
        const val TAG = "[RequestDaemon]"
        private val periodTime: Long = BuildConfig.REQUEST_TIME_PERIOD
    }
}