package com.distritv.data.api.model

data class AlertResponse(
    val id: Long?,
    val url: String?,
    val type: String?,
    val text: String?,
    var durationLeft: Long?
)
