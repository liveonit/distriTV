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

                val contentList = contentService.getAllContents()

                val responseContentList = contentRepository.fetchContentList(InfoDevice(id))

                // Check if any content was removed to inactivate
                contentList.filter { it.active == ACTIVE_YES }.forEach { content ->
                    contentService.checkAndInactivateDeletedContent(content, responseContentList)
                }

                for (content in responseContentList) {
                    Log.v(TAG, "content: $content")

                    if (!content.isValid(TAG)) {
                        continue
                    }

                    val originalContent = contentList.firstOrNull { it.id == content.id }

                    // If no content exists: insert new content
                    if (originalContent == null) {
                        if (content.existsContentName(TAG, contentList)) {
                            continue
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
                    if (!areEquals(originalContent, content)) {
                        if (content.existsContentName(TAG, contentList)) {
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

    private suspend fun saveContent(
        content: Content,
        action: (content: Content, response: ResponseBody) -> Long?,
        actionTypeText: (content: Content) -> Long?,
        msgResult: String
    ) {
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

    companion object {
        const val TAG = "[ContentRequestDaemon]"
        private val periodTime: Long = BuildConfig.REQUEST_TIME_PERIOD
    }
}