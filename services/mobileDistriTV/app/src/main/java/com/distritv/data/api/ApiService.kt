package com.distritv.data.api

import com.distritv.data.api.model.TelevisionResponse
import com.distritv.data.model.InfoDevice
import okhttp3.ResponseBody
import retrofit2.http.*


interface ApiService {

    // TODO: Eliminar esta fun luego de que quede habilitado el POST con body en el server
    @GET("television/{tvCode}/schedules")
    suspend fun fetchTelevisionSchedule(@Path("tvCode") tvCode: String): List<TelevisionResponse>

    // TODO: Descomentar esta fun luego de que quede habilitado el POST con body en el server
    /*
    @Headers("Content-Type: application/json")
    @POST("television/{tvCode}/schedules")
    suspend fun fetchTelevisionSchedule(@Path("tvCode") tvCode: String, @Body infoDevice: InfoDevice): TelevisionResponse
    */

    @GET("content/download/{content}")
    suspend fun fetchContent(@Path("content") content: String): ResponseBody

}