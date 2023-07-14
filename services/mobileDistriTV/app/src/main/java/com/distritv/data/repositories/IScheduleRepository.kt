package com.distritv.data.repositories

import com.distritv.data.model.DeviceInfo
import com.distritv.data.model.Schedule

interface IScheduleRepository {

    suspend fun fetchScheduleList(deviceInfo: DeviceInfo): List<Schedule>
    suspend fun validateTvCode(tvCode: String): Boolean
    suspend fun validateConnection(tvCode: String): Boolean
}