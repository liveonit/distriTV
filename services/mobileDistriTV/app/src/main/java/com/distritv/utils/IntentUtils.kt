package com.distritv.utils

import android.annotation.SuppressLint
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Bundle
import com.distritv.data.model.Alert
import com.distritv.launcher.ContentPlaybackLauncher
import com.distritv.data.model.Content
import com.distritv.launcher.AlertLauncher
import java.util.*

/*
 * Intent params
 */
const val ALERT_PARAM = "alertParam"
const val CONTENT_PARAM = "contentParam"
const val CONTENT_PLAY_START_DATE_PARAM = "contentPlayStartDateParam"
const val ALERT_BUNDLE_PARAM = "alertBundleParam"
const val CONTENT_BUNDLE_PARAM = "contentBundleParam"

const val IS_ALARM_PARAM = "isAnAlarm"

@SuppressLint("UnspecifiedImmutableFlag")
fun createPendingIntent(context: Context, content: Content, requestCode: Int): PendingIntent {
    val intent = createIntent(context, content, true)
    return PendingIntent.getBroadcast(
        context,
        requestCode,
        intent,
        PendingIntent.FLAG_UPDATE_CURRENT
    )
}

fun createIntent(context: Context, content: Content, isAlarm: Boolean): Intent {
    val bundle = Bundle()
    bundle.putParcelable(CONTENT_PARAM, content)
    bundle.putBoolean(IS_ALARM_PARAM, isAlarm)

    val intent = Intent(context, ContentPlaybackLauncher::class.java)
    intent.setExtrasClassLoader(Content::class.java.classLoader)
    intent.putExtra(CONTENT_BUNDLE_PARAM, bundle)

    return intent
}

fun createIntentAlert(context: Context, alert: Alert): Intent {
    val bundle = Bundle()
    bundle.putParcelable(ALERT_PARAM, alert)

    val intent = Intent(context, AlertLauncher::class.java)
    intent.setExtrasClassLoader(Alert::class.java.classLoader)
    intent.putExtra(ALERT_BUNDLE_PARAM, bundle)

    return intent
}
