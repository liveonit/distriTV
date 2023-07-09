package com.distritv.ui.home

import android.content.Context
import android.content.res.Resources
import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.distritv.BuildConfig
import com.distritv.R
import com.distritv.data.model.DeviceInfoCard
import com.distritv.data.repositories.ScheduleRepository
import com.distritv.data.service.DeviceInfoService
import com.distritv.data.service.SharedPreferencesService
import com.distritv.utils.*
import com.distritv.data.helper.StorageHelper.externalStorageDirIsEmpty
import com.distritv.data.helper.StorageHelper.internalStorageDirIsEmpty
import com.distritv.data.helper.StorageHelper.moveFiles
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

    private val _loading = MutableLiveData(false)
    val loading: LiveData<Boolean> get() = _loading

    private val _locale = MutableLiveData<String>()
    val locale: LiveData<String>
        get() = _locale

    private val _deviceInfoFragmentTexts = MutableLiveData<List<String>>()
    val deviceInfoFragmentTexts: LiveData<List<String>>
        get() = _deviceInfoFragmentTexts

    private val _referrerRequestPerm = MutableLiveData<Int>()
    val referrerRequestPerm: LiveData<Int>
        get() = _referrerRequestPerm

    private val _externalStorageSelected = MutableLiveData(false)
    val externalStorageSelected: LiveData<Boolean>
        get() = _externalStorageSelected

    private val _homeFragmentTexts = MutableLiveData<List<String>>()
    val homeFragmentTexts: LiveData<List<String>>
        get() = _homeFragmentTexts

    private var error: Int = -1

    private val externalStorageEnabled: Boolean = BuildConfig.EXTERNAL_STORAGE_ENABLED

    fun registerTvCode(code: String, useExternalStorage: Boolean) {
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
                        _referrerRequestPerm.postValue(DEVICE_INFO)
                        _externalStorageSelected.value = useExternalStorage
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

    fun setExternalStorage(useExternalStorage: Boolean) {
        sharedPreferences.setExternalStorage(useExternalStorage)
    }

    fun changeUseExternalStorage(useExternalStorage: Boolean) {
        if (useExternalStorage) {
            _referrerRequestPerm.postValue(HOME)
        } else {
            if (context.externalStorageDirIsEmpty()) {
                sharedPreferences.setExternalStorage(false)
            } else {
                context.moveFiles(false)
            }
        }
    }

    fun afterWriteExternalStoragePermissionGranted() {
        if (context.internalStorageDirIsEmpty()) {
            sharedPreferences.setExternalStorage(true)
        } else {
            context.moveFiles(true)
        }
    }

    fun useExternalStorage(): Boolean {
        return sharedPreferences.useExternalStorage()
    }

    fun setLocale() {
        _locale.postValue(getCurrentLocale())
    }

    fun getCurrentLocale(): String {
        return sharedPreferences.getCustomLocale()?.split("_")?.get(0) ?: ""
    }

    fun changeLocale(referrer: Int, itemPosition: Long) {
        when (itemPosition) {
            AUTOMATIC_POS.toLong() -> {
                setSystemLocale()
            }
            ENGLISH_POS.toLong() -> {
                saveLocale(Locale(EN_LANG, DEFAULT_COUNTRY))
            }
            SPANISH_POS.toLong() -> {
                saveLocale(Locale(ES_LANG, DEFAULT_COUNTRY))
            }
            else -> {
                setSystemLocale()
            }
        }
        if (referrer == DEVICE_INFO) {
            updateDeviceInfoFragmentUI()
        } else {
            updateHomeFragmentUI()
        }
    }

    private fun setSystemLocale() {
        sharedPreferences.removeCustomLocale()
        val systemLocale: Locale = Resources.getSystem().configuration.locales[0]
        LocaleHelper.setLocale(context, systemLocale)
    }

    private fun saveLocale(locale: Locale) {
        LocaleHelper.setLocale(context, locale)
        sharedPreferences.addCustomLocale("${locale.language}_${locale.country}")
    }

    private fun updateDeviceInfoFragmentUI() {
        _deviceInfoFragmentTexts.value = listOf(
            context.getString(R.string.device_info_title),
            context.getString(R.string.device_info_register_button),
            context.getString(R.string.device_info_switch_external),
            context.getString(R.string.dialog_title_to_external),
            context.getString(R.string.dialog_message_to_external),
            context.getString(R.string.dialog_accept),
            context.getString(R.string.dialog_cancel)
        )
    }

    private fun updateHomeFragmentUI() {
        _homeFragmentTexts.value = listOf(
            context.getString(R.string.info_card_version),
            context.getString(R.string.info_card_tv_code),
            context.getString(R.string.info_card_connection_status),
            context.getString(R.string.language),
            context.getString(R.string.info_card_switch_external),
        )
    }

    fun getDialogSwitchHomeText(): List<String> {
        return listOf(
            context.getString(R.string.dialog_title_to_external),
            context.getString(R.string.dialog_title_to_internal),
            context.getString(R.string.dialog_message_home_to_external),
            context.getString(R.string.dialog_message_home_to_internal),
            context.getString(R.string.dialog_accept),
            context.getString(R.string.dialog_cancel)
        )
    }

    fun getErrorMessage(): String {
        return context.getString(error)
    }

    fun getDialogTextPermissionDenied(): Triple<String, String, String> {
        return Triple(
            context.getString(R.string.dialog_title_permission_denied),
            context.getString(R.string.dialog_message_permission_denied),
            context.getString(R.string.dialog_accept)
        )
    }

    fun getLanguages(): Array<String> {
        return context.resources.getStringArray(R.array.languages)
    }

    fun isExternalStorageEnabled(): Boolean {
        return externalStorageEnabled
    }

    companion object {
        const val TAG = "[HomeViewModel]"
        const val DEVICE_INFO = 0
        const val HOME = 1
    }
}