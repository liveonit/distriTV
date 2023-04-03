package com.distritv.data.service

import android.annotation.SuppressLint
import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.util.Log
import android.widget.Toast
import com.distritv.bootup.ScheduleReceiver
import com.distritv.utils.CONTENT_TYPE_PARAM
import com.distritv.utils.LOCAL_PATH_PARAM
import java.util.*

class AlarmService(private val context: Context) {
    fun createCalendar(year: Int, month: Int, day: Int, hour: Int, min: Int): Calendar {
        Log.v(TAG, "pasando por createCalendar")
        return Calendar.getInstance().apply {
            timeInMillis = System.currentTimeMillis()
            set(Calendar.YEAR, year)
            set(Calendar.MONTH, month)
            set(Calendar.DAY_OF_MONTH, day)
            set(Calendar.HOUR_OF_DAY, hour)
            set(Calendar.MINUTE, min)
        }
    }

    @SuppressLint("UnspecifiedImmutableFlag")
    fun createPendingIntent(localPath: String, contentType: String, requestCode: Int): PendingIntent {
        Log.v(TAG, "pasando por createPendingIntent")
        return Intent(localPath, null, context, ScheduleReceiver::class.java)
            .putExtra(LOCAL_PATH_PARAM, localPath).putExtra(CONTENT_TYPE_PARAM, contentType)
            .let { intent ->
                PendingIntent.getBroadcast(
                    context,
                    requestCode,
                    intent,
                    PendingIntent.FLAG_UPDATE_CURRENT
                )
            }
    }

    @SuppressLint("UnspecifiedImmutableFlag")
    fun createPendingIntent2(localPath: String, contentType: String, requestCode: Int): PendingIntent? {
        Log.v(TAG, "pasando por createPendingIntent: $localPath, $contentType, $requestCode")
        val intent = Intent(localPath, null, context, ScheduleReceiver::class.java)
            .putExtra(LOCAL_PATH_PARAM, localPath).putExtra(CONTENT_TYPE_PARAM, contentType)
        Log.v(TAG, "pasando intent:: $intent")
        val pendingIntent = PendingIntent.getBroadcast(
            context,
            requestCode,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT
        )
        Log.v(TAG, "pasando pendingintent:: $pendingIntent")
        return pendingIntent
    }

    fun setAlarm(calendar: Calendar, pendingIntent: PendingIntent, intervalInMillis: Long, msg: String) {
        Log.v(TAG, "pasando por setAlarm")
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager

        alarmManager.setRepeating(
            AlarmManager.RTC,
            calendar.timeInMillis,
            intervalInMillis,
            pendingIntent
        )

        Toast.makeText(context, msg, Toast.LENGTH_SHORT).show()
    }

    companion object {
        const val TAG = "[AlarmService]"
    }
}