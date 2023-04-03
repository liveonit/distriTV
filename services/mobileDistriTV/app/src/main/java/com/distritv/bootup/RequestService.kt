/**
 * This service starts running in the background when start the app and continues even if the app is closed.
 * Stops only if the app is force stopped.
 */

package com.distritv.bootup

import android.app.AlarmManager
import android.app.Service
import android.content.Intent
import android.os.IBinder
import android.util.Log
import com.distritv.BuildConfig
import com.distritv.DistriTVApp
import com.distritv.data.repositories.ContentRepository
import com.distritv.data.service.AlarmService
import com.distritv.data.service.ContentService
import com.distritv.utils.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import org.koin.android.ext.android.inject
import java.util.*
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit

class RequestService : Service() {

    private val contentRepository: ContentRepository by inject()
    private val contentService: ContentService by inject()
    private val alarmService: AlarmService by inject()

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }

    override fun onCreate() {
        Log.i(TAG, "Request service created...")
        Executors.newSingleThreadScheduledExecutor().scheduleAtFixedRate({
            CoroutineScope(Dispatchers.Main).launch {
                try {
                    var minuto = 50
                    val contentList = contentRepository.getContentList()
                    contentList.forEach { content ->

                        if (!contentService.existsContent(content.id)) {
                            val response =
                                contentRepository.downloadContent(getResourceName(content))
                            val resultId = contentService.downloadContent(content, response)
                            if (resultId != -1L) {
                                Log.i(TAG, "Content saved in BD with id: $resultId")
                                setAlarm(2023, Calendar.APRIL, 2, 18, minuto,
                                    content.localPath, content.type, content.id.toInt(),
                                    "Scheduled content: ${content.id}")

                                /*setAlarm(
                                    setCalendar(2023, Calendar.APRIL, 2, 10, minuto),
                                    createPendingIntent(content.localPath, content.type, content.id.toInt()),
                                    "Scheduled content: ${content.id}"
                                )*/
                                Log.v(TAG, "minuto: $minuto")
                                minuto++
                            }
                        }

                    }
                } catch (e: Exception) {
                    Log.e(TAG, "${RequestService::class.java}: Could not connect to the server -> ${e.javaClass}: ${e.message}")
                }
            }
        }, initialTime, periodTime, timeUnit)
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        Log.i(TAG, "Request service started...")
        return START_STICKY
    }

    override fun onDestroy() {
        //Log.i(TAG, "Request service destroyed...")
    }

    private fun setAlarm(year: Int, month: Int, day: Int, hour: Int, min: Int,
                     localPath: String, contentType: String, requestCode: Int,
                     msg: String) {
        val calendar = alarmService.createCalendar(year, month, day, hour, min)
        val pendingIntent = alarmService.createPendingIntent(localPath, contentType, requestCode)
        alarmService.setAlarm(calendar, pendingIntent, 240000, msg)
    }

    companion object {
        private val initialTime: Long = BuildConfig.REQUEST_SERVICE_TIME_INIT
        private val periodTime: Long = BuildConfig.REQUEST_SERVICE_TIME_PERIOD
        private val timeUnit = TimeUnit.SECONDS
        const val TAG = "[RequestService]"
    }

}
