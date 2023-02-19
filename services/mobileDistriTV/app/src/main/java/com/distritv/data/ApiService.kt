package com.distritv.data

import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.http.GET


interface ApiService {

    //@GET("2018/07/happy-test-screen.jpg")
    @GET("Wallpaper-sirio.png")
    suspend fun downloadFileWithFixedUrl(): ResponseBody
}