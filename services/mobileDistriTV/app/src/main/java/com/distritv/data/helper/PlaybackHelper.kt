package com.distritv.data.helper

import com.distritv.data.model.Alert
import com.distritv.data.model.PausedContent
import com.distritv.data.service.SharedPreferencesService
import com.distritv.utils.localDateTimeToMillis
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import java.time.LocalDateTime
import java.util.concurrent.TimeUnit

object PlaybackHelper: KoinComponent {

    private val sharedPreferences: SharedPreferencesService by inject()

    /*
     * Content
     */

    fun setPausedContent(pausedContent: PausedContent) {
        sharedPreferences.setContentInPausedPlayback(pausedContent)
    }

    fun getPausedContent(): PausedContent? {
        if (existPausedContent()) {
            return sharedPreferences.getContentInPausedPlayback()
        }
        return null
    }

    fun existPausedContent(): Boolean {
        val pausedContent = sharedPreferences.getContentInPausedPlayback() ?: return false
        val currentDate = localDateTimeToMillis(LocalDateTime.now()) ?: return false
        if (pausedContent.playStartDate + TimeUnit.SECONDS.toMillis(pausedContent.content.durationInSeconds) > currentDate) {
            return true
        } else {
            removePausedContent()
        }
        return false
    }

    fun removePausedContent() {
        sharedPreferences.removeContentInPausedPlayback()
    }

    /*
     * Alert
     */

    fun setPausedAlert(alert: Alert) {
        sharedPreferences.setAlertInPausedPlayback(alert)
    }

    fun getPausedAlert(): Alert? {
        if (existPausedAlert()) {
            return sharedPreferences.getAlertInPausedPlayback()
        }
        return null
    }

    fun existPausedAlert(): Boolean {
        val pausedAlert = sharedPreferences.getAlertInPausedPlayback() ?: return false
        if (pausedAlert.durationLeft > 0) {
            return true
        } else {
            removePausedAlert()
        }
        return false
    }

    fun removePausedAlert() {
        sharedPreferences.removeAlertInPausedPlayback()
    }
}