package com.distritv.ui.video

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel

class VideoPlaybackViewModel: ViewModel() {



    private val _videoPath = MutableLiveData<String>()
    val videoPath: LiveData<String> get() = _videoPath

    fun fetchVideoPath() {

        _videoPath.value = "/mnt/sdcard/Movies/ejemplo2.mp4"
    }
}