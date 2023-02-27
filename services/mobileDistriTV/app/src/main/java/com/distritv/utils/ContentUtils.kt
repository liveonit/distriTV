package com.distritv.utils

import android.net.Uri
import com.distritv.data.model.Content

const val LOCAL_PATH_PARAM = "localPath"

val VIDEO_TYPES = listOf("video/mp4")
val IMAGE_TYPES = listOf("image/jpeg", "image/jpg", "image/png")

fun getResourceName(content: Content): String {
    return Uri.parse(content.url).lastPathSegment ?: ""
}