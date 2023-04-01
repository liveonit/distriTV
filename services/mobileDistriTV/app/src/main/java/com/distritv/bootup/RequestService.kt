/**
 * This service starts running in the background when start the app and continues even if the app is closed.
 * Stops only if the app is force stopped.
 */

package com.distritv.bootup

import android.annotation.SuppressLint
import android.app.AlarmManager
import android.app.PendingIntent
import android.app.Service
import android.content.ContentValues.TAG
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.IBinder
import android.util.Log
import android.widget.Toast
import com.distritv.BuildConfig
import com.distritv.data.repositories.ContentRepository
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

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }

    override fun onCreate() {
        Log.i(TAG, "Request service created...")
        Executors.newSingleThreadScheduledExecutor().scheduleAtFixedRate({
            CoroutineScope(Dispatchers.Main).launch {
                try {
                    val contentList = contentRepository.getContentList()
                    contentList.forEach { content ->

                        if (!contentService.existsContent(content.id)) {
                            val response = contentRepository.downloadContent(getResourceName(content))
                            val resultId = contentService.downloadContent(content, response)
                            if (resultId != -1L) {
                                Log.i(TAG, "Content saved in BD with id: $resultId")


                               // aaa(2023, Calendar.MARCH, 31, 11, 20, content.localPath, content.type, "ddd", 1  )

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

    companion object {
        private val initialTime: Long = BuildConfig.REQUEST_SERVICE_TIME_INIT
        private val periodTime: Long = BuildConfig.REQUEST_SERVICE_TIME_PERIOD
        private val timeUnit = TimeUnit.SECONDS
    }

    private fun aaa(
        year: Int,
        month: Int,
        day: Int,
        hour: Int,
        min: Int,
        localPath: String,
        contentType: String,
        msg: String,
        reqId: Int
    ) {
        val calendar: Calendar = Calendar.getInstance()
        if (Build.VERSION.SDK_INT >= 23) {
            calendar.set(
                year,
                month,
                day,
                hour,
                min,
                0
            )
        } else {
            calendar.set(
                year,
                month,
                day,
                hour,
                min,
                0
            )
        }
        setAlarm(calendar.timeInMillis, localPath, contentType, msg, reqId)
    }


    @SuppressLint("UnspecifiedImmutableFlag")
    private fun setAlarm(timeInMillis: Long, localPath: String, contentType: String, msg: String, reqId: Int) {
        val alarmManager = getSystemService(Context.ALARM_SERVICE) as AlarmManager


        //val intent = Intent(localPath, null,this, Prueba::class.java)
        //val intent = Intent(this, Prueba::class.java)
        //  intent.putExtra(LOCAL_PATH_PARAM, localPath)

        val intent = Intent(localPath, null,this, ScheduleReceiver::class.java)
        intent.putExtra(LOCAL_PATH_PARAM, localPath)
        intent.putExtra(CONTENT_TYPE_PARAM, contentType)
        val pendingIntent = PendingIntent.getBroadcast(this, reqId, intent, PendingIntent.FLAG_CANCEL_CURRENT)

        /*  val pendingIntent = Intent(this, Prueba::class.java).let { intent ->
              PendingIntent.getBroadcast(this, 0, intent, 0)
          }*/

        // Set the alarm to start at 8:30 a.m.
        /*  val calendar: Calendar = Calendar.getInstance().apply {
              setTimeInMillis(System.currentTimeMillis())
              set(Calendar.HOUR_OF_DAY, 8)
              set(Calendar.MINUTE, 30)
          }*/

        // val pendingIntent = PendingIntent.getBroadcast(this, reqId, intent, PendingIntent.FLAG_CANCEL_CURRENT)



        alarmManager.setRepeating(
            AlarmManager.RTC,
            timeInMillis,
            AlarmManager.INTERVAL_DAY,
            pendingIntent
        )
        Toast.makeText(this, msg, Toast.LENGTH_SHORT).show()
    }


}
