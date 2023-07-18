package com.distritv.data.model

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class ErrorModel(
    val dateTime: String,
    val className: String,
    val message: String
): Parcelable