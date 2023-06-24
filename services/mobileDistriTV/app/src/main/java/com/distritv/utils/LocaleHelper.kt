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