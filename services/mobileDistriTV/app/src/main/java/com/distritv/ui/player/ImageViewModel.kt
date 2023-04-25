package com.distritv.ui.player

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import java.io.File

class ImageViewModel : ViewModel() {

    private val _image = MutableLiveData<Bitmap>()
    val image: LiveData<Bitmap>
        get() = _image

    fun fetchImage(localPath: String) {
        try {
            if (!localPath.isNullOrEmpty()) {
                val imgFile = File(localPath)
                if (imgFile.exists()) {
                    val imgBitmap = BitmapFactory.decodeFile(imgFile.absolutePath)
                    _image.postValue(imgBitmap)
                }
            } else {
                RuntimeException()
            }
        } catch (e: Exception) {
            Log.v(TAG, "Could not get image.")
        }
    }

    companion object {
        const val TAG = "[ImageViewModel]"
    }
}