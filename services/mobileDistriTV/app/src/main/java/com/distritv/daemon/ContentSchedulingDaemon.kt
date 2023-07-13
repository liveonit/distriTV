/**
 * This service starts running in the background when start the app and continues even if the app is closed.
 * Stops only if the app is force stopped.
 *
 * Periodically checks among the active contents if the time of the next playback is within the current interval
 * to play immediately or create an alarm for its next playback (if the waiting time is more than one minute).
 */

package com.distritv.daemon

import android.app.Service
import android.content.Intent
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.util.Log
import com.distritv.BuildConfig
import com.distritv.data.model.CalendarModel
import com.distritv.data.model.Content
import com.distritv.data.model.Schedule
import com.distritv.data.service.AlarmService
import com.distritv.data.service.ScheduleService
import com.distritv.utils.*
import org.koin.android.ext.android.inject
import org.quartz.CronExpression
import java.time.LocalDateTime
import java.util.*
import java.util.concurrent.TimeUnit


class ContentSchedulingDaemon : Service() {


    private val scheduleService: ScheduleService by inject()
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

                try {
                    launcherContent()
                } catch (e: Exception) {
                    Log.e(TAG, "[launcherContent] -> ${e.javaClass}: ${e.message}")
                    Log.e(TAG, "${e.stackTrace.toList()}")
                }

                // Schedule the next execution in periodTime milliseconds:
                handler.postDelayed(this, TimeUnit.SECONDS.toMillis(periodTimeInSecond))
            }
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        Log.i(TAG, "Service started command...")

        // Start the daemon by scheduling the first execution:
        handler.post(runnable)

        return START_STICKY
    }

    override fun onTaskRemoved(rootIntent: Intent?) {
        super.onTaskRemoved(rootIntent)
        Log.i(TAG, "Service task removed...")
    }

    override fun onDestroy() {
        super.onDestroy()
        Log.i(TAG, "Service destroyed...")

        // Stop the daemon by removing all future executions:
        handler.removeCallbacks(runnable)

        stopForeground(true)
    }

    private fun launcherContent() {
        val currentTimeInMillis = localDateTimeToMillis(LocalDateTime.now())!!
        val intervalEndTimeInMillis =
            currentTimeInMillis.plus(TimeUnit.SECONDS.toMillis(periodTimeInSecond))

        // Ordered by the schedules that are reproduced only once
        val currentSchedules = scheduleService.getCurrentSchedulesWithContents(
            currentTimeInMillis,
            intervalEndTimeInMillis
        ).sortedBy { !it.playOnce }

        for (schedule in currentSchedules) {

            if (schedule.playOnce) {
                schedule.cron = "* * * * * ?"
            }

            val nextExecutionTime = schedule.cron?.let { cron ->
                millisToDate(currentTimeInMillis)?.let { currentTime ->
                    calculateNextExecutionTime(cron, currentTime)
                }
            }

            if (nextExecutionTime != null) {
                val nextExecutionTimeInMillis = dateToMillis(nextExecutionTime)!!

                if (nextExecutionTimeInMillis in currentTimeInMillis until intervalEndTimeInMillis) {
                    // If the next execution minus the current time (waiting time) is greater than one minute,
                    // an alarm is programmed, otherwise it is played instantly
                    if (nextExecutionTimeInMillis.minus(currentTimeInMillis) > TimeUnit.MINUTES.toMillis(1)) {
                        setAlarm(schedule, nextExecutionTime)
                    } else {
                        launchContentNow(schedule)
                    }
                }
            }
        }
    }

    private fun calculateNextExecutionTime(cronExpression: String, currentTime: Date): Date {
        val cron = CronExpression(cronExpression)
        return cron.getNextValidTimeAfter(currentTime)
    }

    private fun setAlarm(schedule: Schedule, executionTime: Date) {
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

        val content = schedule.content
        if (content == null || !contentIsValid(content)) {
            Log.e(TAG, ERROR_LOCAL_PATH_OR_TEXT_NULL_OR_BLANK)
            return
        }

        schedule.content = null
        content.schedule = schedule

        alarmService.createAllowWhileIdleAlarm(
            calendarModel,
            content,
            content.id.toInt()
        )
    }

    private fun launchContentNow(schedule: Schedule) {
        val content = schedule.content
        if (content == null || !contentIsValid(content)) {
            Log.e(TAG, ERROR_LOCAL_PATH_OR_TEXT_NULL_OR_BLANK)
            return
        }

        schedule.content = null
        content.schedule = schedule

        val intent = createIntent(applicationContext, content, false)
        sendBroadcast(intent)
    }

    private fun contentIsValid(content: Content): Boolean {
        if (content.isVideo() || content.isImage()) {
            return !content.fileName.isNullOrBlank()
        } else if (content.isText()) {
            return !content.text.isNullOrBlank()
        }
        return false
    }

    companion object {
        const val TAG = "[ContentSchedulingDaemon]"
        private val periodTimeInSecond: Long = BuildConfig.SCHEDULE_TIME_PERIOD
        private const val ERROR_LOCAL_PATH_OR_TEXT_NULL_OR_BLANK =
            "It is not possible to schedule the reproduction of the content, " +
                    "it does not have any local path of the downloaded content, " +
                    "or it is of type TEXT but it does not have any text"
    }
}