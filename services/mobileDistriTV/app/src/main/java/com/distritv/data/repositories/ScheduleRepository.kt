package com.distritv.data.repositories

import com.distritv.data.api.ApiService
import com.distritv.data.api.model.ScheduleNetworkMapper
import com.distritv.data.model.InfoDevice
import com.distritv.data.model.Schedule

class ScheduleRepository(private val apiService: ApiService) : IScheduleRepository {
    override suspend fun fetchScheduleList(infoDevice: InfoDevice): List<Schedule> {
        val televisionListResponse = apiService.fetchTelevisionSchedule(infoDevice.idDevice)
        if (televisionListResponse.isEmpty()) {
            return listOf()
        }
        return ScheduleNetworkMapper.fromFetchScheduleListResponse(televisionListResponse[0].schedules)
    }
}