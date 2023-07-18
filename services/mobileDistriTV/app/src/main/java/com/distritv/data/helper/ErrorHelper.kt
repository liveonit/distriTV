package com.distritv.data.helper

import com.distritv.BuildConfig
import com.distritv.data.model.ErrorModel
import com.distritv.data.service.SharedPreferencesService
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import java.time.LocalDateTime

object ErrorHelper: KoinComponent {

    private val sharedPreferences: SharedPreferencesService by inject()

    fun saveError(className: String, msg: String) {
        val maxError: Long = BuildConfig.MAX_ERROR_LIST

        val errorList: MutableList<ErrorModel> = getErrorList()
        if (errorList.size >= maxError) {
            errorList.removeFirst()
        }
        errorList.add(
            ErrorModel(
                LocalDateTime.now().toString(),
                className,
                msg
            )
        )
        sharedPreferences.saveErrors(errorList)
    }

    fun getErrorList(): MutableList<ErrorModel> {
        return sharedPreferences.getErrors() ?: mutableListOf()
    }

    fun clearErrorList() {
        return getErrorList().clear()
    }

}