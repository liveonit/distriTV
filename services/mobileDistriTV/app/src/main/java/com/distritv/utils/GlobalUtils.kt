package com.distritv.utils

import android.app.ActivityManager
import android.content.Context
import android.content.Context.ACTIVITY_SERVICE

/*
 * Shared preferences keys
 */
const val TV_CODE = "tvCode"
const val LOCALE = "locale"
const val USE_EXTERNAL_STORAGE = "use_external_storage"
const val ANTICIPATION_DAYS = "anticipation_days"

const val HTTP_NOT_FOUND = 404

const val ANTICIPATION_DAYS_DEFAULT = 7
const val ANTICIPATION_DAYS_SEPARATOR = ";"
const val ANTICIPATION_DAYS_WHITESPACE= " "

@Suppress("DEPRECATION") // Deprecated for third party Services.
fun isServiceRunning(context: Context, serviceClass: Class<*>): Boolean {
    val manager = context.getSystemService(ACTIVITY_SERVICE) as ActivityManager
    for (service in manager.getRunningServices(Int.MAX_VALUE)) {
        if (serviceClass.name == service.service.className) {
            return true
        }
    }
    return false
}