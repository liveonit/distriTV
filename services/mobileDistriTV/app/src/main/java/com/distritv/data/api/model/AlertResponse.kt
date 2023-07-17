package com.distritv.data.api.model

data class AlertResponse(
    val id: Long?,
    val text: String?,
    val duration: Long?,
    val durationLeft: Long?,
    val started: Boolean?
)
