package com.distritv.utils

import android.app.ActivityManager
import android.content.Context
import android.content.Context.ACTIVITY_SERVICE

const val CONTENTS_DIRECTORY = ""

const val TV_CODE = "tvCode"
const val LOCALE = "locale"

const val IS_ALERT = "isAlert"
const val CONTENT_PARAM = "contentParam"
const val CONTENT_BUNDLE_PARAM = "contentBundleParam"

const val IS_ALARM_PARAM = "isAnAlarm"

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