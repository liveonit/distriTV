package com.distritv.data.model

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class DeviceInfo(
    val tvCode: String,
    val availableMem: Double,
    val totalMem: Double,
    val memUnit: String,
    val availableStorage: Double,
    val totalStorage: Double,
    val availableStorageUnit: String,
    val totalStorageUnit: String,
    val allProcessesAreRunning:Boolean,
    val appIsVisible:Boolean,
    val isAnyContentPlaying:Boolean
    ) : Parcelable {

}
