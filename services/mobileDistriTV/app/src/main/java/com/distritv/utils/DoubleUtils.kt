package com.distritv.utils

/**
 * Round up a double with n decimal places. For example: 2 decimal places, after the point.
 */
fun Double.roundTo(n: Int): Double {
    return String.format("%.${n}f", this).toDouble()
}