package com.distritv.data.service

import android.app.Service
import android.content.ContentValues.TAG
import android.content.Intent
import android.os.IBinder
import android.util.Log
import com.distritv.BuildConfig
import com.distritv.data.repositories.ContentRepository
import com.distritv.utils.getResourceName
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import org.koin.android.ext.android.inject

import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit

class RequestService() : Service() {

    private val contentRepository: ContentRepository by inject()
    private val contentService: ContentService by inject()

    override fun onBind(p0: Intent?): IBinder? {
        return null
    }

    override fun onCreate() {
        Log.d(TAG, "Request service created...")
        Executors.newSingleThreadScheduledExecutor().scheduleAtFixedRate({
            CoroutineScope(Dispatchers.Main).launch {
                try {
                    val contentList = contentRepository.getContentList()
                    contentList.forEach { content ->
                        val response = contentRepository.downloadContent(getResourceName(content))
                        val resultId = contentService.downloadContent(content, response)
                        if (!resultId.equals(-1)) {
                            Log.v(TAG, "Content saved in BD with id: $resultId")
                        }
                    }
                } catch (e: Exception) {
                    Log.v(TAG, "Could not connect to the server.", e)
                }
            }
        }, initialTime, periodTime, timeUnit)
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        //Log.d(TAG, "Request service started...")
        return START_NOT_STICKY
    }

    override fun onDestroy() {
        //Log.d(TAG, "Request service destroyed...")
    }

    companion object {
        private val initialTime: Long = BuildConfig.REQUEST_SERVICE_TIME_INIT
        private val periodTime: Long = BuildConfig.REQUEST_SERVICE_TIME_PERIOD
        private val timeUnit = TimeUnit.SECONDS
    }

}
