package com.distritv.ui.home

import android.content.Context
import android.content.res.Resources
import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.distritv.R
import com.distritv.data.model.DeviceInfoCard
import com.distritv.data.repositories.ScheduleRepository
import com.distritv.data.service.DeviceInfoService
import com.distritv.data.service.SharedPreferencesService
import com.distritv.utils.*
import kotlinx.coroutines.launch
import retrofit2.HttpException
import java.net.SocketTimeoutException
import java.util.*

class HomeViewModel(
    private val context: Context,
    private val deviceInfoService: DeviceInfoService,
    private val sharedPreferences: SharedPreferencesService,
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

    private val _locale = MutableLiveData<String>()
    val locale: LiveData<String>
        get() = _locale

    private val _textTitle = MutableLiveData<String>()
    val textTitle: LiveData<String>
        get() = _textTitle

    private val _textButton = MutableLiveData<String>()
    val textButton: LiveData<String>
        get() = _textButton

    private var error: Int = -1

    fun registerTvCode(code: String) {
        if (code.length < 6) {
            _errorMessage.postValue(context.getString(R.string.msg_tv_code_invalid))
            _isValid.postValue(false)
            error = R.string.msg_tv_code_invalid
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
                        _errorMessage.postValue(context.getString(R.string.msg_tv_code_invalid))
                        _isValid.postValue(false)
                        error = R.string.msg_tv_code_invalid
                    }
                }
            } catch (e: SocketTimeoutException) {
                Log.e(TAG, "${e.javaClass}: ${e.message}")
                _errorMessage.postValue(context.getString(R.string.msg_tv_code_connection_error))
                _isValid.postValue(false)
                error = R.string.msg_tv_code_connection_error
            } catch (e: HttpException) {
                if (e.message?.contains("HTTP 5") != false) {
                    Log.e(TAG, "${e.javaClass}: ${e.message}")
                    _errorMessage.postValue(context.getString(R.string.msg_tv_code_error))
                    error = R.string.msg_tv_code_error
                } else {
                    _errorMessage.postValue(context.getString(R.string.msg_tv_code_invalid))
                    error = R.string.msg_tv_code_invalid
                }
                _isValid.postValue(false)
            } catch (e: Exception) {
                Log.e(TAG, "${e.javaClass}: ${e.message}")
                _errorMessage.postValue(context.getString(R.string.msg_tv_code_error))
                _isValid.postValue(false)
                error = R.string.msg_tv_code_error
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

    fun setLocale() {
        val locale = sharedPreferences.getCustomLocale()
        if (locale != null) {
            val localeData = locale.split("_")
            LocaleHelper.setLocale(context, Locale(localeData[0], localeData[1]))
            _locale.postValue(localeData[0])
        } else {
            _locale.postValue("")
        }
    }

    fun changeLocale(itemPosition: Long) {
        if (itemPosition == HINT_POS.toLong()) {
            return
        }
        when (itemPosition) {
            AUTOMATIC_POS.toLong() -> {
                sharedPreferences.removeCustomLocale()
                val systemLocale: Locale = Resources.getSystem().configuration.locales[0]
                LocaleHelper.setLocale(context, systemLocale)
            }
            ENGLISH_POS.toLong() -> {
                saveLocale(Locale(EN_LANG, DEFAULT_COUNTRY))
            }
            SPANISH_POS.toLong() -> {
                saveLocale(Locale(ES_LANG, DEFAULT_COUNTRY))
            }
            else -> {
                saveLocale(Locale(EN_LANG, DEFAULT_COUNTRY))
            }
        }
        updateUI()
    }

    private fun saveLocale(locale: Locale){
        LocaleHelper.setLocale(context, locale)
        sharedPreferences.addCustomLocale("${locale.language}_${locale.country}")
    }

    private fun updateUI() {
        _textTitle.postValue(context.getString(R.string.device_info_title))
        _textButton.postValue(context.getString(R.string.device_info_register_button))
    }

    fun getErrorMessage(): String {
        return context.getString(error)
    }

    fun getLanguages(): Array<String> {
        return context.resources.getStringArray(R.array.languages)
    }

    companion object {
        const val TAG = "[HomeViewModel]"
    }
}