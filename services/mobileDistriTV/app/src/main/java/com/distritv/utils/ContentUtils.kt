package com.distritv.utils

import android.net.Uri
import com.distritv.data.model.Content

const val CONTENT_PARAM = "contentParam"
const val CONTENT_TYPE_PARAM = "contentType"
const val CONTENT_ID_PARAM = "contentId"
const val CONTENT_DURATION_PARAM = "contentPlaybackDuration"

const val IS_ALARM_PARAM = "isAnAlarm"

const val VIDEO = "video"
const val IMAGE = "image"

const val ACTIVE_NO = 0
const val ACTIVE_YES = 1

val VIDEO_TYPES = listOf("video/mp4")
val IMAGE_TYPES = listOf("image/jpeg", "image/jpg", "image/png")

fun getResourceName(content: Content): String {
    return Uri.parse(content.url).lastPathSegment ?: ""
}

fun isVideo(type: String): Boolean {
    return (VIDEO_TYPES.contains(type) && !IMAGE_TYPES.contains(type))
}

fun isImage(type: String): Boolean {
    return (IMAGE_TYPES.contains(type) && !VIDEO_TYPES.contains(type))
}