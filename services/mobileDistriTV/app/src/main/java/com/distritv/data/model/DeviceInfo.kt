package com.distritv.data.model

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class DeviceInfo(
    val tvCode: String,
    val currentVersionApp: String,
    val sdkVersion: Int,
    val currentDate: String,
    val availableMem: Double,
    val totalMem: Double,
    val memUnit: String,
    val availableStorage: Double,
    val totalStorage: Double,
    val availableStorageUnit: String,
    val totalStorageUnit: String,
    val allProcessesAreRunning: Boolean,
    val appIsVisible: Boolean,
    val isAnyContentPlaying: Boolean,
    val currentlyPlayingContentId: Long?,
    val useExternalStorage: Boolean,
    val isExternalStorageConnected: Boolean?,
    val externalStoragePermissionGranted: Boolean?,
    val displayOverOtherAppsPermissionGranted: Boolean?,
    val isAnyAlertPlaying: Boolean,
    val currentlyPlayingAlertId: Long?,
    val alertDurationLeft: Long?,
    val anticipationDays: Int
) : Parcelable {
}
