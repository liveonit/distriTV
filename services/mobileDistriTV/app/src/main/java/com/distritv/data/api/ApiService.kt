package com.distritv.data.api

import com.distritv.data.api.model.TelevisionResponse
import com.distritv.data.model.DeviceInfo
import okhttp3.ResponseBody
import retrofit2.http.*


interface ApiService {

    /**
     * For validations
     */
    @Headers("Content-Type: application/json")
    @POST("television/{tvCode}/schedules")
    suspend fun fetchTelevisionSchedule(@Path("tvCode") tvCode: String): TelevisionResponse

    @Headers("Content-Type: application/json")
    @POST("television/{tvCode}/schedules")
    suspend fun fetchTelevisionSchedule(@Path("tvCode") tvCode: String, @Body infoDevice: DeviceInfo): TelevisionResponse

    @GET("content/download/{content}")
    suspend fun fetchContent(@Path("content") content: String): ResponseBody

}