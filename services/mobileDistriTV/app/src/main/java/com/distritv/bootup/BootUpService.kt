/**
 * This service is necessary to be able to automatically start the application (android10)
 */

package com.distritv.bootup

import android.app.*
import android.content.Intent
import android.os.IBinder
import com.distritv.utils.createNotification


class BootUpService : Service() {

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val notification = createNotification(this)

        startForeground(100, notification)

        return START_STICKY
    }

    companion object {
        const val TAG = "[BootUpService]"
    }
}