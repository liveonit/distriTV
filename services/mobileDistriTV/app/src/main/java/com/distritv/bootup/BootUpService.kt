/**
 * This service is necessary to be able to automatically start the application
 */

package com.distritv.bootup

import android.app.*
import android.content.Context
import android.content.Intent
import android.os.IBinder


class BootUpService : Service() {
    override fun onBind(intent: Intent?): IBinder? {
        return null
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val channelId = "my_channel"
        val channel = NotificationChannel(
            channelId,
            "Channel title",
            NotificationManager.IMPORTANCE_DEFAULT
        )

        (getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager)
            .createNotificationChannel(channel)

        val notification: Notification = Notification.Builder(this, channelId)
            .setContentTitle("")
            .setContentText("").build()

        startForeground(1, notification)

        return START_STICKY
    }
}