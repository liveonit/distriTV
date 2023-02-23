package com.distritv.data.source

import com.distritv.data.ApiService
import com.distritv.model.FileDownload
import okhttp3.ResponseBody

class ContentRepository(private val apiService: ApiService): IContentRepository {
    override suspend fun fetchFileDownloadList(): List<FileDownload> {
       return apiService.downloadFileList()
    }

    override suspend fun getFileDownload(file: String): ResponseBody {
        return apiService.downloadFile(file)
    }
}