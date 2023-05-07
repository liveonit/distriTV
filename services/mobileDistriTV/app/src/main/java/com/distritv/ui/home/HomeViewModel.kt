package com.distritv.ui.home

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.distritv.data.repositories.ScheduleRepository
import com.distritv.data.service.SharedPreferencesService
import kotlinx.coroutines.launch

class HomeViewModel(
    private val sharedPreferences: SharedPreferencesService,
    private val scheduleRepository: ScheduleRepository
) : ViewModel() {

    private val _isValid = MutableLiveData<Boolean>()
    val isValid: LiveData<Boolean>
        get() = _isValid

    private val _isRegistered = MutableLiveData<Boolean>()
    val isRegistered: LiveData<Boolean>
        get() = _isRegistered

    private val _tvCode = MutableLiveData<String>()
    val tvCode: LiveData<String>
        get() = _tvCode

    private val _loading = MutableLiveData<Boolean>(false)
    val loading: LiveData<Boolean> get() = _loading

    fun registerTvCode(code: String) {
        try {
            if (code.length < 6) {
                throw Exception()
            }
            viewModelScope.launch {
                _loading.value = true
                scheduleRepository.validateTvCode(code).run {
                    if (this) {
                        sharedPreferences.addTvCode(code)
                        _isValid.postValue(true)
                    } else {
                        _isValid.postValue(false)
                    }
                }
                _loading.value = false
            }
        } catch (e: Exception) {
            _isValid.postValue(false)
            _loading.value = false
        }
    }

    fun checkIfDeviceIsRegistered() {
        _isRegistered.postValue(sharedPreferences.isDeviceRegistered())
    }

    fun getTvCode() {
        _tvCode.postValue(sharedPreferences.getTvCode())
    }

    companion object {
        const val TAG = "[HomeViewModel]"
    }
}