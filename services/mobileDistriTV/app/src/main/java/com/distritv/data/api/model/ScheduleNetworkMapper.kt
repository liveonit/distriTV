package com.distritv.data.api.model

import com.distritv.data.api.util.EntityMapper
import com.distritv.data.model.Content
import com.distritv.data.model.Schedule
import com.distritv.utils.localDateTimeToMillis
import java.time.ZoneOffset

object ScheduleNetworkMapper: EntityMapper<ScheduleResponse, Schedule> {

    override fun mapFromEntity(entity: ScheduleResponse): Schedule {
        return Schedule(
            id = entity.id ?: -1L,
            contentId = entity.contentId ?: -1L,
            startDate = localDateTimeToMillis(entity.startDate, ZoneOffset.ofHours(+3)) ?: 0L,
            endDate = localDateTimeToMillis(entity.endDate, ZoneOffset.ofHours(+3)) ?: 0L,
            cron = entity.cron ?: "",
            playOnce = playOnce(entity),
            Content(
                id = entity.content?.id ?: -1L,
                name = entity.content?.name ?: "",
                fileName = "",
                url = entity.content?.url ?: "",
                type = entity.content?.type ?: "",
                text = entity.content?.text ?: "",
                durationInSeconds = entity.content?.duration ?: 0L,
                null
            )
        )
    }

    override fun mapToEntity(domainModel: Schedule): ScheduleResponse {
        TODO("Not yet implemented")
    }

    fun fromFetchScheduleListResponse(networkResponse: List<ScheduleResponse>): List<Schedule> {
        return networkResponse.map { mapFromEntity(it) }
    }

    private fun playOnce(entity: ScheduleResponse): Boolean {
        return (entity.cron.isNullOrBlank() || entity.cron == "0 * * * * ?") && (entity.startDate == entity.endDate)
    }

}