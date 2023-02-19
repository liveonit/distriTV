package com.distritv.model

data class FileDownload(
    val id: Long?,
    val name: String,
    val localPath: String,
    val url: String,
    val contentType: String
    )
