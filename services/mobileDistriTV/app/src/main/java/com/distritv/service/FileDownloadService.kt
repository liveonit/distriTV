package com.distritv.service

import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.http.GET


interface FileDownloadService {

    @GET("2018/07/happy-test-screen.jpg")
    fun downloadFileWithFixedUrl(): Call<ResponseBody>
}