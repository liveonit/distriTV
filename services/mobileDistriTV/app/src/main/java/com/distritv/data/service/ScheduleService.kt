package com.distritv.data.service

import android.util.Log
import com.distritv.data.model.Schedule
import com.distritv.utils.localDateTimeToMillis
import java.time.LocalDateTime
import java.util.concurrent.TimeUnit

class ScheduleService(private val scheduleDBService: ScheduleDBService,
                      private val contentDbService: ContentDBService,
                      private val sharedPreferencesService: SharedPreferencesService) {

    fun checkAndDeletedSchedule(schedule: Schedule, responseScheduleList: List<Schedule>) {
        val result = responseScheduleList.firstOrNull { it.id == schedule.id }
        if (result == null) {
            deletedSchedule(schedule)
        }
    }

    fun deletedSchedule(schedule: Schedule) {
        if (scheduleDBService.delete(schedule.id) > 0) {
            Log.i(TAG, "Schedule was deleted: $schedule")
        }
    }

    /**
     * Insert schedule into DB
     */
    fun saveNewSchedule(schedule: Schedule): Long {
        return try {
            scheduleDBService.insert(schedule)
        } catch (e: Exception) {
            Log.d(TAG, "${e.message}")
            -1L
        }
    }

    /**
     * Update schedule into DB
     */
    fun saveExistingSchedule(schedule: Schedule): Long {
        return try {
            val result = scheduleDBService.update(schedule.id, schedule)
            if (result > 0) {
                return schedule.id
            }
            -1L
        } catch (e: Exception) {
            Log.d(TAG, "${e.message}")
            -1L
        }
    }

    fun deleteExpiredSchedule() {
        val expiredSchedules = scheduleDBService.findExpiredSchedules()
        expiredSchedules.forEach {schedule ->
            if (scheduleDBService.delete(schedule.id) > 0) {
                Log.i(TAG, "Schedule was deleted: $schedule")
            }
        }
    }

    fun getCurrentSchedules(currentMillisecond: Long, intervalEndTimeInMillis: Long): List<Schedule> {
        return scheduleDBService.findCurrentSchedules(currentMillisecond, intervalEndTimeInMillis)
    }

    fun getCurrentSchedulesWithContents(currentMillisecond: Long, intervalEndTimeInMillis: Long): List<Schedule> {
        return addContents(scheduleDBService.findCurrentSchedules(currentMillisecond, intervalEndTimeInMillis))
    }

    fun getAllSchedules(): List<Schedule> {
        return scheduleDBService.findAllSchedules()
    }

    fun getAllSchedulesWithContents(): List<Schedule> {
        return addContents(scheduleDBService.findAllSchedules())
    }

    private fun addContents(scheduleList: List<Schedule>): List<Schedule> {
        return scheduleList.map { schedule ->
            schedule.content = contentDbService.findByContentId(schedule.contentId)
            schedule.copy()
        }
    }

    fun existsScheduleWithContentId(id: Long): Boolean {
        return scheduleDBService.existsScheduleWithContentId(id)
    }

    /**
     * @return true if the start date is less than anticipation days away
     */
    fun meetAnticipationDays(startDate: Long): Boolean {
        val anticipationDays = sharedPreferencesService.getAnticipationDays().toLong()
        return startDate <= (localDateTimeToMillis(LocalDateTime.now())?.plus(TimeUnit.DAYS.toMillis(anticipationDays)) ?: 0L)
    }

    companion object {
        const val TAG = "[ScheduleService]"
    }

}