package com.distritv.di

import android.app.Application
import com.distritv.BuildConfig
import com.distritv.R
import org.koin.androidx.viewmodel.dsl.viewModelOf
import org.koin.dsl.module
import com.distritv.ui.player.content.ImageViewModel
import com.distritv.ui.home.HomeViewModel
import com.distritv.data.service.AlarmService
import com.distritv.data.service.ContentDBService
import com.distritv.data.service.ScheduleDBService
import com.distritv.data.helper.DBHelper
import com.distritv.data.service.SharedPreferencesService
import com.distritv.data.service.ContentService
import com.distritv.data.service.ScheduleService
import com.distritv.data.api.ApiService
import com.distritv.data.repositories.*
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
import com.distritv.data.service.DeviceInfoService

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
    singleOf(::TelevisionRepository) { bind<ITelevisionRepository>() }
}


val viewModelsModule = module {
    viewModelOf(::ImageViewModel)
    viewModelOf(::HomeViewModel)
}

val servicesModule = module {
    factoryOf(::ContentDBService)
    factoryOf(::ScheduleDBService)
    factoryOf(::DBHelper)
    factoryOf(::ContentService)
    factoryOf(::ScheduleService)
    factoryOf(::AlarmService)
    factoryOf(::SharedPreferencesService)
    factoryOf(::DeviceInfoService)
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