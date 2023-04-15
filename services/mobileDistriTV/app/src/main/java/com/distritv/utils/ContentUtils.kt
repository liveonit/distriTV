package com.distritv.utils

import android.net.Uri
import com.distritv.data.model.Content


const val CONTENTS_DIRECTORY = ""

const val DEVICE_ID = "deviceId"

const val CONTENT_PARAM = "contentParam"
const val CONTENT_TYPE_PARAM = "contentType"
const val CONTENT_ID_PARAM = "contentId"
const val CONTENT_DURATION_PARAM = "contentPlaybackDuration"

const val IS_ALARM_PARAM = "isAnAlarm"

const val VIDEO = "video"
const val IMAGE = "image"
const val TEXT = "text"

const val ACTIVE_NO = 0
const val ACTIVE_YES = 1

val VIDEO_TYPES = listOf("video/mp4", "video/webm")
val IMAGE_TYPES = listOf("image/jpeg", "image/jpg", "image/png")
val TEXT_TYPES = listOf("text")

fun getResourceName(content: Content): String {
    return Uri.parse(content.url).lastPathSegment ?: ""
}

fun isVideo(type: String): Boolean {
    return (VIDEO_TYPES.contains(type) && !IMAGE_TYPES.contains(type) && !TEXT_TYPES.contains(type))
}

fun isImage(type: String): Boolean {
    return (IMAGE_TYPES.contains(type) && !VIDEO_TYPES.contains(type) && !TEXT_TYPES.contains(type))
}

fun isText(type: String): Boolean {
    return (TEXT_TYPES.contains(type) && !IMAGE_TYPES.contains(type) && !VIDEO_TYPES.contains(type))
}

fun areEquals(c1: Content, c2: Content): Boolean {
    return c1.id == c2.id && c1.name == c2.name && c1.type == c2.type && c1.url == c2.url
            && c1.text == c2.text && c1.startDate == c2.startDate && c1.endDate == c2.endDate
            && c1.cron == c2.cron && c1.durationInSeconds == c2.durationInSeconds
}