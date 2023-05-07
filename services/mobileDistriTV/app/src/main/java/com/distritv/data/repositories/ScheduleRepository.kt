package com.distritv.data.repositories

import com.distritv.data.api.ApiService
import com.distritv.data.api.model.ScheduleNetworkMapper
import com.distritv.data.model.DeviceInfo
import com.distritv.data.model.Schedule

class ScheduleRepository(private val apiService: ApiService) : IScheduleRepository {
    override suspend fun fetchScheduleList(deviceInfo: DeviceInfo): List<Schedule> {
        val televisionListResponse = apiService.fetchTelevisionSchedule(deviceInfo.tvCode)
        if (televisionListResponse.isEmpty()) {
            return listOf()
        }
        return ScheduleNetworkMapper.fromFetchScheduleListResponse(televisionListResponse[0].schedules)
    }

    override suspend fun validateTvCode(tvCode: String): Boolean {
        try {
            val televisionListResponse = apiService.fetchTelevisionSchedule(tvCode)
            if (televisionListResponse.isNotEmpty()) {
                return true
            }
            return false
        } catch (e: Exception) {
            return false
        }
    }
}