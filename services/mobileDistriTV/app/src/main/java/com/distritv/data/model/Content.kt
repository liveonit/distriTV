package com.distritv.data.model


data class Content(
    var idDB: Long?,
    val id: Long,
    var name: String,
    var localPath: String,
    val url: String,
    val type: String,
    val text: String,
    var startDate: Long,
    var endDate: Long,
    var cron: String,
    var durationInSeconds: Long,
    var active: Int
    )
