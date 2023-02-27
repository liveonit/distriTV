package com.distritv.data.repositories

import com.distritv.data.ApiService
import com.distritv.data.model.Content
import okhttp3.ResponseBody

class ContentRepository(private val apiService: ApiService): IContentRepository {
    override suspend fun getContentList(): List<Content> {
       return apiService.fetchContentList()
    }

    override suspend fun downloadContent(content: String): ResponseBody {
        return apiService.fetchContent(content)
    }
}