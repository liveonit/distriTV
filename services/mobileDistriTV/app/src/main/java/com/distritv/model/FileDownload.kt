package com.distritv.model

data class FileDownload(
    val id: Long?,
    val name: String,
    var localPath: String,
    val url: String,
    val type: String
    )
