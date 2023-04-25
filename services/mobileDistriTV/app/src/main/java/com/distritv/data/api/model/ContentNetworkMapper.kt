package com.distritv.data.api.model

import com.distritv.data.api.util.EntityMapper
import com.distritv.data.model.Content
import com.distritv.utils.ACTIVE_YES
import com.distritv.utils.DATE_FORMAT
import com.distritv.utils.isVideo
import com.distritv.utils.localDateTimeToMillis
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

object ContentNetworkMapper: EntityMapper<ContentResponse, Content> {

    override fun mapFromEntity(entity: ContentResponse): Content {

        // TODO: prueba -> eliminar
        tempSetFields(entity)

        return Content(
            idDB = null,
            id = entity.id ?: -1L,
            name = entity.name ?: "",
            localPath = "",
            url = entity.url ?: "",
            type = entity.type ?: "",
            text = entity.text ?: "",
            startDate = localDateTimeToMillis(entity.startDate) ?: 0L,
            endDate = localDateTimeToMillis(entity.endDate) ?: 0L,
            cron = entity.cron ?: "",
            durationInSeconds = entity.duration ?: 0L,
            active = ACTIVE_YES
        )
    }

    override fun mapToEntity(domainModel: Content): ContentResponse {
        TODO("Not yet implemented")
    }

    fun fromFetchContentListResponse(networkResponse: List<ContentResponse>): List<Content> {
        return networkResponse.map { mapFromEntity(it) }
    }

    /**
     * solo a modo de prueba mientras no este implementado en el server
     * TODO eliminar
     */
    private fun tempSetFields(entity: ContentResponse) {

        val pattern = DateTimeFormatter.ofPattern(DATE_FORMAT)

        val startDate = "2023-04-07 20:00:00"
        //entity.startDate = LocalDateTime.parse(startDate, pattern)

        val endDate = "2023-04-30 20:00:00"
        //entity.endDate = LocalDateTime.parse(endDate, pattern)

        //content.cron = "0 0/2 * * * ?" //cada 2 minutos
        //content.cron = "0 0/1 * * * ?" //cada 1 minuto
        //content.cron = "0 0/5 * * * ?" //cada 5 minutos
        entity.cron = "0/50 * * * * ?" //cada 30 segundos

        if(!entity.type.isNullOrBlank() && isVideo(entity.type)){
            entity.duration = 0
        }else{
            entity.duration = 20
        }
    }

}