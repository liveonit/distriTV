package com.distritv.data.service

import android.app.Activity
import android.app.ActivityManager
import android.content.Context
import android.content.Context.ACTIVITY_SERVICE
import android.os.*
import com.distritv.data.model.DeviceInfo
import com.distritv.DistriTVApp
import com.distritv.daemon.ContentSchedulingDaemon
import com.distritv.daemon.GarbageCollectorDaemon
import com.distritv.daemon.RequestDaemon
import com.distritv.utils.isServiceRunning
import java.io.File

class DeviceInfoService(
    private val context: Context,
    private val sharedPreferences: SharedPreferencesService
) {

    fun getDeviceInfo(): DeviceInfo {
        val mem = getMemoryInfo()
        val availableMem = mem[0]
        val totalMem = mem[1]
        val storage = getStorageInfo()
        val availableStorage = storage[0] as Double
        val totalStorage = storage[1] as Double
        return DeviceInfo(
            getTvCode(),
            availableMem,
            totalMem,
            "GB",
            availableStorage,
            totalStorage,
            storage[2].toString(),
            storage[3].toString(),
            allProcessesAreRunning(),
            appIsVisible(),
            isAnyContentPlaying()
        )
    }

    private fun getTvCode(): String {
        return sharedPreferences.getTvCode() ?: ""
    }

    private fun getStorageInfo(): Array<Any> {
        // Fetching internal memory information
        val path: File = Environment.getDataDirectory()
        val stat = StatFs(path.path)
        val blockSize = stat.blockSizeLong
        val availableBlocks = stat.availableBlocksLong
        val totalBlocks = stat.blockCountLong
        val availableSpace = formatSize(availableBlocks * blockSize).first
        val totalSpace = formatSize(totalBlocks * blockSize).first
        val availableStorageUnit = formatSize(availableBlocks * blockSize).second
        val totalStorageUnit = formatSize(totalBlocks * blockSize).second

        return arrayOf(availableSpace,totalSpace, availableStorageUnit, totalStorageUnit)


    }


    // Function to convert bytes to KB and MB
    private fun formatSize(sizeL: Long): Pair<Double, String> {
        var sizeF = 0F
        var unit = "B"
        sizeF = sizeL.toFloat()
        if (sizeF >= 1024) {
            sizeF /= 1024
            unit = "KB"
            if (sizeF >= 1024) {
                sizeF /= 1024
                unit = "MB"
                if (sizeF >= 1024) {
                    sizeF /= 1024
                    unit = "GB"
                }
            }

        }

        return Pair(String.format("%.2f", sizeF).toDouble(), unit)
    }

    private fun getMemoryInfo(): List<Double> {
        // Declaring and Initializing the ActivityManager
        val actManager = context.getSystemService(ACTIVITY_SERVICE) as ActivityManager

        // Declaring MemoryInfo object
        val memInfo = ActivityManager.MemoryInfo()

        // Fetching the data from the ActivityManager
        actManager.getMemoryInfo(memInfo)

        // Fetching the available and total memory and converting into Giga Bytes
        var availMemory = memInfo.availMem.toDouble() / (1024 * 1024 * 1024)
        var totalMemory = memInfo.totalMem.toDouble() / (1024 * 1024 * 1024)

        availMemory = String.format("%.2f", availMemory).toDouble()
        totalMemory = String.format("%.2f", totalMemory).toDouble()

        //Log.v(TAG,"Available RAM: $availMemory GB\nTotal RAM: $totalMemory GB")
        return listOf(availMemory, totalMemory)
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
        val currentActivity: Activity? =
            (context.applicationContext as DistriTVApp?)?.getCurrentActivity()
        return currentActivity != null
    }

    /**
     * @return true if any content is currently playing,
     * false otherwise.
     */
    private fun isAnyContentPlaying(): Boolean {
        return (context.applicationContext as DistriTVApp?)?.isContentCurrentlyPlaying() ?: false
    }

    companion object {
        const val TAG = "DeviceInfoService"
    }

}