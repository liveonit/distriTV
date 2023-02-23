package com.distritv.ui.home

import android.content.ContentValues.TAG
import android.net.Uri
import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.distritv.data.FileDbService
import com.distritv.data.source.ContentRepository
import com.distritv.model.FileDownload
import com.distritv.service.FileDownloadService
import kotlinx.coroutines.launch

class ContentListViewModel(private val contentRepository: ContentRepository,
                           private val fileDownloadService: FileDownloadService,
                           private val fileDbService: FileDbService
) : ViewModel() {

    private val _loading = MutableLiveData<Boolean>(false)
    val loading: LiveData<Boolean> get() = _loading

    private val _downloadFileList = MutableLiveData<List<FileDownload>>()
    val downloadFileList: LiveData<List<FileDownload>>
        get() = _downloadFileList

    private val _fileDownloaded = MutableLiveData<FileDownload>()
    val fileDownloaded: LiveData<FileDownload>
        get() = _fileDownloaded

    fun fetchFileDownloadList() {
        viewModelScope.launch {
            _loading.value = true
            contentRepository.fetchFileDownloadList().run {

                Log.v(TAG, "aaaa ${this.size}")
                _downloadFileList.postValue(this)

            }
            _loading.value = false
        }
    }

    fun downloadFile(fileDownload: FileDownload) {
        val fileURI = Uri.parse(fileDownload.url)
        val fileName = fileURI.lastPathSegment?:""
        Log.v(TAG, "nombreee $fileName")
        viewModelScope.launch {
            _loading.value = true
            val response = contentRepository.getFileDownload(fileName)
            val result = fileDownloadService.downloadFile(fileDownload, response)
            if(!result.equals(-1)){
                _fileDownloaded.postValue(fileDbService.findFileById(result))
            }
            _loading.value = false
        }
    }

}