package com.distritv.data.repositories

import com.distritv.data.api.ApiService
import com.distritv.data.api.model.ScheduleNetworkMapper
import com.distritv.data.model.DeviceInfo
import com.distritv.data.model.Schedule

class ScheduleRepository(private val apiService: ApiService) : IScheduleRepository {
    override suspend fun fetchScheduleList(deviceInfo: DeviceInfo): List<Schedule> {
        val televisionListResponse = apiService.fetchTelevisionSchedule(deviceInfo.tvCode, deviceInfo)
        if (televisionListResponse.isEmpty()) {
            return listOf()
        }
        return ScheduleNetworkMapper.fromFetchScheduleListResponse(televisionListResponse[0].schedules)
    }

    override suspend fun validateTvCode(tvCode: String): Boolean {
        val televisionListResponse = apiService.fetchTelevisionSchedule(tvCode)
        if (televisionListResponse.isNotEmpty()) {
            return true
        }
        return false
    }

    override suspend fun validateConnection(tvCode: String): Boolean {
        return try {
            apiService.fetchTelevisionSchedule(tvCode)
            true
        } catch (e: Exception) {
            false
        }
    }
}