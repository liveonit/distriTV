package com.distritv.daemon

import android.app.Service
import android.content.Intent
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.util.Log
import com.distritv.BuildConfig
import com.distritv.data.service.ContentService
import com.distritv.utils.CONTENTS_DIRECTORY
import com.distritv.utils.createNotification
import org.koin.android.ext.android.inject
import java.io.File
import java.util.concurrent.TimeUnit

class GarbageCollectorDaemon: Service() {

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

    private fun removeContentFile() {
        try {
            val directory = File(applicationContext.filesDir, CONTENTS_DIRECTORY)
            val files = directory.listFiles()

            files?.forEach { file ->
                if (!contentService.getLocalPathActiveContents().contains(file.path)) {
                    file.delete()
                }
                if (!File(file.path).exists()) {
                    Log.i(TAG, "Removal successful: ${file.path}")
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "${e.javaClass} -> ${e.message}")
        }
    }

    companion object {
        const val TAG = "[GarbageCollectorDaemon]"
        private val periodTime: Long = BuildConfig.GARBAGE_COLLECTOR_TIME_PERIOD
    }
}