package com.distritv

import android.app.Activity
import android.app.Application
import com.distritv.di.networkModule
import com.distritv.di.repositoriesModule
import com.distritv.di.servicesModule
import com.distritv.di.viewModelsModule
import org.koin.android.ext.koin.androidContext
import org.koin.android.ext.koin.androidLogger
import org.koin.core.context.startKoin


class DistriTVApp: Application() {

    override fun onCreate() {
        super.onCreate()
        startKoin {
            androidLogger()
            androidContext(this@DistriTVApp)
            modules(
                listOf(
                    viewModelsModule,
                    servicesModule,
                    networkModule,
                    repositoriesModule
                )
            )
        }
    }

    private var currentActivity: Activity? = null
    private var isContentCurrentlyPlaying = false

    fun getCurrentActivity(): Activity? {
        return currentActivity
    }

    fun setCurrentActivity(currentActivity: Activity?) {
        this.currentActivity = currentActivity
    }

    fun isContentCurrentlyPlaying(): Boolean {
        return this.isContentCurrentlyPlaying
    }

    fun setContentCurrentlyPlaying(isPlaying: Boolean) {
        this.isContentCurrentlyPlaying = isPlaying
    }

}