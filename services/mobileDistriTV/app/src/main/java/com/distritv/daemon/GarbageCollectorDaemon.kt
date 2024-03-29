/**
 * This service starts running in the background when start the app and continues even if the app is closed.
 * Stops only if the app is force stopped.
 *
 * Periodically deletes schedules that expired on the endDate,
 * deletes contents that no longer has schedules
 * and deletes files that no longer belong to any content.
 */

package com.distritv.daemon

import android.app.Service
import android.content.Intent
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.util.Log
import com.distritv.BuildConfig
import com.distritv.data.service.ContentService
import com.distritv.data.service.ScheduleService
import com.distritv.utils.createNotification
import org.koin.android.ext.android.inject
import java.util.concurrent.TimeUnit

class GarbageCollectorDaemon: Service() {

    private val contentService: ContentService by inject()
    private val scheduleService: ScheduleService by inject()

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

                deleteExpiredSchedule()
                deleteExpiredContent()
                removeContentFile()

                // Schedule the next execution in periodTime milliseconds:
                handler.postDelayed(this, TimeUnit.SECONDS.toMillis(periodTime))
            }
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        Log.i(TAG, "Service started command...")

        // Start the daemon by scheduling the first execution:
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

    private fun deleteExpiredSchedule() {
        scheduleService.deleteExpiredSchedule()
    }

    private fun deleteExpiredContent() {
        contentService.deleteExpiredContent()
    }

    private fun removeContentFile() {
        try {
            contentService.deleteExpiredContentFiles()
        } catch (e: Exception) {
            Log.e(TAG, "[removeContentFile] -> ${e.javaClass}: ${e.message}")
        }
    }

    companion object {
        const val TAG = "[GarbageCollectorDaemon]"
        private val periodTime: Long = BuildConfig.GARBAGE_COLLECTOR_TIME_PERIOD
    }
}