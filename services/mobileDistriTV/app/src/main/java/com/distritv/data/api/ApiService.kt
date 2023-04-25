package com.distritv.data.api

import com.distritv.data.api.model.ContentResponse
import com.distritv.data.model.InfoDevice
import okhttp3.ResponseBody
import retrofit2.http.*


interface ApiService {

    // TODO: Eliminar esta fun luego de que quede habilitado el POST con body en el server
    @GET("content")
    suspend fun fetchContentList(): List<ContentResponse>

    /*
    @Headers("Content-Type: application/json")
    @POST("content")
    suspend fun fetchContentList(@Body infoDevice: InfoDevice): List<ContentResponse>
    */

    @GET("content/download/{content}")
    suspend fun fetchContent(@Path("content") content: String): ResponseBody

}