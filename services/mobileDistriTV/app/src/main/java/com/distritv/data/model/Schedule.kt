package com.distritv.data.model

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class Schedule(
    val id: Long,
    val contentId: Long,
    var startDate: Long,
    var endDate: Long,
    var cron: String,
    val playOnce: Boolean,
    var content: Content?
) : Parcelable
