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
    private var currentlyPlayingAlertId: Long? = null
    private var alertDurationLeft: Long? = null

    private var skip: Boolean? = null

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

    fun getCurrentlyPlayingAlertId(): Long? {
        return this.currentlyPlayingAlertId
    }

    fun setCurrentlyPlayingAlertId(alertId: Long?) {
        this.currentlyPlayingAlertId = alertId
    }

    fun getAlertDurationLeft(): Long? {
        return this.alertDurationLeft
    }

    fun setAlertDurationLeft(alertDurationLeft: Long?) {
        this.alertDurationLeft = alertDurationLeft
    }

    fun setSkip(skip: Boolean?) {
        this.skip = skip
    }

    fun skip(): Boolean {
        return this.skip ?: false
    }

}