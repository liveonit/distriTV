package com.distritv.utils

import com.distritv.data.model.Alert

fun Alert.isImage(): Boolean {
    return this.type.substringBefore("/") == IMAGE
}

fun Alert.isText(): Boolean {
    return this.type.substringBefore("/").lowercase() == TEXT
}