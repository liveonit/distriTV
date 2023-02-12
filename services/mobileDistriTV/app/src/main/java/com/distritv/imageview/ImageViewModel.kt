package com.distritv.imageview

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.widget.Toast
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

    fun fecthImage() {
        //val fileDbService = FileDbService(this@ImageActivity)


        try {
            val file = fileDbService.getLastFileDownload()
            if (!file.localPath.isNullOrEmpty()) {
                val imgFile = File(file.localPath)
                if (imgFile.exists()) {
                    val imgBitmap = BitmapFactory.decodeFile(imgFile.absolutePath)
                    _image.postValue(imgBitmap)
                    //binding.imageContainer.setImageBitmap(imgBitmap)
                    //Toast.makeText(this, "${file.name}", Toast.LENGTH_SHORT).show()
                }
            } else {
                RuntimeException()
            }
        } catch (e: Exception) {
            _image.postValue(null)
            //Toast.makeText(this, "No hay contenido disponible.", Toast.LENGTH_SHORT).show()
        }

    }
}