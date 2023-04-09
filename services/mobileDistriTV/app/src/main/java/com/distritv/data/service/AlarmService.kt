package com.distritv.data.service

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.util.Log
import android.widget.Toast
import com.distritv.data.model.CalendarModel
import com.distritv.utils.*
import java.util.*

class AlarmService(private val context: Context) {

    fun createAllowWhileIdleAlarm(
        calendarModel: CalendarModel,
        contentParam: String,
        contentType: String,
        contentDuration: Long,
        reqCode: Int
    ) {
        val calendar = createCalendar(calendarModel)
        val pendingIntent = createPendingIntent(context, contentParam, contentType, contentDuration, reqCode)
        setAndAllowWhileIdleAlarm(calendar, pendingIntent, reqCode.toString())
    }

    fun createRepeatingAlarm(
        calendarModel: CalendarModel,
        contentParam: String,
        contentType: String,
        contentDuration: Long,
        reqCode: Int
    ) {
        val calendar = createCalendar(calendarModel)
        val pendingIntent = createPendingIntent(context, contentParam, contentType, contentDuration, reqCode)
        setRepeatingAlarm(calendar, pendingIntent, calendar.timeInMillis, reqCode.toString())
    }

    fun setAndAllowWhileIdleAlarm(
        calendar: Calendar,
        pendingIntent: PendingIntent,
        msg: String
    ) {
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager

        alarmManager.setAndAllowWhileIdle(
            AlarmManager.RTC_WAKEUP,
            calendar.timeInMillis,
            pendingIntent
        )
        Log.i(TAG, "Scheduled content: $msg")
        //TODO borrar toast:
        Toast.makeText(context, "Scheduled content: $msg", Toast.LENGTH_SHORT).show()
    }

    fun setRepeatingAlarm(
        calendar: Calendar,
        pendingIntent: PendingIntent,
        intervalInMillis: Long,
        msg: String
    ) {
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager

        alarmManager.setRepeating(
            AlarmManager.RTC,
            calendar.timeInMillis,
            intervalInMillis,
            pendingIntent
        )
        Log.i(TAG, "Scheduled content: $msg")
        //TODO borrar toast:
        Toast.makeText(context, "Scheduled content: $msg", Toast.LENGTH_SHORT).show()
    }

    companion object {
        const val TAG = "[AlarmService]"
    }
}