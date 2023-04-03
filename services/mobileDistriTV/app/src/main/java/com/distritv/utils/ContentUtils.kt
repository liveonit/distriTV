package com.distritv.utils

import android.content.Context.MODE_PRIVATE
import android.content.SharedPreferences
import android.net.Uri
import com.distritv.data.model.Content
import com.distritv.ui.home.HomeActivity
import java.util.*




const val LOCAL_PATH_PARAM = "localPath"
const val TEXT_PARAM = "text"


val VIDEO_TYPES = listOf("video/mp4")
val IMAGE_TYPES = listOf("image/jpeg", "image/jpg", "image/png")

fun getResourceName(content: Content): String {
    return Uri.parse(content.url).lastPathSegment ?: ""
}

