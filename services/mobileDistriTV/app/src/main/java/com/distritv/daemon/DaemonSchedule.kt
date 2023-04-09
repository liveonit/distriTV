package com.distritv.daemon

import android.app.Service
import android.content.Intent
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.util.Log
import android.widget.Toast
import com.distritv.BuildConfig
import com.distritv.DistriTVApp
import com.distritv.data.model.CalendarModel
import com.distritv.data.model.Content
import com.distritv.data.service.AlarmService
import com.distritv.data.service.ContentService
import com.distritv.utils.*
import org.koin.android.ext.android.inject
import org.quartz.CronExpression
import java.time.LocalDateTime
import java.util.*
import java.util.concurrent.TimeUnit


class DaemonSchedule: Service() {

    private val contentService: ContentService by inject()
    private val alarmService: AlarmService by inject()

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
                launcherContent()
                handler.postDelayed(this, TimeUnit.SECONDS.toMillis(periodTimeInSecond))
            }
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        Log.i(TAG, "Service started command...")
        handler.post(runnable) // Start the daemon by scheduling the first execution
        return START_STICKY
    }

    override fun onTaskRemoved(rootIntent: Intent?) {
        super.onTaskRemoved(rootIntent)
        Log.i(TAG, "Service task removed...")
    }

    override fun onDestroy() {
        super.onDestroy()
        Log.i(TAG, "Service destroyed...")
        handler.removeCallbacks(runnable) // Stop the daemon by removing all future executions
        stopForeground(true)
    }

    private fun launcherContent() {
        val currentMillisecond = localDateTimeToMillis(LocalDateTime.now())!!

        contentService.getCurrentContents(currentMillisecond).forEach {

            val nextExecutionTime = it.cron?.let { it ->
                millisToDate(currentMillisecond)?.let { it1 -> calculateNextExecutionTime(it, it1) }
            }

            val rightTime = currentMillisecond.plus(TimeUnit.SECONDS.toMillis(periodTimeInSecond))

            if (nextExecutionTime != null) {

                Log.v(TAG, "$currentMillisecond - ${dateToMillis(nextExecutionTime)} - $rightTime")

                val isContentCurrentlyPlaying: Boolean =
                    (applicationContext as DistriTVApp).isContentCurrentlyPlaying()

                if (!isContentCurrentlyPlaying && dateToMillis(nextExecutionTime) in currentMillisecond until rightTime) {

                    Log.v(TAG, "--- cumple con la condicion de reprouccion: $currentMillisecond - ${nextExecutionTime.time} - $rightTime")

                    // If periodTimeInSecond is greater than one minute, an alarm is programmed, otherwise it is played instantly
                    //if (periodTimeInSecond > 5) { //prueba de alarma
                    if (periodTimeInSecond > TimeUnit.MINUTES.toSeconds(1)) {
                        setAlarm(it, nextExecutionTime)
                        Toast.makeText(applicationContext, "DameonSchedule ALARM contentId: ${it.id}", Toast.LENGTH_SHORT).show()
                    } else {
                        launchContentNow(it)
                        Toast.makeText(applicationContext, "DameonSchedule NOW contentId: ${it.id}", Toast.LENGTH_SHORT).show()
                    }

                    (applicationContext as DistriTVApp).setContentCurrentlyPlaying(true)

                    return@forEach
                }
            }
        }
    }

    private fun calculateNextExecutionTime(cronExpression: String, startDate: Date): Date {
        val cron = CronExpression(cronExpression)
        return cron.getNextValidTimeAfter(startDate)
    }

    private fun setAlarm(content: Content, executionTime: Date) {
        val calendar = GregorianCalendar();
        calendar.time = executionTime

        val calendarModel = CalendarModel(
            calendar.get(Calendar.YEAR),
            calendar.get(Calendar.MONTH),
            calendar.get(Calendar.DAY_OF_MONTH),
            calendar.get(Calendar.HOUR_OF_DAY),
            calendar.get(Calendar.MINUTE),
            calendar.get(Calendar.SECOND)
        )

        if (isVideo(content.type) || isImage(content.type)) {
            if (content.localPath.isNullOrBlank()) {
                Log.e(TAG, ERROR_LOCAL_PATH_NULL_OR_BLANK)
                return
            }
            alarmService.createAllowWhileIdleAlarm(
                calendarModel,
                content.localPath!!,
                content.type,
                content.durationInSeconds,
                content.id.toInt()
            )
        } else if (isText(content.type)) {
            if (content.text.isNullOrBlank()) {
                Log.e(TAG, ERROR_TEXT_NULL_OR_BLANK)
                return
            }
            alarmService.createAllowWhileIdleAlarm(
                calendarModel,
                content.text,
                content.type,
                content.durationInSeconds,
                content.id.toInt()
            )
        }
    }

    private fun launchContentNow(content: Content) {
        val intent = Intent(applicationContext, ScheduleReceiver::class.java)
            .putExtra(CONTENT_TYPE_PARAM, content.type)
            .putExtra(CONTENT_ID_PARAM, content.id.toInt())
            .putExtra(CONTENT_DURATION_PARAM, content.durationInSeconds)
            .putExtra(IS_ALARM_PARAM, false)

        if (isVideo(content.type) || isImage(content.type)) {
            if (content.localPath.isNullOrBlank()) {
                Log.e(TAG, ERROR_LOCAL_PATH_NULL_OR_BLANK)
                return
            }
            sendBroadcast(intent.putExtra(CONTENT_PARAM, content.localPath))
        } else if (isText(content.type)) {
            if (content.text.isNullOrBlank()) {
                Log.e(TAG, ERROR_TEXT_NULL_OR_BLANK)
                return
            }
            sendBroadcast(intent.putExtra(CONTENT_PARAM, content.text))
        }
    }

    companion object {
        const val TAG = "[DaemonSchedule]"
        private val periodTimeInSecond: Long = BuildConfig.SCHEDULE_TIME_PERIOD
        private const val ERROR_LOCAL_PATH_NULL_OR_BLANK = "It is not possible to schedule the reproduction of the content, it does not have any local path of the downloaded content"
        private const val ERROR_TEXT_NULL_OR_BLANK = "It is not possible to schedule the reproduction of the content, it is of type TEXT but it does not have any text"
    }
}