package com.distritv.data.helper

import android.annotation.SuppressLint
import android.content.ContentValues
import android.content.Context
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Environment
import android.provider.MediaStore
import android.util.Log
import androidx.annotation.RequiresApi
import androidx.core.content.ContextCompat
import com.distritv.R
import com.distritv.data.service.SharedPreferencesService
import okhttp3.ResponseBody
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import java.io.*
import java.nio.channels.FileChannel

object StorageHelper: KoinComponent {

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
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                moveFilesToInternalStorageWithMediaStore()
            } else {
                moveFilesToInternalStorage()
            }
        }
    }

    @RequiresApi(Build.VERSION_CODES.Q)
    fun Context.moveFilesToInternalStorageWithMediaStore() {
        val customDirectoryPath = getCustomExternalStorageDirectory()

        val collection = MediaStore.Files.getContentUri(MediaStore.VOLUME_EXTERNAL_PRIMARY)
        val projection = arrayOf(MediaStore.MediaColumns._ID, MediaStore.MediaColumns.DATA)
        val selection = "${MediaStore.MediaColumns.DATA} like ?"
        val selectionArgs = arrayOf("%/$customDirectoryPath/%")

        val contentResolver = contentResolver
        val cursor = contentResolver.query(
            collection,
            projection,
            selection,
            selectionArgs,
            null
        )

        cursor?.use { cursor ->
            val targetDirectory = File(getInternalStorageDirectory())

            if (!createOrClearTargetDirectory(targetDirectory)) {
                return@use
            }

            var result = false

            if (cursor.moveToFirst()) {
                do {
                    val filePath =
                        cursor.getString(cursor.getColumnIndexOrThrow(MediaStore.MediaColumns.DATA))
                    val fileName = getFileName(filePath)
                    val sourceFile = File(filePath)
                    val targetFile = File(targetDirectory, sourceFile.name)

                    result = transferFile(sourceFile, targetFile)
                    if (result) {
                        Log.i(TAG, "$LOG_COPY_OK: ${sourceFile.path}")
                    } else {
                        Log.e(TAG, "$LOG_COPY_KO: ${sourceFile.path}")
                    }
                } while (result && cursor.moveToNext());
            }

            if (result) {
                sharedPreferences.setExternalStorage(false)
                deleteFilesOnExtStorageWithMediaStore(null)
            }
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
        val targetDirectory = File(getExternalStorageDirectory())
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
                    Log.i(TAG, "$LOG_COPY_OK: ${sourceFile.path} to ${targetDirectory.path}")
                } else {
                    Log.e(TAG, "$LOG_COPY_KO: ${sourceFile.path} to ${targetDirectory.path}")
                }
                index++
            } while (result && index < sourceFiles.size)
        }

        if (result) {
            sharedPreferences.setExternalStorage(useExternalStorageSelected)
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

    @RequiresApi(Build.VERSION_CODES.Q)
    fun Context.deleteFilesOnExtStorageWithMediaStore(fileNameActiveContentList: List<String>?) {
        val customDirectoryPath = getCustomExternalStorageDirectory()

        val collection = MediaStore.Files.getContentUri(MediaStore.VOLUME_EXTERNAL_PRIMARY)
        val projection = arrayOf(MediaStore.MediaColumns._ID, MediaStore.MediaColumns.DATA)
        val selection = "${MediaStore.MediaColumns.DATA} like ?"
        val selectionArgs = arrayOf("%/$customDirectoryPath/%")

        val contentResolver = contentResolver
        val cursor = contentResolver.query(
            collection,
            projection,
            selection,
            selectionArgs,
            null
        )

        cursor?.use { cursor ->
            while (cursor.moveToNext()) {
                val filePath =
                    cursor.getString(cursor.getColumnIndexOrThrow(MediaStore.MediaColumns.DATA))

                if ((fileNameActiveContentList == null)
                    || !fileNameActiveContentList.contains(getFileName(filePath))
                ) {

                    val fileId =
                        cursor.getLong(cursor.getColumnIndexOrThrow(MediaStore.MediaColumns._ID))
                    val fileUri = Uri.withAppendedPath(collection, fileId.toString())

                    val deletedRows = contentResolver.delete(fileUri, null, null)
                    if (deletedRows > 0) {
                        Log.i(TAG, "$LOG_REMOVE_OK: $filePath")
                    } else {
                        Log.e(TAG, "$LOG_REMOVE_KO: $filePath")
                    }
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

    fun Context.createFileOnExternalStorage(fileName: String): Triple<OutputStream, String, String> {
        val rootDir = Environment.getExternalStorageDirectory().absolutePath
        val customDirectoryName = this.getCustomExternalStorageDirectory()
        val customDirectory = File(rootDir, customDirectoryName)

        if (!createOrClearTargetDirectory(customDirectory)) {
            // Directory creation failed.
            throw Exception("[createFileOnExternalStorage] Directory creation failed.")
        }

        val file = File(customDirectory, fileName)
        return Triple(FileOutputStream(file), file.path, file.name)
    }

    @RequiresApi(Build.VERSION_CODES.Q)
    fun Context.createFileOnExtStorageWithMediaStore(fileName: String, contentType: String): Triple<OutputStream?, String?, String?> {
        val contentValues = ContentValues().apply {
            put(MediaStore.MediaColumns.DISPLAY_NAME, fileName)
            put(MediaStore.MediaColumns.MIME_TYPE, contentType)
            put(MediaStore.MediaColumns.RELATIVE_PATH, getCustomExternalStorageDirectory())
        }

        val contentResolver = contentResolver
        val contentUri = MediaStore.Files.getContentUri(MediaStore.VOLUME_EXTERNAL_PRIMARY)

        val uri = contentResolver.insert(contentUri, contentValues)

        val outputStream = uri?.let { contentResolver.openOutputStream(it) }
        val localPath = getFilePath(uri)

        return Triple(outputStream, localPath, getFileName(localPath))
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

    private fun Context.getCustomExternalStorageDirectory(): String {
        return Environment.DIRECTORY_DOWNLOADS + File.separator + this.getString(R.string.app_name)
    }

    fun Context.getExternalStorageDirectory(): String {
        return Environment.getExternalStorageDirectory().absolutePath + File.separator + Environment.DIRECTORY_DOWNLOADS +
                File.separator + this.getString(R.string.app_name)
    }

    fun Context.getInternalStorageDirectory(): String {
        return this.filesDir.absolutePath
    }

    fun Context.getDirectory(): String {
        return if (sharedPreferences.useExternalStorage()) {
            Environment.getExternalStorageDirectory().absolutePath + File.separator + this.getCustomExternalStorageDirectory()
        } else {
            this.getInternalStorageDirectory()
        }
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

    private fun getFileName(filePath: String?): String? {
        if (filePath == null) {
            return null
        }

        val lastIndex = filePath.lastIndexOf("/")
        if (lastIndex != -1 && lastIndex < filePath.length - 1) {
            return filePath.substring(lastIndex + 1)
        }

        return null
    }

    @RequiresApi(Build.VERSION_CODES.Q)
    @SuppressLint("Range")
    fun Context.getFilePath(uri: Uri?): String? {
        val contentResolver = contentResolver
        val projection = arrayOf(MediaStore.MediaColumns.DATA)
        val selection = "${MediaStore.MediaColumns._ID} like ?"
        val selectionArgs =
            arrayOf(uri?.lastPathSegment)

        val cursor = contentResolver.query(
            MediaStore.Files.getContentUri(MediaStore.VOLUME_EXTERNAL_PRIMARY),
            projection,
            selection,
            selectionArgs,
            null
        )

        if (cursor != null && cursor.moveToFirst()) {
            val filePath = cursor.getString(cursor.getColumnIndex(MediaStore.MediaColumns.DATA))
            cursor.close()
            return filePath
        } else {
            // File not found or query failed.
            throw Exception("[getFilePath] File not found or query failed")
        }
    }

    fun Context.internalStorageDirIsEmpty(): Boolean {
        return directoryIsEmpty(false)
    }

    fun Context.externalStorageDirIsEmpty(): Boolean {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            directoryWithMediaStoreIsEmpty()
        } else {
            directoryIsEmpty(true)
        }
    }

    private fun Context.directoryWithMediaStoreIsEmpty(): Boolean {
        val customDirectoryPath = getCustomExternalStorageDirectory()

        val collection = MediaStore.Files.getContentUri(MediaStore.VOLUME_EXTERNAL_PRIMARY)
        val projection = arrayOf(MediaStore.MediaColumns._ID, MediaStore.MediaColumns.DATA)
        val selection = "${MediaStore.MediaColumns.DATA} like ?"
        val selectionArgs = arrayOf("%/$customDirectoryPath/%")

        val contentResolver = contentResolver
        val cursor = contentResolver.query(
            collection,
            projection,
            selection,
            selectionArgs,
            null
        )

        return (cursor == null) || (cursor.count == 0)
    }

    private fun Context.directoryIsEmpty(externalStorage: Boolean): Boolean {
        return if (externalStorage) {
            File(getExternalStorageDirectory()).listFiles()?.isEmpty() ?: true
        } else {
            File(getInternalStorageDirectory()).listFiles()?.isEmpty() ?: true
        }
    }

    /**
     * If folder does not exist it is created,
     * if folder already exists and it is not empty it is cleaned
     */
    private fun Context.createOrClearTargetDirectory(targetDirectory: File): Boolean {
        if (!targetDirectory.exists()) {
            if (!targetDirectory.mkdir()) {
                return false
            }
        } else {
            if (targetDirectory.absolutePath.equals(getInternalStorageDirectory())) {
                deleteFiles(targetDirectory, null)
            } else {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    deleteFilesOnExtStorageWithMediaStore(null)
                } else {
                    deleteFiles(targetDirectory, null)
                }
            }
        }
        return true
    }
}