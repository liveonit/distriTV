package com.distritv.data.service

import com.distritv.data.model.DeviceInfo
import android.os.Build
import android.os.Bundle
import android.os.Environment
import android.os.StatFs
import android.util.Log
import android.widget.TextView
import androidx.annotation.RequiresApi
import androidx.appcompat.app.AppCompatActivity
import java.io.File

class DeviceInfoService {
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

    companion object {
        const val TAG = "DeviceInfoService"
    }

}