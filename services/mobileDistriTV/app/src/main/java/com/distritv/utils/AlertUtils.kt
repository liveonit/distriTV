package com.distritv.utils

import android.net.Uri
import com.distritv.BuildConfig
import com.distritv.data.model.Alert

fun Alert.isImage(): Boolean {
    return this.type.substringBefore("/") == IMAGE
}

fun Alert.isText(): Boolean {
    return this.type.substringBefore("/").lowercase() == TEXT
}

fun Alert.getURL(): String{
    val base = BuildConfig.BASE_URL.replace(Uri.parse(BuildConfig.BASE_URL).path ?: "", "")
    return base + Uri.parse(this.url).path
}