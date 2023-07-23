package com.distritv.data.helper

import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import android.os.Environment
import android.util.Log
import androidx.core.content.ContextCompat
import com.distritv.data.service.SharedPreferencesService
import okhttp3.ResponseBody
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import java.io.*
import java.nio.channels.FileChannel

object StorageHelper: KoinComponent {

    const val MIN_SDK_VERSION_NOT_NEED_WRITE_EXTERNAL_STORAGE_PERMISSION = Build.VERSION_CODES.R

    private const val TAG = "[StorageHelper]"
    private const val LOG_REMOVE_OK = "Removal successful"
    private const val LOG_REMOVE_KO = "Failed to delete"
    private const val LOG_COPY_OK = "Copy successful"
    private const val LOG_COPY_KO = "Failed to copy"

    private val sharedPreferences: SharedPreferencesService by inject()


    /*
     * Functions to MOVE files
     */

    fun Context.moveFiles(useExternalStorageSelected: Boolean) {
        if (useExternalStorageSelected) {
            moveFilesToExternalStorage()
        } else {
            moveFilesToInternalStorage()
        }
    }

    private fun Context.moveFilesToInternalStorage() {
        val sourceDirectory = File(getExternalStorageDirectory())
        val targetDirectory = File(getInternalStorageDirectory())
        if (createOrClearTargetDirectory(targetDirectory)) {
            moveFilesToOtherStorage(sourceDirectory, targetDirectory, false)
        }
    }

    private fun Context.moveFilesToExternalStorage() {
        val sourceDirectory = File(getInternalStorageDirectory())
        val externalStorageDirectory = getExternalStorageDirectory() ?: return
        val targetDirectory = File(externalStorageDirectory)
        if (createOrClearTargetDirectory(targetDirectory)) {
            moveFilesToOtherStorage(sourceDirectory, targetDirectory, true)
        }
    }

    private fun moveFilesToOtherStorage(
        sourceDirectory: File,
        targetDirectory: File,
        useExternalStorageSelected: Boolean
    ) {
        val sourceFiles = sourceDirectory.listFiles()

        var result = false

        if (!sourceFiles.isNullOrEmpty()) {
            var index = 0
            do {
                val sourceFile = sourceFiles[index]
                val targetFile = File(targetDirectory, sourceFile.name)

                result = transferFile(sourceFile, targetFile)
                if (result) {
                    Log.i(TAG, "$LOG_COPY_OK: ${sourceFile.path} to ${targetFile.path}")
                } else {
                    Log.e(TAG, "$LOG_COPY_KO: ${sourceFile.path} to ${targetFile.path}")
                }
                index++
            } while (result && index < sourceFiles.size)
        }

        if (result) {
            sharedPreferences.setExternalStorage(useExternalStorageSelected)
            if (useExternalStorageSelected) {
                sharedPreferences.setExternalStorageId(extractExternalStorageId(targetDirectory.absolutePath))
            }
            deleteFiles(sourceDirectory, null)
        }
    }


    private fun transferFile(sourceFile: File, targetFile: File): Boolean {

        var inChannel: FileChannel? = null
        var outChannel: FileChannel? = null

        try {
            inChannel = FileInputStream(sourceFile).channel
            outChannel = FileOutputStream(targetFile).channel
        } catch (e: FileNotFoundException) {
            e.printStackTrace()
        }

        var result = false

        try {
            result = inChannel?.transferTo(0, inChannel.size(), outChannel) != null
        } catch (e: Exception) {
            e.printStackTrace()
        } finally {
            inChannel?.close()
            outChannel?.close()
        }

        return result
    }


    /*
     * Functions to DELETE files
     */

    fun deleteFiles(directory: File, fileNameActiveContentList: List<String>?) {
        val files = directory.listFiles()
        files?.forEach { file ->
            if ((fileNameActiveContentList == null) || !fileNameActiveContentList.contains(file.name)) {
                if (file.delete()) {
                    Log.i(TAG, "$LOG_REMOVE_OK: ${file.path}")
                } else {
                    Log.e(TAG, "$LOG_REMOVE_KO: ${file.path}")
                }
            }
        }
    }


    /*
     * Functions to CREATE a new file
     */

    fun Context.createFileOnInternalStorage(fileName: String): Triple<OutputStream, String, String> {
        val directory = File(this.getInternalStorageDirectory())
        val file = File(directory, fileName)
        return Triple(FileOutputStream(file), file.path, fileName)
    }

    fun Context.createFileOnExternalStorage(fileName: String): Triple<OutputStream, String, String>? {
        val externalStorageDirectory = getExternalStorageDirectory() ?: return null
        val customDirectory = File(externalStorageDirectory)
        val file = File(customDirectory, fileName)
        return Triple(FileOutputStream(file), file.path, file.name)
    }

    fun writeContent(outputStream: OutputStream?, body: ResponseBody): Boolean {
        var inputStream: InputStream? = null
        try {
            val fileReader = ByteArray(4096)
            val fileSize = body.contentLength()
            Log.d(TAG, "File size: $fileSize")
            var fileSizeDownloaded: Long = 0
            inputStream = body.byteStream()
            while (true) {
                val read: Int = inputStream.read(fileReader)
                if (read == -1) {
                    break
                }
                outputStream?.write(fileReader, 0, read)
                fileSizeDownloaded += read.toLong()
                //Log.d(TAG, "Content download: $fileSizeDownloaded of $fileSize")
            }
            outputStream?.flush()
            return true
        } catch (e: IOException) {
            throw e
        } finally {
            inputStream?.close()
        }
    }


    /*
     * Utils functions
     */

    fun Context.getExternalStorageDirectory(): String? {
        try {
            val extStorageId = sharedPreferences.getExternalStorageId()
            if (extStorageId != null) {
                val externalFilesDirs = ContextCompat.getExternalFilesDirs(this, null)

                return externalFilesDirs.firstOrNull { extractExternalStorageId(it.path) == extStorageId }?.absolutePath
            }
        } catch (e: Exception) {
            return null
        }
        return null
    }

    fun Context.getInternalStorageDirectory(): String {
        return this.filesDir.absolutePath
    }

    fun Context.getCurrentDirectory(): String? {
        return getDirectory(sharedPreferences.useExternalStorage())
    }

    private fun Context.getDirectory(useExternalStorageSelected: Boolean): String? {
        return if (useExternalStorageSelected) {
            getExternalStorageDirectory()
        } else {
            getInternalStorageDirectory()
        }
    }

    fun Context.externalStoragePermissionGranted(): Boolean? {
        return if (Build.VERSION.SDK_INT < MIN_SDK_VERSION_NOT_NEED_WRITE_EXTERNAL_STORAGE_PERMISSION) {
            ContextCompat.checkSelfPermission(
                this,
                android.Manifest.permission.WRITE_EXTERNAL_STORAGE
            ) == PackageManager.PERMISSION_GRANTED
        } else {
            null
        }
    }

    fun Context.internalStorageDirIsEmpty(): Boolean {
        return directoryIsEmpty(false)
    }

    fun Context.externalStorageDirIsEmpty(): Boolean {
        return directoryIsEmpty(true)
    }

    private fun Context.directoryIsEmpty(externalStorage: Boolean): Boolean {
        return if (externalStorage) {
            val externalStorageDirectory = getExternalStorageDirectory() ?: return true
            File(externalStorageDirectory).listFiles()?.isEmpty() ?: true
        } else {
            File(getInternalStorageDirectory()).listFiles()?.isEmpty() ?: true
        }
    }

    /**
     * If folder does not exist it is created,
     * if folder already exists and it is not empty it is cleaned
     */
    fun Context.createOrClearTargetDirectory(useExternalStorageSelected: Boolean): Boolean {
        val externalStorageDir = getDirectory(useExternalStorageSelected)
        if (externalStorageDir != null) {
            return createOrClearTargetDirectory(File(externalStorageDir))
        }
        return false
    }

    private fun Context.createOrClearTargetDirectory(targetDirectory: File): Boolean {
        if (!targetDirectory.exists()) {
            if (!targetDirectory.mkdir()) {
                return false
            }
        } else {
            deleteFiles(targetDirectory, null)
        }
        return true
    }

    /**
     * Get all external storage excluding emulated storage
     */
    fun Context.getExternalMountedStorages(): List<String>? {
        return try {
            val externalFilesDirs = ContextCompat.getExternalFilesDirs(this, null)
            externalFilesDirs.filter {
                extractExternalStorageId(it.path) != "emulated" && isExternalStorageMounted(it)
            }.map { it.absolutePath }
        } catch (e: Exception) {
            null
        }
    }

    fun Context.isAnyExternalStorageMounted(): Boolean {
        val externalFilesDirs = ContextCompat.getExternalFilesDirs(this, null)
        val res = externalFilesDirs.filter { extractExternalStorageId(it.path) != "emulated" && isExternalStorageMounted(it) }
        return res.isNotEmpty()
    }

    fun Context.isExternalStorageSavedMounted(): Boolean? {
        try {
            val externalFilesDirs = ContextCompat.getExternalFilesDirs(this, null)

            val extStorageId = sharedPreferences.getExternalStorageId() ?: return null

            val externalStorageDir = externalFilesDirs.firstOrNull {
                extractExternalStorageId(it.path) == extStorageId
            }

            return isExternalStorageMounted(externalStorageDir)
        } catch (e: Exception) {
            return false
        }

    }

    private fun Context.isExternalStorageMounted(externalStorageDir: File?): Boolean {
        return if (externalStorageDir != null) {
            val state = Environment.getExternalStorageState(externalStorageDir)
            state == Environment.MEDIA_MOUNTED
        } else {
            // External storage directory is null, indicating it's not mounted.
            false
        }
    }

    fun extractExternalStorageId(path: String): String {
        val pattern = "/storage/([^/]+)/".toRegex()
        val matchResult = pattern.find(path)
        if (matchResult != null) {
            return matchResult.groupValues[1]
        }
        return ""
    }
}