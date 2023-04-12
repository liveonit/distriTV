package com.distritv.data.service

import android.content.SharedPreferences
import com.distritv.utils.DEVICE_ID

class SharedPreferencesService (private var sharedPreferences: SharedPreferences) {
    fun addDeviceId(id: String) {
        val editor = sharedPreferences.edit()
        editor.putString(DEVICE_ID, id)
        editor.apply()
    }

    fun getDeviceId(): String? {
        return sharedPreferences.getString(DEVICE_ID, null)
    }

    fun isDeviceRegistered(): Boolean {
        return !getDeviceId().isNullOrEmpty()
    }
}