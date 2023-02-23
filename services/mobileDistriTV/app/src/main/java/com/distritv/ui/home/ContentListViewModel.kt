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


    private val _downloadResult = MutableLiveData<Boolean>()
    val downloadResult: LiveData<Boolean>
        get() = _downloadResult

    private val _fileDownloaded = MutableLiveData<FileDownload>()
    val fileDownloaded: LiveData<FileDownload>
        get() = _fileDownloaded

    private val _fileDownloadedPath = MutableLiveData<String>()
    val fileDownloadedPath: LiveData<String>
        get() = _fileDownloadedPath

    fun fetchFileDownloadList() {
        viewModelScope.launch {
            _loading.value = true
            contentRepository.fetchFileDownloadList().run {

                Log.v(TAG, "aaaa ${this.size}")
                _downloadFileList.postValue(this)

            }
            _loading.value = false
           // _downloadFileList.postValue(fileDownloadRepository.fetchFileDownloadList())
        }
    }

    fun downloadFile(fileDownload: FileDownload) {
        val fileURI = Uri.parse(fileDownload.url)
        val fileName = fileURI.lastPathSegment?:""
        Log.v(TAG, "nombreee $fileName")
        viewModelScope.launch {
            val response = contentRepository.getFileDownload(fileName)
            val result = fileDownloadService.downloadFile(fileDownload, response)
            _downloadResult.postValue(!result.equals(-1))
            if(!result.equals(-1)){
                _fileDownloaded.postValue(getPath(result))
            }
        }
    }

    fun getPath(id: Long): FileDownload {
       return fileDbService.findFileById(id)
    }
}