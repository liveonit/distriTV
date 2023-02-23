package com.distritv.data.source

import com.distritv.model.FileDownload
import okhttp3.ResponseBody

interface IContentRepository {
    suspend fun fetchFileDownloadList(): List<FileDownload>
    suspend fun getFileDownload(file: String): ResponseBody
}