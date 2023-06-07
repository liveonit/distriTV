package com.distritv.ui.home

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.distritv.data.model.DeviceInfoCard
import com.distritv.data.repositories.ScheduleRepository
import com.distritv.data.service.DeviceInfoService
import com.distritv.data.service.SharedPreferencesService
import kotlinx.coroutines.launch
import retrofit2.HttpException
import java.net.SocketTimeoutException

class HomeViewModel(
    private val sharedPreferences: SharedPreferencesService,
    private val deviceInfoService: DeviceInfoService,
    private val scheduleRepository: ScheduleRepository
) : ViewModel() {

    private val _isValid = MutableLiveData<Boolean>()
    val isValid: LiveData<Boolean>
        get() = _isValid

    private val _errorMessage = MutableLiveData<String>()
    val errorMessage: LiveData<String>
        get() = _errorMessage

    private val _isRegistered = MutableLiveData<Boolean>()
    val isRegistered: LiveData<Boolean>
        get() = _isRegistered

    private val _deviceInfo = MutableLiveData<DeviceInfoCard>()
    val deviceInfo: LiveData<DeviceInfoCard>
        get() = _deviceInfo

    private val _loading = MutableLiveData<Boolean>(false)
    val loading: LiveData<Boolean> get() = _loading

    fun registerTvCode(code: String) {
        if (code.length < 6) {
            _errorMessage.postValue(MSG_TV_CODE_INVALID)
            _isValid.postValue(false)
            return
        }
        viewModelScope.launch {
            _loading.value = true
            try {
                scheduleRepository.validateTvCode(code).run {
                    if (this) {
                        sharedPreferences.addTvCode(code)
                        _isValid.postValue(true)
                    } else {
                        _errorMessage.postValue(MSG_TV_CODE_INVALID)
                        _isValid.postValue(false)
                    }
                }
            } catch (e: SocketTimeoutException) {
                Log.e(TAG, "${e.javaClass}: ${e.message}")
                _errorMessage.postValue(MSG_TV_CODE_CONNECTION_ERROR)
                _isValid.postValue(false)
            } catch (e: HttpException) {
                if (e.message?.contains("HTTP 5") != false) {
                    Log.e(TAG, "${e.javaClass}: ${e.message}")
                    _errorMessage.postValue(MSG_TV_CODE_ERROR)
                } else {
                    _errorMessage.postValue(MSG_TV_CODE_INVALID)
                }
                _isValid.postValue(false)
            } catch (e: Exception) {
                Log.e(TAG, "${e.javaClass}: ${e.message}")
                _errorMessage.postValue(MSG_TV_CODE_ERROR)
                _isValid.postValue(false)
            }
            _loading.value = false
        }
    }

    fun checkIfDeviceIsRegistered() {
        _isRegistered.postValue(sharedPreferences.isDeviceRegistered())
    }

    fun getDeviceInfo() {
        val info = deviceInfoService.getDeviceInfoCard()
        _deviceInfo.postValue(info)
        viewModelScope.launch {
            sharedPreferences.getTvCode()?.let {
                scheduleRepository.validateConnection(it).run {
                    info.connectionStatus = this
                    _deviceInfo.postValue(info)
                }
            }
        }
    }

    companion object {
        const val TAG = "[HomeViewModel]"
        private const val MSG_TV_CODE_INVALID = "El código ingresado no es válido"
        private const val MSG_TV_CODE_ERROR = "Ha ocurrido un error"
        private const val MSG_TV_CODE_CONNECTION_ERROR = "Ha ocurrido un error de conexión"
    }
}