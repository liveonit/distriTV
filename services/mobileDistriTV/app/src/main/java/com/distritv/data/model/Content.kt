package com.distritv.data.model

import java.time.LocalDateTime

data class Content(
    var idDB: Long?,
    val id: Long,
    var name: String,
    var localPath: String? = "",
    val url: String? = "",
    val type: String,
    val text: String? = "",
    var startDate: LocalDateTime?,
    var endDate: LocalDateTime?,
    var cron: String?,
    var durationInSeconds: Long = 0L,
    var active: Int?
    )
