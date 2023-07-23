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
const val EXTERNAL_STORAGE_ID = "external_storage_id"
const val ANTICIPATION_DAYS = "anticipation_days"
const val CONTENT_IN_PAUSED_PLAYBACK = "content_in_paused_playback"

/*
 * Language
 */
const val AUTOMATIC_POS = 0
const val ENGLISH_POS = 1
const val SPANISH_POS = 2
const val EN_LANG = "en"
const val ES_LANG = "es"
const val DEFAULT_COUNTRY = "US"

/*
 * Anticipation days
 */
const val ANTICIPATION_DAYS_DEFAULT = 7
const val ANTICIPATION_DAYS_SEPARATOR = ";"
const val ANTICIPATION_DAYS_WHITESPACE= " "

/*
 * Others
 */
const val HTTP_NOT_FOUND = 404

const val TEXT_COLOR_DEFAULT = "#000000"
const val TEXT_BACKGROUND_COLOR_DEFAULT = "#FFFFFF"

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