package com.distritv.data.service

import android.app.Activity
import android.content.Context
import android.os.*
import com.distritv.data.model.DeviceInfo
import android.util.Log
import com.distritv.DistriTVApp
import com.distritv.daemon.ContentSchedulingDaemon
import com.distritv.daemon.GarbageCollectorDaemon
import com.distritv.daemon.RequestDaemon
import com.distritv.utils.isServiceRunning
import java.io.File

class DeviceInfoService(private val context: Context) {
    fun getDeviceInfo(): DeviceInfo {
        getStorageInfo()
        return DeviceInfo("123456")
    }

    private fun getStorageInfo(): DeviceInfo {


        // Fetching internal memory information
        val iPath: File = Environment.getDataDirectory()
        val iStat = StatFs(iPath.path)
        val iBlockSize = iStat.blockSizeLong
        val iAvailableBlocks = iStat.availableBlocksLong
        val iTotalBlocks = iStat.blockCountLong
        val iAvailableSpace = formatSize(iAvailableBlocks * iBlockSize)
        val iTotalSpace = formatSize(iTotalBlocks * iBlockSize)

        // Displaying the fetched info
        Log.v(TAG,"Internal Available: $iAvailableSpace\nInternal Total: $iTotalSpace")
        return DeviceInfo("123456")


    }


    // Function to convert byter to KB and MB
    private fun formatSize(sizeL: Long): String? {
        var sizeF = 0F
        sizeF = sizeL.toFloat()
        var suffix: String? = null
        if (sizeF >= 1024) {
            suffix = "KB"
            sizeF /= 1024
            if (sizeF >= 1024) {
                suffix = "MB"
                sizeF /= 1024
                if (sizeF >= 1024) {
                    suffix = "GB"
                    sizeF /= 1024
                }
            }

        }
        val resultBuffer = StringBuilder(String.format("%.2f", sizeF))


        if (suffix != null) resultBuffer.append(suffix)
        return resultBuffer.toString()
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