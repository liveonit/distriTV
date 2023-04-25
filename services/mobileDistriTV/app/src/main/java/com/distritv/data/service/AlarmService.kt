package com.distritv.data.service

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.util.Log
import android.widget.Toast
import com.distritv.data.model.CalendarModel
import com.distritv.data.model.Content
import com.distritv.utils.*
import java.util.*

class AlarmService(private val context: Context) {

    fun createAllowWhileIdleAlarm(
        calendarModel: CalendarModel,
        content: Content,
        reqCode: Int
    ) {
        val calendar = createCalendar(calendarModel)
        val pendingIntent = createPendingIntent(context, content, reqCode)
        setAndAllowWhileIdleAlarm(calendar, pendingIntent, reqCode.toString())
    }

    private fun setAndAllowWhileIdleAlarm(
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
        Log.i(TAG, "Scheduled content with id $msg, to play on ${calendar.time}.")
        //TODO borrar toast:
        Toast.makeText(
            context, "Scheduled content: $msg, to play on ${calendar.time}.",
            Toast.LENGTH_SHORT).show()
    }

    private fun createCalendar(calendarModel: CalendarModel): Calendar {
        return Calendar.getInstance().apply {
            timeInMillis = System.currentTimeMillis()
            set(Calendar.YEAR, calendarModel.year)
            set(Calendar.MONTH, calendarModel.month)
            set(Calendar.DAY_OF_MONTH, calendarModel.day)
            set(Calendar.HOUR_OF_DAY, calendarModel.hour)
            set(Calendar.MINUTE, calendarModel.min)
        }
    }

    companion object {
        const val TAG = "[AlarmService]"
    }
}