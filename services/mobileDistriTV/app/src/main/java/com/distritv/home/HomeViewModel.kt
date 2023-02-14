package com.distritv.home

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.distritv.service.FileDownloadService
import kotlinx.coroutines.launch

class HomeViewModel(
    private val fileDownloadService: FileDownloadService
) : ViewModel() {

    private val _downloadResult = MutableLiveData<Boolean>()
    val downloadResult: LiveData<Boolean>
        get() = _downloadResult

    fun downloadFile() {
        viewModelScope.launch {
            _downloadResult.postValue(fileDownloadService.downloadFile())
        }
    }
}