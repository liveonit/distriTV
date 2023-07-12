package com.distritv.data.repositories

import com.distritv.data.model.DeviceInfo
import com.distritv.data.model.Television

interface ITelevisionRepository {
    suspend fun fetchTelevision(deviceInfo: DeviceInfo): Television?
    suspend fun validateTvCode(tvCode: String): Boolean
    suspend fun validateConnection(tvCode: String): Boolean
}