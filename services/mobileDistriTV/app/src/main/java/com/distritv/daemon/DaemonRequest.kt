/**
 * This service starts running in the background when start the app and continues even if the app is closed.
 * Stops only if the app is force stopped.
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
import com.distritv.data.repositories.ContentRepository
import com.distritv.data.service.ContentService
import com.distritv.utils.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import org.koin.android.ext.android.inject
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.concurrent.TimeUnit


class DaemonRequest: Service() {

    private val contentRepository: ContentRepository by inject()
    private val contentService: ContentService by inject()

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
                handler.postDelayed(this, TimeUnit.SECONDS.toMillis(periodTime)) // Schedule the next execution in 10 seconds
            }
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        Log.i(TAG, "Service started command...")
        handler.post(runnable) // Start the daemon by scheduling the first execution
        return START_STICKY
    }

    override fun onTaskRemoved(rootIntent: Intent?) {
        super.onTaskRemoved(rootIntent)
        Log.i(TAG, "Service task removed...")
    }

    override fun onDestroy() {
        super.onDestroy()
        Log.i(TAG, "Service destroyed...")
        handler.removeCallbacks(runnable) // Stop the daemon by removing all future executions
        stopForeground(true)
    }

    private fun startRequest() {
        CoroutineScope(Dispatchers.Main).launch {
            try {
                var minuto = 16 //prueba

                val contentList = contentRepository.getContentList()
                contentList.forEach { content ->

                    if (!contentService.existsContent(content.id)) {
                        val response = contentRepository.downloadContent(getResourceName(content))


                        tempSetFields(content, minuto) //prueba

                        val resultId = contentService.downloadContent(content, response)
                        if (resultId != -1L) {
                            Log.i(TAG, "Content saved in BD with id: $resultId")

                            Log.v(TAG, "minuto: $minuto") //prueba
                            minuto++ //prueba
                        }
                    }

                }
            } catch (e: Exception) {
                Log.e(TAG,
                    "Could not connect to the server -> ${e.javaClass}: ${e.message}"
                )
            }
        }
    }

    /**
     * solo a modo de prueba mientras no este implementado en el server
     */
    private fun tempSetFields(content: Content, minuto: Int) {
        content.active = ACTIVE_YES

        val pattern = DateTimeFormatter.ofPattern(DATE_FORMAT)

        val startDate = "2023-04-07 20:$minuto:00"
        content.startDate = LocalDateTime.parse(startDate, pattern)

        val endDate = "2023-04-09 20:$minuto:00"
        content.endDate = LocalDateTime.parse(endDate, pattern)

        content.cron = "0 0/2 * * * ?" //cada 2 minutos
        content.durationInSeconds = 30
    }

    companion object {
        const val TAG = "[DaemonRequest]"

        private val periodTime: Long = BuildConfig.REQUEST_TIME_PERIOD
    }
}