package com.distritv.di

import android.app.Application
import com.distritv.BuildConfig
import com.distritv.R
import org.koin.androidx.viewmodel.dsl.viewModelOf
import org.koin.dsl.module
import com.distritv.ui.player.ImageViewModel
import com.distritv.data.service.AlarmService
import com.distritv.data.service.ContentDbService
import com.distritv.data.service.ContentDbHelper
import com.distritv.data.service.SharedPreferencesService
import com.distritv.data.repositories.ContentRepository
import com.distritv.data.repositories.IContentRepository
import com.distritv.data.service.ContentService
import com.distritv.data.ApiService
import com.distritv.utils.LocalDateTimeDeserializer
import com.google.gson.Gson
import com.google.gson.GsonBuilder
import okhttp3.OkHttpClient
import org.koin.android.ext.koin.androidApplication
import org.koin.core.module.dsl.factoryOf
import org.koin.core.module.dsl.singleOf
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import org.koin.core.module.dsl.bind
import java.time.LocalDateTime

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

val gson: Gson = GsonBuilder()
    .registerTypeAdapter(LocalDateTime::class.java, LocalDateTimeDeserializer())
    .create()

fun provideRetrofit(okHttpClient: OkHttpClient): Retrofit {
    return Retrofit.Builder().baseUrl("${BuildConfig.BASE_URL}")
        .client(okHttpClient)
        .addConverterFactory(GsonConverterFactory.create(gson))
        .build()
}

fun provideApiService(retrofit: Retrofit): ApiService = retrofit.create(ApiService::class.java)

val repositoriesModule = module {
    singleOf(::ContentRepository) { bind<IContentRepository>() }
}


val viewModelsModule = module {
    viewModelOf(::ImageViewModel)
}

val servicesModule = module {
    factoryOf(::ContentDbService)
    factoryOf(::ContentDbHelper)
    factoryOf(::ContentService)
    factoryOf(::AlarmService)
    factoryOf(::SharedPreferencesService)
}

val sharedPreferencesModule = module {
    single(){
        getSharedPrefs(androidApplication())
    }
}

fun getSharedPrefs(androidApplication: Application): android.content.SharedPreferences? {
    return androidApplication.getSharedPreferences(
        R.string.app_preference_file_key.toString(),
        android.content.Context.MODE_PRIVATE
    )
}