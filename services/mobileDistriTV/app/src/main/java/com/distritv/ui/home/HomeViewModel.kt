package com.distritv.ui.home

import android.content.Context
import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.distritv.BuildConfig
import com.distritv.DistriTVApp
import com.distritv.R
import com.distritv.data.helper.StorageHelper.createOrClearTargetDirectory
import com.distritv.data.model.DeviceInfoCard
import com.distritv.data.service.DeviceInfoService
import com.distritv.data.service.SharedPreferencesService
import com.distritv.utils.*
import com.distritv.data.helper.StorageHelper.externalStorageDirIsEmpty
import com.distritv.data.helper.StorageHelper.extractExternalStorageId
import com.distritv.data.helper.StorageHelper.getExternalMountedStorages
import com.distritv.data.helper.StorageHelper.internalStorageDirIsEmpty
import com.distritv.data.helper.StorageHelper.moveFiles
import com.distritv.data.repositories.TelevisionRepository
import com.distritv.data.service.LabelService
import kotlinx.coroutines.launch
import retrofit2.HttpException
import java.net.SocketTimeoutException
import java.util.*

class HomeViewModel(
    private val context: Context,
    private val deviceInfoService: DeviceInfoService,
    private val sharedPreferences: SharedPreferencesService,
    private val televisionRepository: TelevisionRepository,
    private val labelService: LabelService
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

    private val _referrerRequestPerm = MutableLiveData<Int>()
    val referrerRequestPerm: LiveData<Int>
        get() = _referrerRequestPerm

    private val _externalStorageSelected = MutableLiveData(false)
    val externalStorageSelected: LiveData<Boolean>
        get() = _externalStorageSelected

    private val _externalStorageNotFound = MutableLiveData<Boolean>()
    val externalStorageNotFound: LiveData<Boolean>
        get() = _externalStorageNotFound

    private val _languageUpdated = MutableLiveData<Boolean>()
    val languageUpdated: LiveData<Boolean>
        get() = _languageUpdated

    private var error: Int = -1

    private val externalStorageEnabled: Boolean = BuildConfig.EXTERNAL_STORAGE_ENABLED
    private val anticipationDaysOptions: String = BuildConfig.ANTICIPATION_DAYS_OPTIONS

    private val appInstance = DistriTVApp.getInstance()

    fun registerTvCode(code: String, useExternalStorage: Boolean) {
        if (code.length < 6) {
            _errorMessage.postValue(context.applicationContext.getString(R.string.msg_tv_code_invalid))
            _isValid.postValue(false)
            error = R.string.msg_tv_code_invalid
            return
        }
        viewModelScope.launch {
            _loading.value = true
            try {
                televisionRepository.validateTvCode(code).run {
                    if (this) {
                        sharedPreferences.addTvCode(code)
                        _referrerRequestPerm.postValue(DEVICE_INFO)
                        _externalStorageSelected.value = useExternalStorage
                        _isValid.postValue(true)
                    } else {
                        _errorMessage.postValue(context.applicationContext.getString(R.string.msg_tv_code_invalid))
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
                error = if (e.code() == HTTP_NOT_FOUND) {
                    _errorMessage.postValue(context.applicationContext.getString(R.string.msg_tv_code_invalid))
                    R.string.msg_tv_code_invalid
                } else {
                    Log.e(TAG, "${e.javaClass}: ${e.message}")
                    _errorMessage.postValue(context.applicationContext.getString(R.string.msg_tv_code_error))
                    R.string.msg_tv_code_error
                }
                _isValid.postValue(false)
            } catch (e: Exception) {
                Log.e(TAG, "${e.javaClass}: ${e.message}")
                _errorMessage.postValue(context.applicationContext.getString(R.string.msg_tv_code_error))
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
                televisionRepository.validateConnection(it).run {
                    info.connectionStatus = this
                    _deviceInfo.postValue(info)
                }
            }
        }
    }

    fun setExternalStorage(useExternalStorage: Boolean) {
        setExternalStorage(useExternalStorage, null)
    }

    private fun setExternalStorage(useExternalStorage: Boolean, storagePath: String?) {
        sharedPreferences.setExternalStorage(useExternalStorage)
        if (useExternalStorage) {
            setExternalStorageDriveId(storagePath)
        }
    }

    private fun setExternalStorageDriveId(storagePath: String?) {
        try {
            if (storagePath == null) {
                val externalStoragePathList = context.getExternalMountedStorages()
                if (externalStoragePathList == null) {
                    _externalStorageNotFound.postValue(true)
                    return
                }
                sharedPreferences.setExternalStorageId(extractExternalStorageId(externalStoragePathList.first()))
            } else {
                sharedPreferences.setExternalStorageId(extractExternalStorageId(storagePath))
            }
        } catch (e: Exception) {
            _externalStorageNotFound.postValue(true)
            Log.e(TAG, "${e.javaClass} -> ${e.message}")
        }
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
        afterWriteExternalStoragePermissionGranted(null)
    }
    fun afterWriteExternalStoragePermissionGranted(externalStoragePath: String?) {
        setExternalStorage(true, externalStoragePath)
        context.createOrClearTargetDirectory(true)
    }

    fun afterWriteExternalStoragePermissionGrantedAndMoveFiles() {
        afterWriteExternalStoragePermissionGrantedAndMoveFiles(null)
    }

    fun afterWriteExternalStoragePermissionGrantedAndMoveFiles(externalStoragePath: String?) {
        if (context.internalStorageDirIsEmpty()) {
            setExternalStorage(true, externalStoragePath)
        } else {
            setExternalStorageDriveId(externalStoragePath)
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
        appInstance.setDefaultAppLanguage()
    }

    private fun saveLocale(locale: Locale) {
        appInstance.setAppLanguage(locale)
        sharedPreferences.addCustomLocale("${locale.language}_${locale.country}")
    }

    private fun updateDeviceInfoFragmentUI() {
        _languageUpdated.postValue(true)
    }

    private fun updateHomeFragmentUI() {
        _languageUpdated.postValue(true)
    }

    fun getErrorMessage(): String {
        return context.getString(error)
    }

    fun getLanguages(): Array<String> {
        return context.resources.getStringArray(R.array.languages)
    }

    fun isExternalStorageEnabled(): Boolean {
        return externalStorageEnabled
    }

    fun getAnticipationDaysOptions(): Array<String>? {
        try {
            val options = anticipationDaysOptions.split(ANTICIPATION_DAYS_SEPARATOR)
            if (options.isEmpty() || !options.all { it.trim().toIntOrNull() != null }) {
                return null
            }
            return options.map { it.trim() + ANTICIPATION_DAYS_WHITESPACE + context.getString(R.string.days) }.toTypedArray()
        } catch (e: Exception) {
            return null
        }
    }

    fun getCurrentAnticipationDays(): Int {
        return sharedPreferences.getAnticipationDays()
    }

    fun setCurrentAnticipationDays(days: Int) {
        sharedPreferences.setAnticipationDays(days)
    }

    fun getLabelNameList(): List<String> {
        return labelService.getLabels().map { it.name }
    }

    companion object {
        const val TAG = "[HomeViewModel]"
        const val DEVICE_INFO = 0
        const val HOME = 1
    }
}