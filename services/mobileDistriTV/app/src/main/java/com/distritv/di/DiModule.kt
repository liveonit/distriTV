package com.distritv.di

import org.koin.androidx.viewmodel.dsl.viewModelOf
import org.koin.dsl.module
import com.distritv.ui.image.ImageViewModel
import com.distritv.ui.home.HomeViewModel
import com.distritv.data.FileDbService
import com.distritv.data.FileDbHelper
import com.distritv.service.FileDownloadService
import com.distritv.data.ApiService
import com.distritv.ui.video.VideoPlaybackViewModel
import okhttp3.OkHttpClient
import org.koin.core.module.dsl.factoryOf
import org.koin.core.module.dsl.singleOf
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

val networkModule = module {
    singleOf(::OkHttpClient) {
        provideOkHttpClient()
    }

    single<Retrofit> {
        provideRetrofit(get())
    }

    single<ApiService> {
        provideApiService(get())
    }
}

fun provideOkHttpClient(): OkHttpClient {
    return OkHttpClient().newBuilder().build()
}

fun provideRetrofit(okHttpClient: OkHttpClient): Retrofit {
    return Retrofit.Builder().baseUrl("https://freight.cargo.site/w/1366/q/94/i/0126efc3ae5caed95aee17fecb4ad8281e8251613e010208967096283b7e22ba/")
        //.baseUrl("https://knowpathology.com.au/wp-content/uploads/")
        .client(okHttpClient)
        .addConverterFactory(GsonConverterFactory.create())
        .build()
}

fun provideApiService(retrofit: Retrofit): ApiService = retrofit.create(ApiService::class.java)

val viewModelsModule = module {
    viewModelOf(::ImageViewModel)
    viewModelOf(::HomeViewModel)
    viewModelOf(::VideoPlaybackViewModel)
}

val servicesModule = module {
    factoryOf(::FileDbService)
    factoryOf(::FileDbHelper)
    factoryOf(::FileDownloadService)
}