package com.distritv.data

import com.distritv.data.model.Content
import okhttp3.ResponseBody
import retrofit2.http.GET
import retrofit2.http.Path


interface ApiService {

    @GET("content")
    suspend fun fetchContentList(): List<Content>

    @GET("content/download/{content}")
    suspend fun fetchContent(@Path("content") content: String): ResponseBody
}