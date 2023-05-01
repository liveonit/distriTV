package com.distritv.data.repositories

import com.distritv.data.api.ApiService
import okhttp3.ResponseBody

class ContentRepository(private val apiService: ApiService): IContentRepository {
    override suspend fun fetchContent(content: String): ResponseBody {
        return apiService.fetchContent(content)
    }
}