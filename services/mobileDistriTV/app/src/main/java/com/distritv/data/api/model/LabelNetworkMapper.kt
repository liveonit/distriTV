package com.distritv.data.api.model

import com.distritv.data.api.util.EntityMapper
import com.distritv.data.model.Label

object LabelNetworkMapper: EntityMapper<LabelResponse, Label> {

    override fun mapFromEntity(entity: LabelResponse): Label {
        return Label(
            id = entity.id ?: -1L,
            name = entity.name ?: "",
            description = entity.description ?: ""
        )
    }

    override fun mapToEntity(domainModel: Label): LabelResponse {
        TODO("Not yet implemented")
    }

    fun fromFetchLabelResponse(networkResponse: List<LabelResponse>?): List<Label> {
        if (networkResponse != null) {
            return networkResponse.map { mapFromEntity(it) }
        }
        return listOf()
    }

}