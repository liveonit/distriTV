package com.distritv.data.model

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class Label(
    val id: Long,
    val name: String,
    var description: String
    ) : Parcelable

