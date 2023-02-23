package com.distritv.di

import org.koin.androidx.viewmodel.dsl.viewModelOf
import org.koin.dsl.module
import com.distritv.ui.image.ImageViewModel
import com.distritv.ui.home.ContentListViewModel
import com.distritv.data.FileDbService
import com.distritv.data.FileDbHelper
import com.distritv.data.source.ContentRepository
import com.distritv.data.source.IContentRepository
import com.distritv.service.FileDownloadService
import com.distritv.data.ApiService
import com.distritv.ui.video.VideoPlaybackViewModel
import okhttp3.OkHttpClient
import org.koin.core.module.dsl.factoryOf
import org.koin.core.module.dsl.singleOf
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import org.koin.core.module.dsl.bind

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
    return Retrofit.Builder().baseUrl("http://10.0.2.2/api/v1/")
        .client(okHttpClient)
        .addConverterFactory(GsonConverterFactory.create())
        .build()
}

fun provideApiService(retrofit: Retrofit): ApiService = retrofit.create(ApiService::class.java)

val repositoriesModule = module {
    singleOf(::ContentRepository) { bind<IContentRepository>() }
}


val viewModelsModule = module {
    viewModelOf(::ImageViewModel)
    viewModelOf(::ContentListViewModel)
    viewModelOf(::VideoPlaybackViewModel)
}

val servicesModule = module {
    factoryOf(::FileDbService)
    factoryOf(::FileDbHelper)
    factoryOf(::FileDownloadService)
}