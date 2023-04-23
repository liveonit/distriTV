/**
 * This service starts running in the background when start the app and continues even if the app is closed.
 * Stops only if the app is force stopped.
 *
 * Periodically makes requests to the server to bring the contents that correspond to the device.
 */

package com.distritv.daemon


import android.app.Service
import android.content.Intent
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.util.Log
import com.distritv.BuildConfig
import com.distritv.data.model.Content
import com.distritv.data.model.InfoDevice
import com.distritv.data.repositories.ContentRepository
import com.distritv.data.service.ContentService
import com.distritv.data.service.SharedPreferencesService
import com.distritv.utils.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import okhttp3.ResponseBody
import org.koin.android.ext.android.inject
import java.net.SocketTimeoutException
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.*
import java.util.concurrent.TimeUnit


class ContentRequestDaemon: Service() {

    private val contentRepository: ContentRepository by inject()
    private val contentService: ContentService by inject()
    private val sharedPreferences: SharedPreferencesService by inject()

    private val handler = Handler(Looper.myLooper()!!)
    private lateinit var runnable: Runnable

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

                val id = sharedPreferences.getDeviceId()
                if(id.isNullOrEmpty()){
                    return@launch
                }
                val infoDevice = InfoDevice(id)

                val contentList = contentService.getAllContents()

                val responseContentList = contentRepository.getContentList()
                //val contentListPost = contentRepository.postContentList(infoDevice)

                // Check if any content was removed to inactivate
                contentList.filter { it.active == ACTIVE_YES }.forEach { content ->
                    contentService.checkAndInactivateDeletedContent(content, responseContentList)
                }

                for (content in responseContentList) {

                    // TODO: prueba -> eliminar
                    tempSetFields(content)

                    val originalContent = contentList.firstOrNull { it.id == content.id }

                    // If no content exists: insert new content
                    if (originalContent == null) {
                        if (!isText(content.type)) {
                            if (existsContentName(content, contentList)) {
                                Log.e(TAG,
                                    "The content name already exists -> id: ${content.id}, name: ${content.name}")
                                continue
                            }
                            if (content.name.isBlank()) {
                                content.name = UUID.randomUUID().toString()
                            }
                        } else if (content.name == null) {
                            content.name = ""
                        }
                        saveContent(
                            content,
                            contentService::downloadAndInsertContent,
                            contentService::saveNewContent,
                            "inserted"
                        )
                        continue
                    }

                    // If content already exists and if it has changes: update content

                    if (!isText(content.type) && content.name.isBlank()) {
                        content.name = originalContent.name
                    } else if (content.name == null) {
                        content.name = ""
                    }
                    if (!areEquals(originalContent, content)) {
                        if (!isText(content.type) && existsContentName(content, contentList)) {
                            Log.e(TAG,
                                "The content name already exists -> id: ${content.id}, name: ${content.name}")
                            continue
                        }
                        content.idDB = originalContent.idDB
                        saveContent(
                            content,
                            contentService::downloadAndUpdateContent,
                            contentService::saveExistingContent,
                            "updated"
                        )
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

    /**
     * If content type is not Text, check if the content name already exists.
     */
    private fun existsContentName(content: Content, contentList: List<Content>): Boolean {
        return contentList.firstOrNull { !isText(it.type) && it.active == ACTIVE_YES
                && it.id != content.id && it.name == content.name } != null
    }

    private suspend fun saveContent(
        content: Content,
        action: (content: Content, response: ResponseBody) -> Long?,
        actionTypeText: (content: Content) -> Long?,
        msgResult: String
    ) {

        // TODO: prueba -> eliminar
        tempSetFields(content)

        content.active = ACTIVE_YES
        if (content.localPath == null) {
            content.localPath = ""
        }

        var resultId: Long? = -1L

        //type.substringBefore("/")

        if (isImage(content.type.toString()) || isVideo(content.type.toString())) {
            val response = contentRepository.fetchContent(getResourceName(content))
            resultId = action(content, response)
        } else if (isText(content.type)) {
            resultId = actionTypeText(content)
        }

        if (resultId != -1L) {
            Log.i(TAG, "Content with id ${content.id} was $msgResult (Id in BD: $resultId)")
        }
    }

    /**
     * solo a modo de prueba mientras no este implementado en el server
     * TODO eliminar
     */
    private fun tempSetFields(content: Content) {

        val pattern = DateTimeFormatter.ofPattern(DATE_FORMAT)

        val startDate = "2023-04-07 20:00:00"
        content.startDate = LocalDateTime.parse(startDate, pattern)

        val endDate = "2023-04-30 20:00:00"
        content.endDate = LocalDateTime.parse(endDate, pattern)

        //content.cron = "0 0/2 * * * ?" //cada 2 minutos
        //content.cron = "0 0/1 * * * ?" //cada 1 minuto
        //content.cron = "0 0/5 * * * ?" //cada 5 minutos
        content.cron = "0/40 * * * * ?" //cada 30 segundos

        if(isVideo(content.type)){
            content.durationInSeconds = 0
        }else{
            content.durationInSeconds = 20
        }
    }

    companion object {
        const val TAG = "[ContentRequestDaemon]"

        private val periodTime: Long = BuildConfig.REQUEST_TIME_PERIOD
    }
}