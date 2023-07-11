package com.distritv.data.model

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class Alert(
    val id: Long,
    val url: String,
    val type: String,
    val text: String,
    var durationLeft: Long
    ) : Parcelable

