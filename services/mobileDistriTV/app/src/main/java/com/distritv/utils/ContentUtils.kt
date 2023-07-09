package com.distritv.utils

import android.net.Uri
import android.util.Log
import com.distritv.data.model.Content
import java.io.File


private const val MSG_IS_INVALID_ERROR = "The content %s is not valid => %s"

const val VIDEO = "video"
const val IMAGE = "image"
const val TEXT = "text"

fun Content.getResourceName(): String {
    return Uri.parse(this.url).lastPathSegment ?: ""
}

fun Content.isImage(): Boolean {
    return this.type.substringBefore("/") == IMAGE
}

fun Content.isVideo(): Boolean {
    return this.type.substringBefore("/") == VIDEO
}

fun Content.isText(): Boolean {
    return this.type.substringBefore("/").lowercase() == TEXT
}

fun Content.areEquals(other: Content): Boolean {
    return this.id == other.id && this.name == other.name && this.type == other.type && this.url == other.url
            && this.text == other.text && this.durationInSeconds == other.durationInSeconds
}

fun Content.isValid(tag: String): Boolean {
    if (this.id == -1L) {
        Log.e(tag, String.format(MSG_IS_INVALID_ERROR, "id", this))
        return false
    }
    if (this.type.isBlank()) {
        Log.e(tag, String.format(MSG_IS_INVALID_ERROR, "type", this))
        return false
    }
    if (this.isText()) {
        if (this.text.isBlank()) {
            Log.e(tag, String.format(MSG_IS_INVALID_ERROR, "text", this))
            return false
        }
    } else {
        if (this.name.isBlank()) {
            Log.e(tag, String.format(MSG_IS_INVALID_ERROR, "name", this))
            return false
        }
        if (this.url.isBlank()) {
            Log.e(tag, String.format(MSG_IS_INVALID_ERROR, "url", this))
            return false
        }
    }
    return true
}

/**
 * If content type is not Text, check if the content name already exists.
 * @param tag: TAG
 * @param contentList: active content list
 */
fun Content.existsContentName(tag: String, contentList: List<Content>): Boolean {
    if (this.isText()) {
        return false
    }
    val result =
        contentList.firstOrNull { !it.isText() && it.id != this.id && it.name == this.name }
    if (result != null) {
        Log.e(tag, "The content name already exists => id: ${this.id}, name: ${this.name}")
        return true
    }
    return false
}

fun Content.fileExists(directory: String): Boolean {
    return if (this.isImage() || this.isVideo()) {
        File(directory, this.fileName).exists()
    } else {
        true
    }
}
