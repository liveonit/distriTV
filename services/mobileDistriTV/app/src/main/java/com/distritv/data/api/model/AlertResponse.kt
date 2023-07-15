package com.distritv.data.api.model

data class AlertResponse(
    val id: Long?,
    val text: String?,
    val duration: Long?,
    var durationLeft: Long?
)
