package com.distritv.utils

import android.annotation.SuppressLint
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Bundle
import com.distritv.daemon.ContentPlaybackLauncher
import com.distritv.data.model.Content
import java.util.*


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
