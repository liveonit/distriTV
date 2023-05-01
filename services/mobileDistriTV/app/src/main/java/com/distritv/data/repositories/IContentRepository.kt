package com.distritv.data.repositories

import okhttp3.ResponseBody

interface IContentRepository {
    suspend fun fetchContent(content: String): ResponseBody
}