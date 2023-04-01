package com.distritv.data.model

data class Content(
    val idDB: Long?,
    val id: Long,
    val name: String,
    var localPath: String,
    val url: String,
    val type: String
    )
