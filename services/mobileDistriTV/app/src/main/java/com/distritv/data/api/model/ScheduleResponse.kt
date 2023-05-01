package com.distritv.data.api.model

import java.time.LocalDateTime

data class ScheduleResponse(
    val id: Long?,
    val contentId: Long?,
    val labelId: Long?,
    val televisionId: Long?,
    var startDate: LocalDateTime?,
    var endDate: LocalDateTime?,
    var cron: String?,
    val content: ContentResponse?
)
