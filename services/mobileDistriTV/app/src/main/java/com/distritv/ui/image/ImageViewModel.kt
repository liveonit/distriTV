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

    private val _image = MutableLiveData<Bitmap>()
    val image: LiveData<Bitmap>
        get() = _image

    fun fetchImage(localPath: String) {
        try {
           // val file = fileDbService.getLastFileDownload()

            //if (!file.localPath.isNullOrEmpty()) {
                //val imgFile = File(file.localPath)
                if (!localPath.isNullOrEmpty()) {
                val imgFile = File(localPath)
                if (imgFile.exists()) {
                    val imgBitmap = BitmapFactory.decodeFile(imgFile.absolutePath)
                   // _image.postValue(Pair<Bitmap, String>(imgBitmap, file.name))
                    _image.postValue(imgBitmap)
                }
            } else {
                RuntimeException()
            }
        } catch (e: Exception) {
            _image.postValue(null)
        }

    }
}