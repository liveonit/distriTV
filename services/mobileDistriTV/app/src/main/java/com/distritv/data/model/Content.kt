package com.distritv.data.model

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class Content(
    val id: Long,
    var name: String,
    var localPath: String,
    val url: String,
    val type: String,
    val text: String,
    var durationInSeconds: Long,
    ) : Parcelable