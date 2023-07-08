package com.distritv.data.api.model

data class TelevisionResponse(
    val id: Long,
    val name: String,
    val institutionId: Long,
    val ip: String,
    val mac: String,
    val tvCode: String,
    val schedules: List<ScheduleResponse>,
    val alert: AlertResponse?
)
