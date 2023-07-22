package com.distritv.data.model

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class PausedContent(
    val content: Content,
    val playStartDate: Long
) : Parcelable
