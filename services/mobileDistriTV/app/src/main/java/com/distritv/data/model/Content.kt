package com.distritv.data.model

import java.time.LocalDateTime

data class Content(
    val idDB: Long?,
    val id: Long,
    val name: String,
    var localPath: String,
    val url: String,
    val type: String,
    var active: Int?,
    var startDate: LocalDateTime?,
    var endDate: LocalDateTime?,
    var cron: String?,
    var durationInSeconds: Long
    )
