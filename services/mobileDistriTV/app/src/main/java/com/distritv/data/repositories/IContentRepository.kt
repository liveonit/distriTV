package com.distritv.data.repositories

import com.distritv.data.model.Content
import com.distritv.data.model.InfoDevice
import okhttp3.ResponseBody

interface IContentRepository {
    suspend fun fetchContentList(infoDevice: InfoDevice): List<Content>
    suspend fun fetchContent(content: String): ResponseBody
}