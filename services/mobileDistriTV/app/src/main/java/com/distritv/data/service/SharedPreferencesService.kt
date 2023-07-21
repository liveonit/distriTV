package com.distritv.data.service

import android.content.SharedPreferences
import com.distritv.data.model.PausedContent
import com.distritv.utils.*
import com.google.gson.Gson

class SharedPreferencesService (private var sharedPreferences: SharedPreferences) {
    fun addTvCode(code: String) {
        val editor = sharedPreferences.edit()
        editor.putString(TV_CODE, code)
        editor.apply()
    }

    fun getTvCode(): String? {
        return sharedPreferences.getString(TV_CODE, null)
    }

    fun isDeviceRegistered(): Boolean {
        return !getTvCode().isNullOrEmpty()
    }

    fun addCustomLocale(locale: String) {
        val editor = sharedPreferences.edit()
        editor.putString(LOCALE, locale)
        editor.apply()
    }

    fun removeCustomLocale() {
        val editor = sharedPreferences.edit()
        editor.remove(LOCALE)
        editor.apply()
    }

    fun getCustomLocale(): String? {
        return sharedPreferences.getString(LOCALE, null)
    }

    fun setExternalStorage(useExternalStorage: Boolean) {
        val editor = sharedPreferences.edit()
        editor.putBoolean(USE_EXTERNAL_STORAGE, useExternalStorage)
        editor.apply()
    }

    fun useExternalStorage(): Boolean {
        return sharedPreferences.getBoolean(USE_EXTERNAL_STORAGE, false)
    }

    fun setAnticipationDays(days: Int) {
        val editor = sharedPreferences.edit()
        editor.putInt(ANTICIPATION_DAYS, days)
        editor.apply()
    }

    fun getAnticipationDays(): Int {
        return sharedPreferences.getInt(ANTICIPATION_DAYS, ANTICIPATION_DAYS_DEFAULT)
    }

    fun setExternalStorageId(id: String) {
        val editor = sharedPreferences.edit()
        editor.putString(EXTERNAL_STORAGE_ID, id)
        editor.apply()
    }

    fun getExternalStorageId(): String? {
        return sharedPreferences.getString(EXTERNAL_STORAGE_ID, null)
    }

    /**
     * For content playback helper
     */
    fun setContentInPausedPlayback(pausedContent: PausedContent) {
        val jsonContent = Gson().toJson(pausedContent)
        val editor = sharedPreferences.edit()
        editor.putString(CONTENT_IN_PAUSED_PLAYBACK, jsonContent)
        editor.apply()
    }

    fun removeContentInPausedPlayback() {
        val editor = sharedPreferences.edit()
        editor.remove(CONTENT_IN_PAUSED_PLAYBACK)
        editor.apply()
    }

    fun getContentInPausedPlayback(): PausedContent? {
        val jsonContent = sharedPreferences.getString(CONTENT_IN_PAUSED_PLAYBACK, null) ?: return null
        return Gson().fromJson(jsonContent, PausedContent::class.java)
    }

}