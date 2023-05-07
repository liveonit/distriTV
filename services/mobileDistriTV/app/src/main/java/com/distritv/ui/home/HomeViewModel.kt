package com.distritv.ui.home

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.util.Log
import android.widget.Toast
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.distritv.R
import com.distritv.data.repositories.ScheduleRepository
import com.distritv.data.service.SharedPreferencesService
import com.distritv.utils.addFragment
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import org.koin.android.ext.android.inject
import java.io.File

class HomeViewModel(
    private val sharedPreferences: SharedPreferencesService,
    private val scheduleRepository: ScheduleRepository) : ViewModel() {

    private val _isRegistered = MutableLiveData<Boolean>()
    val isRegistered: LiveData<Boolean>
        get() = _isRegistered

    private val _isValid = MutableLiveData<Boolean>()
    val isValid: LiveData<Boolean>
        get() = _isValid

    fun registerDeviceId(id: String) {
        try{
            viewModelScope.launch {
                if (id.length == 6) {
                scheduleRepository.validateTvCode(id).run {
                    if(this){
                    sharedPreferences.addDeviceId(id)
                    _isValid.postValue(true)
                    }else{
                        _isValid.postValue(false)
                    }
                }
                }else {
                    _isValid.postValue(false)
                }
            }
        } catch (e: Exception) {
            _isValid.postValue(false)
        }

    }

    fun isRegistered(){
        _isRegistered.postValue(sharedPreferences.isDeviceRegistered())
    }

    companion object {
        const val TAG = "[HomeViewModel]"
    }
}