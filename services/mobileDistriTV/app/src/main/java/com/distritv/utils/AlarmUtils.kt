package com.distritv.utils

import android.annotation.SuppressLint
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import com.distritv.daemon.ContentPlaybackLauncher
import com.distritv.data.model.CalendarModel
import java.util.*


fun createCalendar(calendarModel: CalendarModel): Calendar {
    return Calendar.getInstance().apply {
        timeInMillis = System.currentTimeMillis()
        set(Calendar.YEAR, calendarModel.year)
        set(Calendar.MONTH, calendarModel.month)
        set(Calendar.DAY_OF_MONTH, calendarModel.day)
        set(Calendar.HOUR_OF_DAY, calendarModel.hour)
        set(Calendar.MINUTE, calendarModel.min)
    }
}

@SuppressLint("UnspecifiedImmutableFlag")
fun createPendingIntent(context: Context, contentParam: String, contentType: String, contentDuration: Long, requestCode: Int): PendingIntent {
    return Intent(contentParam, null, context, ContentPlaybackLauncher::class.java)
        .putExtra(CONTENT_PARAM, contentParam)
        .putExtra(CONTENT_TYPE_PARAM, contentType)
        .putExtra(CONTENT_DURATION_PARAM, contentDuration)
        .putExtra(IS_ALARM_PARAM, true)
        .let { intent ->
            PendingIntent.getBroadcast(
                context,
                requestCode,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT
            )
        }
}