package com.distritv.utils

import android.util.Log

/**
 * Round up a double with n decimal places. For example: 2 decimal places, after the point.
 */
fun Double.roundTo(n: Int): Double {
    // Replaces "," for "." when the separator is a ",". Eg: when the locale is es_ES.
    return String.format("%.${n}f", this).replace(",", ".").toDouble()
}