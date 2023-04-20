package com.distritv.data.repositories

import com.distritv.data.ApiService
import com.distritv.data.api.model.ContentNetworkMapper
import com.distritv.data.model.Content
import com.distritv.data.model.InfoDevice
import okhttp3.ResponseBody

class ContentRepository(private val apiService: ApiService): IContentRepository {
    override suspend fun fetchContentList(infoDevice: InfoDevice): List<Content> {
        val contentResponseList = apiService.fetchContentList()
        return ContentNetworkMapper.fromFetchContentListResponse(contentResponseList)
    }

    override suspend fun fetchContent(content: String): ResponseBody {
        return apiService.fetchContent(content)
    }
}