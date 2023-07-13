package com.distritv.data.api.model

import com.distritv.data.api.util.EntityMapper
import com.distritv.data.model.Content
import com.distritv.data.model.Schedule
import com.distritv.utils.DATE_FORMAT
import com.distritv.utils.localDateTimeToMillis
import java.time.ZoneOffset
import java.time.format.DateTimeFormatter

object ScheduleNetworkMapper: EntityMapper<ScheduleResponse, Schedule> {

    override fun mapFromEntity(entity: ScheduleResponse): Schedule {

        // TODO: prueba -> eliminar
        tempSetFields(entity)

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
        return (entity.cron.isNullOrBlank() || entity.cron == "* * * * * ?") && (entity.startDate == entity.endDate)
    }

    /**
     * solo a modo de prueba mientras no este implementado en el server
     * TODO eliminar
     */
    private fun tempSetFields(entity: ScheduleResponse) {

        val pattern = DateTimeFormatter.ofPattern(DATE_FORMAT)

        val startDate = "2023-04-01T22:10:00.000Z"
        //entity.startDate = LocalDateTime.parse(startDate, pattern)

        val endDate = "2023-04-30T22:10:00.000Z"
        //entity.endDate = LocalDateTime.parse(endDate, pattern)

        //content.cron = "0 0/2 * * * ?" //cada 2 minutos
        //content.cron = "0 0/1 * * * ?" //cada 1 minuto
        //content.cron = "0 0/5 * * * ?" //cada 5 minutos
        //entity.cron = "0/30 * * * * ?" //cada 30 segundos

        if(!entity.content?.type.isNullOrBlank() && entity.content?.type?.substringBefore("/") == "video"){
            entity.content?.duration = 0
        }else{
            entity.content?.duration = 20
        }
    }



}