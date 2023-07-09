package com.distritv.utils

import android.content.Context
import android.content.res.Configuration
import java.util.*

const val AUTOMATIC_POS = 0
const val ENGLISH_POS = 1
const val SPANISH_POS = 2

const val EN_LANG = "en"
const val ES_LANG = "es"
const val DEFAULT_COUNTRY = "US"

object LocaleHelper {
    fun setLocale(context: Context, locale: Locale) {
        Locale.setDefault(locale)

        val resources = context.resources
        val configuration = Configuration(resources.configuration)

        configuration.setLocale(locale)

        resources.updateConfiguration(configuration, resources.displayMetrics)
    }
}

object DeviceInfoFragmentTextIndex {
    const val TITLE = 0
    const val REGISTER_BUTTON = 1
    const val SWITCH_EXTERNAL_STORAGE = 2
    const val DIALOG_TITLE = 3
    const val DIALOG_MESSAGE = 4
    const val DIALOG_ACCEPT = 5
    const val DIALOG_CANCEL = 6
}

object HomeFragmentTextIndex {
    const val APP_VERSION = 0
    const val TV_CODE = 1
    const val CONNECTION_STATUS = 2
    const val LANGUAGE = 3
    const val SWITCH_EXTERNAL_STORAGE_HOME = 4
    const val DIALOG_TITLE_HOME_TO_EXTERNAL = 0
    const val DIALOG_TITLE_HOME_TO_INTERNAL = 1
    const val DIALOG_MESSAGE_HOME_TO_EXTERNAL = 2
    const val DIALOG_MESSAGE_HOME_TO_INTERNAL = 3
    const val DIALOG_ACCEPT_HOME = 4
    const val DIALOG_CANCEL_HOME = 5
}