package com.distritv.data

import com.distritv.data.model.Content
import com.distritv.data.model.InfoDevice
import okhttp3.ResponseBody
import retrofit2.http.*


interface ApiService {

    @GET("content")
    suspend fun fetchContentList(): List<Content>

    @GET("content/download/{content}")
    suspend fun fetchContent(@Path("content") content: String): ResponseBody

    @Headers("Content-Type: application/json")
    @POST("content")
    suspend fun postContentList(@Body infoDevice: InfoDevice): List<Content>
}