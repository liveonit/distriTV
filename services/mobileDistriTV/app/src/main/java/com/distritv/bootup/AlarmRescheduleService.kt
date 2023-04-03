/**
 * Reschedule content playback after a reboot
 */

package com.distritv.bootup

import android.app.Service
import android.content.Intent
import android.os.IBinder
import android.util.Log
import com.distritv.data.service.AlarmService
import org.koin.android.ext.android.inject

class AlarmRescheduleService : Service() {

    private val alarmService: AlarmService by inject()

    override fun onBind(intent: Intent): IBinder? {
        return null
    }

    override fun onCreate() {
        super.onCreate()
        Log.i(TAG, "Request service created...")

        /*
       setAlarm(2023, Calendar.APRIL, 2, 12, minuto,
           content.localPath, content.type, content.id.toInt(), 300000
           "Scheduled content: ${content.id}")*/
        this.stopSelf()
    }


    override fun onDestroy() {
        Log.i(TAG, "Request service destroyed...")
    }

    private fun setAlarm(year: Int, month: Int, day: Int, hour: Int, min: Int,
                         localPath: String, contentType: String, requestCode: Int,
                         intervalInMillis: Long, msg: String) {
        val calendar = alarmService.createCalendar(year, month, day, hour, min)
        val pendingIntent = alarmService.createPendingIntent(localPath, contentType, requestCode)
        alarmService.setAlarm(calendar, pendingIntent, intervalInMillis, msg)
    }

    companion object {
        const val TAG = "[AlarmRescheduleService]"
    }
}