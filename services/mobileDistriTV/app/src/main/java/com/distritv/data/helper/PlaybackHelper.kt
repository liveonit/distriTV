package com.distritv.data.helper

import com.distritv.data.model.PausedContent
import com.distritv.data.service.SharedPreferencesService
import com.distritv.utils.localDateTimeToMillis
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import java.time.LocalDateTime
import java.util.concurrent.TimeUnit

object PlaybackHelper: KoinComponent {

    private val sharedPreferences: SharedPreferencesService by inject()

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

    private fun removePausedContent() {
        sharedPreferences.removeContentInPausedPlayback()
    }
}