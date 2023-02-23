package com.distritv.data

import com.distritv.model.FileDownload
import okhttp3.ResponseBody
import retrofit2.http.GET
import retrofit2.http.Path


interface ApiService {

    @GET("content")
    suspend fun downloadFileList(): List<FileDownload>

    @GET("content/download/{file}")
    suspend fun downloadFile(@Path("file") file: String): ResponseBody
}