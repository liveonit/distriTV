package com.distritv.utils

import com.distritv.data.model.Alert

fun getAlertBlank(): Alert {
    return Alert(-1, "", -1, false)
}