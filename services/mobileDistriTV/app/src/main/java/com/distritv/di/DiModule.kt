package com.distritv.di

import com.distritv.BuildConfig
import org.koin.androidx.viewmodel.dsl.viewModelOf
import org.koin.dsl.module
import com.distritv.ui.image.ImageViewModel
import com.distritv.ui.home.ContentListViewModel
import com.distritv.data.service.ContentDbService
import com.distritv.data.service.ContentDbHelper
import com.distritv.data.repositories.ContentRepository
import com.distritv.data.repositories.IContentRepository
import com.distritv.data.service.ContentService
import com.distritv.data.ApiService
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
    return Retrofit.Builder().baseUrl("${BuildConfig.BASE_URL}")
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
}

val servicesModule = module {
    factoryOf(::ContentDbService)
    factoryOf(::ContentDbHelper)
    factoryOf(::ContentService)
}