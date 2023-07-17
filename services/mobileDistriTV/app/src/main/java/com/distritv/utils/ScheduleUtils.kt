package com.distritv.utils

import android.util.Log
import com.distritv.data.model.Schedule
import java.time.LocalDateTime

private const val MSG_IS_INVALID_ERROR = "The schedule %s is not valid => %s"

fun Schedule.isValid(tag: String): Boolean {
    if (this.id == -1L) {
        Log.e(tag, String.format(MSG_IS_INVALID_ERROR, "id", this))
        return false
    }
    if (this.contentId == -1L) {
        Log.e(tag, String.format(MSG_IS_INVALID_ERROR, "content id", this))
        return false
    }
    return true
}

fun Schedule.isValidWithContent(tag: String): Boolean {
    if (this.content == null) {
        Log.e(tag, String.format(MSG_IS_INVALID_ERROR, "content", this))
        return false
    }
    return this.isValid(tag)
}

fun Schedule.areEquals(other: Schedule): Boolean {
    return this.id == other.id && this.contentId == other.contentId && this.cron == other.cron
            && this.startDate == other.startDate && this.endDate == other.endDate
}

fun Schedule.validEndDate(): Boolean {
    return this.endDate >= (localDateTimeToMillis(LocalDateTime.now()) ?: 0L)
}
