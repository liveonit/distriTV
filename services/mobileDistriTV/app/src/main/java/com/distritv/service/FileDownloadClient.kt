package com.distritv.service

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object FileDownloadClient {

    private val retrofit = Retrofit.Builder()
        .baseUrl("https://knowpathology.com.au/wp-content/uploads/")
        .addConverterFactory(GsonConverterFactory.create())
        .build()

    val service = retrofit.create(FileDownloadService::class.java)
}