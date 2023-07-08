package com.distritv.data.api.model

data class AlertResponse(
    val id: Long?,
    var name: String?,
    val url: String?,
    val type: String?,
    val text: String?,
    var duration: Long?
)
