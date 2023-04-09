package com.distritv.data.repositories

import com.distritv.data.model.Content
import okhttp3.ResponseBody

interface IContentRepository {
    suspend fun getContentList(): List<Content>
    suspend fun fetchContent(content: String): ResponseBody
}