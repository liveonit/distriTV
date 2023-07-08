package com.distritv

import android.app.Activity
import android.app.Application
import com.distritv.di.*
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
                    repositoriesModule,
                    sharedPreferencesModule
                )
            )
        }
    }

    private var currentActivity: Activity? = null
    private var isAlertCurrentlyPlaying = false
    private var isContentCurrentlyPlaying = false
    private var currentlyPlayingContentId: Long? = null

    fun getCurrentActivity(): Activity? {
        return currentActivity
    }

    fun setCurrentActivity(currentActivity: Activity?) {
        this.currentActivity = currentActivity
    }

    fun isAlertCurrentlyPlaying(): Boolean {
        return this.isAlertCurrentlyPlaying
    }

    fun setIfAnyAlertIsCurrentlyPlaying(isPlaying: Boolean) {
        this.isAlertCurrentlyPlaying = isPlaying
    }

    fun isContentCurrentlyPlaying(): Boolean {
        return this.isContentCurrentlyPlaying
    }

    fun setIfAnyContentIsCurrentlyPlaying(isPlaying: Boolean) {
        this.isContentCurrentlyPlaying = isPlaying
    }

    fun getCurrentlyPlayingContentId(): Long? {
        return this.currentlyPlayingContentId
    }

    fun setCurrentlyPlayingContentId(contentId: Long?) {
        this.currentlyPlayingContentId = contentId
    }

}