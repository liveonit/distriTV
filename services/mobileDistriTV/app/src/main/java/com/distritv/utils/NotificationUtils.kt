package com.distritv.utils

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context


fun createNotification(context: Context): Notification {
    val manager = (context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager)

    val channelId = "ceibal_channel"
    manager.createNotificationChannel(
        NotificationChannel(
            channelId,
            "Ceibal Notification Channel",
            NotificationManager.IMPORTANCE_LOW
        )
    )

    return Notification.Builder(context, channelId)
        .setContentTitle("")
        .setContentText("").build()
}


