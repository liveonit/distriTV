package com.distritv.data.repositories

import com.distritv.data.model.InfoDevice
import com.distritv.data.model.Schedule

interface IScheduleRepository {

    suspend fun fetchScheduleList(infoDevice: InfoDevice): List<Schedule>
    suspend fun validateTvCode(tvID: String): Boolean
}