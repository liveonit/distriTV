package com.distritv.utils

import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import android.os.Environment
import androidx.core.content.ContextCompat
import com.distritv.R
import java.io.File

object StorageHelper {

    fun Context.getCustomExternalStorageDirectory(): String {
        return Environment.DIRECTORY_DOWNLOADS + File.separator + this.getString(R.string.app_name)
    }

    fun Context.externalMemoryAvailable(): Boolean {
        val storages = ContextCompat.getExternalFilesDirs(this, null)
        return storages.size > 1 && storages[0] != null && storages[1] != null
    }

    fun Context.externalStoragePermissionGranted(): Boolean {
        return if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) {
            ContextCompat.checkSelfPermission(
                this,
                android.Manifest.permission.WRITE_EXTERNAL_STORAGE
            ) == PackageManager.PERMISSION_GRANTED
        } else {
            true
        }
    }

}