package com.distritv.data.service

import android.content.SharedPreferences
import com.distritv.utils.USE_EXTERNAL_STORAGE
import com.distritv.utils.LOCALE
import com.distritv.utils.TV_CODE

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
}