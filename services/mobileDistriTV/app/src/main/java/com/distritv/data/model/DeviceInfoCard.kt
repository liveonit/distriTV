package com.distritv.data.model

data class DeviceInfoCard(
    val tvCode: String,
    val currentVersionApp: String,
    var connectionStatus: Boolean?
)
