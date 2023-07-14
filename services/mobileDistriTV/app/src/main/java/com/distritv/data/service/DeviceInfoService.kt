package com.distritv.data.service

import android.app.Activity
import android.app.ActivityManager
import android.content.Context
import android.content.Context.ACTIVITY_SERVICE
import android.content.pm.PackageManager
import android.os.*
import android.provider.Settings
import android.util.Log
import com.distritv.data.model.DeviceInfo
import com.distritv.DistriTVApp
import com.distritv.daemon.ContentSchedulingDaemon
import com.distritv.daemon.GarbageCollectorDaemon
import com.distritv.daemon.RequestDaemon
import com.distritv.data.model.DeviceInfoCard
import com.distritv.data.helper.StorageHelper.externalMemoryAvailable
import com.distritv.data.helper.StorageHelper.externalStoragePermissionGranted
import com.distritv.utils.getCurrentTime
import com.distritv.utils.isServiceRunning
import com.distritv.utils.roundTo
import java.io.File

class DeviceInfoService(
    private val context: Context,
    private val sharedPreferences: SharedPreferencesService
) {

    private var myApp: DistriTVApp? = null

    fun getDeviceInfo(): DeviceInfo {
        myApp = context.applicationContext as DistriTVApp?

        val mem = getMemoryInfo()
        val availableMem = mem[0]
        val totalMem = mem[1]
        val memUnit = "GB"
        val storage = getStorageInfo()
        val availableStorage = storage[0] as Double
        val totalStorage = storage[1] as Double
        val availableStorageUnit = storage[2] as String
        val totalStorageUnit = storage[3] as String

        return DeviceInfo(
            getTvCode(),
            getCurrentVersionApp(),
            getSDKVersion(),
            availableMem,
            totalMem,
            memUnit,
            availableStorage,
            totalStorage,
            availableStorageUnit,
            totalStorageUnit,
            allProcessesAreRunning(),
            appIsVisible(),
            isAnyContentPlaying(),
            getCurrentlyPlayingContentId(),
            getCurrentTime(),
            useExternalStorage(),
            externalMemoryAvailable(),
            externalStoragePermissionGranted(),
            displayOverOtherAppsPermissionGranted(),
            isAnyAlertPlaying(),
            getCurrentlyPlayingAlertId(),
            getAlertDurationLeft()
        )
    }

    fun getDeviceInfoCard(): DeviceInfoCard {
        return DeviceInfoCard(
            getTvCode(),
            getCurrentVersionApp(),
            null
        )
    }

    private fun getTvCode(): String {
        return sharedPreferences.getTvCode() ?: ""
    }

    private fun useExternalStorage(): Boolean {
        return sharedPreferences.useExternalStorage()
    }

    private fun externalMemoryAvailable(): Boolean {
        return context.externalMemoryAvailable()
    }

    private fun externalStoragePermissionGranted(): Boolean? {
        return context.externalStoragePermissionGranted()
    }

    private fun displayOverOtherAppsPermissionGranted(): Boolean? {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            Settings.canDrawOverlays(context)
        } else {
            null
        }
    }

    /**
     * @return current version name application.
     */
    private fun getCurrentVersionApp(): String {
        val packageManager = context.packageManager
        val packageName = context.packageName
        try {
            val packageInfo = packageManager.getPackageInfo(packageName, 0)
            return packageInfo.versionName
        } catch (e: PackageManager.NameNotFoundException) {
            Log.e(TAG, "[getCurrentVersionNameApp] -> ${e.javaClass}: ${e.message}")
        }
        return ""
    }

    /**
     * Fetching internal memory storage information
     */
    private fun getStorageInfo(): Array<Any> {
        val path: File = Environment.getDataDirectory()
        val stat = StatFs(path.path)
        val blockSize = stat.blockSizeLong
        val availableBlocks = stat.availableBlocksLong
        val totalBlocks = stat.blockCountLong

        val available = formatSize(availableBlocks * blockSize)
        val total = formatSize(totalBlocks * blockSize)
        val availableSpace = available.first
        val totalSpace = total.first
        val availableStorageUnit = available.second
        val totalStorageUnit = total.second

        return arrayOf(availableSpace, totalSpace, availableStorageUnit, totalStorageUnit)
    }

    /**
     * Function to convert bytes to KB, MB and GB
     */
    private fun formatSize(sizeL: Long): Pair<Double, String> {
        var unit = "Byte"
        var size = sizeL.toDouble()
        if (size >= 1024) {
            size /= 1024
            unit = "KB"
            if (size >= 1024) {
                size /= 1024
                unit = "MB"
                if (size >= 1024) {
                    size /= 1024
                    unit = "GB"
                }
            }
        }
        return Pair(size.roundTo(2), unit)
    }

    /**
     * Fetching RAM memory information
     */
    private fun getMemoryInfo(): Array<Double> {
        // Declaring and Initializing the ActivityManager
        val actManager = context.getSystemService(ACTIVITY_SERVICE) as ActivityManager

        // Declaring MemoryInfo object
        val memInfo = ActivityManager.MemoryInfo()

        // Fetching the data from the ActivityManager
        actManager.getMemoryInfo(memInfo)

        // Fetching the available and total memory and converting into Giga Bytes
        val availMemory = memInfo.availMem.toDouble() / (1024 * 1024 * 1024)
        val totalMemory = memInfo.totalMem.toDouble() / (1024 * 1024 * 1024)

        return arrayOf(availMemory.roundTo(2), totalMemory.roundTo(2))
    }


    /**
     * @return true if all background services are running,
     * false otherwise.
     */
    private fun allProcessesAreRunning(): Boolean {
        return (isServiceRunning(RequestDaemon::class.java)
                && isServiceRunning(ContentSchedulingDaemon::class.java)
                && isServiceRunning(GarbageCollectorDaemon::class.java))
    }

    private fun isServiceRunning(serviceClass: Class<*>): Boolean {
        return isServiceRunning(context, serviceClass)
    }

    /**
     * @return true if the app is visible in the foreground,
     * false otherwise.
     */
    private fun appIsVisible(): Boolean {
        val currentActivity: Activity? = myApp?.getCurrentActivity()
        return currentActivity != null
    }

    /**
     * @return true if any content is currently playing,
     * false otherwise.
     */
    private fun isAnyContentPlaying(): Boolean {
        return myApp?.isContentCurrentlyPlaying() ?: false
    }

    private fun getCurrentlyPlayingContentId(): Long {
        return myApp?.getCurrentlyPlayingContentId() ?: -1L
    }

    private fun getSDKVersion(): Int {
        return Build.VERSION.SDK_INT
    }

    private fun isAnyAlertPlaying(): Boolean {
        return myApp?.isAlertCurrentlyPlaying() ?: false
    }

    private fun getCurrentlyPlayingAlertId(): Long? {
        return myApp?.getCurrentlyPlayingAlertId()
    }

    private fun getAlertDurationLeft(): Long? {
        val durationLeft = myApp?.getAlertDurationLeft()
        if(durationLeft != null && durationLeft == 0L) {
            myApp?.setAlertDurationLeft(null)
        }
        return myApp?.getAlertDurationLeft()
    }

    companion object {
        const val TAG = "DeviceInfoService"
    }

}