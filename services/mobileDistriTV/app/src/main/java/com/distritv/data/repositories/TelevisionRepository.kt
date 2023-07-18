package com.distritv.data.repositories

import com.distritv.data.api.ApiService
import com.distritv.data.api.model.AlertNetworkMapper
import com.distritv.data.api.model.LabelNetworkMapper
import com.distritv.data.api.model.ScheduleNetworkMapper
import com.distritv.data.model.Alert
import com.distritv.data.model.DeviceInfo
import com.distritv.data.model.Label
import com.distritv.data.model.Television

class TelevisionRepository(private val apiService: ApiService) : ITelevisionRepository {
    override suspend fun fetchTelevision(deviceInfo: DeviceInfo): Television? {
        val televisionListResponse = apiService.fetchTelevisionSchedule(deviceInfo.tvCode, deviceInfo)

        val schedules = ScheduleNetworkMapper.fromFetchScheduleListResponse(televisionListResponse.schedules)

        val alertResponse = televisionListResponse.alert
        var alert: Alert? = null
        if(alertResponse != null) {
            alert = AlertNetworkMapper.fromFetchAlertResponse(alertResponse)
        }
        var labels: List<Label>? = null
        if(televisionListResponse.labels != null){
            labels = LabelNetworkMapper.fromFetchLabelResponse(televisionListResponse.labels)
        }

        return Television(schedules, alert, labels)
    }

    override suspend fun validateTvCode(tvCode: String): Boolean {
        return apiService.fetchTelevisionSchedule(tvCode).tvCode == tvCode
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