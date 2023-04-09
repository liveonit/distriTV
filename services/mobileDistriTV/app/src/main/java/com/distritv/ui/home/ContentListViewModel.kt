package com.distritv.ui.home

import android.content.ContentValues.TAG
import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.distritv.data.service.ContentDbService
import com.distritv.data.repositories.ContentRepository
import com.distritv.data.model.Content
import com.distritv.data.service.ContentService
import com.distritv.utils.getResourceName
import kotlinx.coroutines.launch


class ContentListViewModel(private val contentRepository: ContentRepository,
                           private val contentService: ContentService,
                           private val contentDbService: ContentDbService
) : ViewModel() {

    private val _loading = MutableLiveData<Boolean>(false)
    val loading: LiveData<Boolean> get() = _loading

    private val _contentList = MutableLiveData<List<Content>>()
    val contentList: LiveData<List<Content>>
        get() = _contentList

    private val _contentDownloaded = MutableLiveData<Content>()
    val contentDownloaded: LiveData<Content>
        get() = _contentDownloaded

    fun getContentList() {
        viewModelScope.launch {
            _loading.value = true
            try {
                contentRepository.getContentList().run {
                    _contentList.postValue(this)
                }
            } catch (e: Exception) {
                Log.v(TAG, "Could not connect to the server.", e)
            }
            _loading.value = false
        }
    }

    fun downloadContent(content: Content) {
        viewModelScope.launch {
            _loading.value = true
            if(!content.text.isNullOrEmpty()){
                val resultId = contentService.saveContent(content)
                _contentDownloaded.postValue(contentDbService.findFileById(resultId))
            } else {
                val response = contentRepository.downloadContent(getResourceName(content))
                val resultId = contentService.saveContent(content, response)
                if ((resultId != null) && !resultId.equals(-1)) {
                    _contentDownloaded.postValue(contentDbService.findFileById(resultId))
                }
            }
            _loading.value = false

        }
    }

}