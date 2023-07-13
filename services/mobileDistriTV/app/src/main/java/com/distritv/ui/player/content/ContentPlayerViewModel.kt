package com.distritv.ui.player.content

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.distritv.data.helper.StorageHelper.getCurrentDirectory
import com.distritv.data.model.Content
import com.distritv.data.service.ScheduleService
import java.io.File

class ContentPlayerViewModel(
    private val context: Context,
    private val scheduleService: ScheduleService
) : ViewModel() {

    private val _image = MutableLiveData<Bitmap?>()
    val image: LiveData<Bitmap?>
        get() = _image

    fun fetchImage(fileName: String) {
        try {
            if (fileName.isNotEmpty()) {
                val imgFile = File(context.getCurrentDirectory(), fileName)
                if (imgFile.exists()) {
                    val imgBitmap = BitmapFactory.decodeFile(imgFile.absolutePath)
                    _image.postValue(imgBitmap)
                } else {
                    _image.postValue(null)
                }
            } else {
                _image.postValue(null)
            }
        } catch (e: Exception) {
            Log.v(TAG, "Could not get image.")
            _image.postValue(null)
        }
    }

    fun playOnceContentAlreadyStarted(content: Content) {
        if (content.schedule != null && content.schedule!!.playOnce) {
            scheduleService.deletedSchedule(content.schedule!!)
        }
    }

    companion object {
        const val TAG = "[ContentPlayerViewModel]"
    }
}