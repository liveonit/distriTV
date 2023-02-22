package com.distritv.ui.image

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.distritv.data.FileDbService
import java.io.File

class ImageViewModel(
    private val fileDbService: FileDbService
) : ViewModel() {

    private val _image = MutableLiveData<Pair<Bitmap, String>>()
    val image: LiveData<Pair<Bitmap, String>>
        get() = _image

    fun fetchImage() {
        try {
            val file = fileDbService.getLastFileDownload()
            if (!file.localPath.isNullOrEmpty()) {
                val imgFile = File(file.localPath)
                if (imgFile.exists()) {
                    val imgBitmap = BitmapFactory.decodeFile(imgFile.absolutePath)
                    _image.postValue(Pair<Bitmap, String>(imgBitmap, file.name))
                }
            } else {
                RuntimeException()
            }
        } catch (e: Exception) {
            _image.postValue(null)
        }

    }
}