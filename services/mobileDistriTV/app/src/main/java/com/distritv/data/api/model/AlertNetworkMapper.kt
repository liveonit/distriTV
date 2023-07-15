package com.distritv.data.api.model

import com.distritv.data.api.util.EntityMapper
import com.distritv.data.model.Alert

object AlertNetworkMapper: EntityMapper<AlertResponse, Alert> {

    override fun mapFromEntity(entity: AlertResponse): Alert {
        return Alert(
            id = entity.id ?: -1L,
            text = entity.text ?: "",
            durationLeft = entity.durationLeft ?: 0L
        )
    }

    override fun mapToEntity(domainModel: Alert): AlertResponse {
        TODO("Not yet implemented")
    }

    fun fromFetchAlertResponse(networkResponse: AlertResponse): Alert {
        return mapFromEntity(networkResponse)
    }

}