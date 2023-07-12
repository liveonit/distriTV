package com.distritv.data.repositories

import com.distritv.data.api.ApiService
import com.distritv.data.api.model.AlertNetworkMapper
import com.distritv.data.api.model.ScheduleNetworkMapper
import com.distritv.data.model.Alert
import com.distritv.data.model.DeviceInfo
import com.distritv.data.model.Television

class TelevisionRepository(private val apiService: ApiService) : ITelevisionRepository {
    override suspend fun fetchTelevision(deviceInfo: DeviceInfo): Television? {
        val televisionListResponse = apiService.fetchTelevisionSchedule(deviceInfo.tvCode, deviceInfo)
        if (televisionListResponse.isEmpty()) {
            return null
        }

        val schedules = ScheduleNetworkMapper.fromFetchScheduleListResponse(televisionListResponse[0].schedules)
        val alertResponse = televisionListResponse[0].alert
        var alert: Alert? = null
        if(alertResponse != null) {
            alert = AlertNetworkMapper.fromFetchAlertResponse(alertResponse)
        }

        return Television(schedules, alert)
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