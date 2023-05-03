package com.distritv.data.api.model

import java.time.LocalDateTime

data class ContentResponse(
    val id: Long?,
    var name: String?,
    val url: String?,
    val type: String?,
    val text: String?,
    var startDate: LocalDateTime?,
    var endDate: LocalDateTime?,
    var cron: String?,
    var duration: Long?,
)
