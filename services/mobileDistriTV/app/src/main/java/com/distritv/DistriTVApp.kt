package com.distritv

import android.annotation.SuppressLint
import android.app.Activity
import android.app.Application
import android.content.Context
import android.content.res.Configuration
import android.content.res.Resources
import com.distritv.data.service.SharedPreferencesService
import com.distritv.di.*
import org.koin.android.ext.koin.androidContext
import org.koin.android.ext.koin.androidLogger
import org.koin.core.context.startKoin
import org.koin.java.KoinJavaComponent.inject
import java.util.*


class DistriTVApp: Application() {

    private val sharedPreferences: SharedPreferencesService by inject(SharedPreferencesService::class.java)

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
        appContext = applicationContext
        setCustomOrSystemAppLanguage()
    }

    private var currentActivity: Activity? = null
    private var isAlertCurrentlyPlaying = false
    private var isContentCurrentlyPlaying = false
    private var currentlyPlayingContentId: Long? = null
    private var currentlyPlayingAlertId: Long? = null
    private var alertDurationLeft: Long? = null

    private var skipClearing: Boolean? = null

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

    fun setSkipClearing(skip: Boolean?) {
        this.skipClearing = skip
    }

    fun skipClearing(): Boolean {
        return this.skipClearing ?: false
    }

    fun alertWasPausedOrDestroyed(): Boolean {
        return !this.isAlertCurrentlyPlaying && this.currentlyPlayingAlertId != null
                && this.alertDurationLeft != null && this.alertDurationLeft!! > 0L
    }

    /**
     * Set language selected by the user, system language otherwise
     */
    private fun setCustomOrSystemAppLanguage() {
        val locale = sharedPreferences.getCustomLocale()
        if (locale != null) {
            setAppLanguage(Locale(locale.split("_")[0], locale.split("_")[1]))
        } else {
            setSystemAppLanguage()
        }
    }

    fun setSystemAppLanguage() {
        val systemLocale: Locale = Resources.getSystem().configuration.locales[0]
        setAppLanguage(systemLocale)
    }

    fun setAppLanguage(locale: Locale) {
        Locale.setDefault(locale)
        val config = Configuration()
        config.setLocale(locale)
        if (appContext.resources != null) {
            appContext.resources.updateConfiguration(config, appContext.resources.displayMetrics)
        }
    }

    companion object {

        private lateinit var appContext: Context

        // Singleton instance
        @SuppressLint("StaticFieldLeak")
        private var instance: DistriTVApp? = null

        @JvmStatic
        fun getInstance(): DistriTVApp {
            if (instance == null) {
                instance = DistriTVApp()
            }
            return instance as DistriTVApp
        }
    }
}