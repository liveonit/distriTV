package com.distritv.data.model

data class Schedule(
    val id: Long,
    val contentId: Long,
    var startDate: Long,
    var endDate: Long,
    var cron: String,
    var content: Content?
)
