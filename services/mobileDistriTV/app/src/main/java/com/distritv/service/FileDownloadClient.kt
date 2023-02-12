package com.distritv.service

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object FileDownloadClient {

    private val retrofit = Retrofit.Builder()
        .baseUrl("https://freight.cargo.site/w/1366/q/94/i/0126efc3ae5caed95aee17fecb4ad8281e8251613e010208967096283b7e22ba/")
        //.baseUrl("https://knowpathology.com.au/wp-content/uploads/")
        .addConverterFactory(GsonConverterFactory.create())
        .build()

    val service = retrofit.create(FileDownloadService::class.java)
}