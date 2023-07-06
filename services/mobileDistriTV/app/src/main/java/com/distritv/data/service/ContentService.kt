package com.distritv.data.service

import android.annotation.SuppressLint
import android.content.ContentValues
import android.content.Context
import android.net.Uri
import android.os.Build
import android.os.Environment
import android.provider.MediaStore
import android.util.Log
import androidx.annotation.RequiresApi
import com.distritv.data.model.Content
import com.distritv.utils.CONTENTS_DIRECTORY
import com.distritv.utils.StorageHelper.getCustomExternalStorageDirectory
import okhttp3.ResponseBody
import java.io.*


class ContentService(
    private val context: Context,
    private val contentDbService: ContentDBService,
    private val scheduleDBService: ScheduleDBService,
    private val sharedPreferences: SharedPreferencesService,
) {

    /**
     * Insert content into DB
     */
    fun saveNewContent(content: Content): Long {
        return try {
            contentDbService.insert(content)
        } catch (e: Exception) {
            Log.d(TAG, "${e.message}")
            -1L
        }
    }

    /**
     * Update content into DB
     */
    fun saveExistingContent(content: Content): Long {
        return try {
            val countResult = contentDbService.update(content.id, content)
            if (countResult > 0) {
                return content.id
            }
            -1L
        } catch (e: Exception) {
            Log.d(TAG, "${e.message}")
            -1L
        }
    }

    /**
     * Download content to local storage and insert into DB
     */
    fun downloadAndInsertContent(content: Content, response: ResponseBody): Long {
        return try {
            val localPath = writeContentToStorage(content, response)
            if (localPath != null) {
                content.localPath = localPath
                return contentDbService.insert(content)
            }
            -1L
        } catch (e: Exception) {
            Log.e(TAG, "${e.javaClass} -> ${e.message}")
            -1L
        }
    }

    /**
     * Download content to local storage and update existing content in DB
     */
    fun downloadAndUpdateContent(content: Content, response: ResponseBody): Long {
        return try {
            val localPath = writeContentToStorage(content, response)
            if (localPath != null) {
                content.localPath = localPath
                val countResult = contentDbService.update(content.id, content)
                if (countResult > 0) {
                    return content.id
                }
            }
            -1L
        } catch (e: Exception) {
            Log.e(TAG, "${e.javaClass} -> ${e.message}")
            -1L
        }
    }

    private fun writeContentToStorage(content: Content, body: ResponseBody): String? {
        var outputStreamAndPath: Pair<OutputStream?, String?> = Pair(null, null)

        try {
            val fileName = "${content.name}.${content.type.substringAfterLast("/")}"

            outputStreamAndPath = if (sharedPreferences.useExternalStorage()) {
                // Write to external storage
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    // For Android 10 or higher
                    createFileOnExtStorageWithMediaStore(fileName, content.type)
                } else {
                    createFileOnExternalStorage(fileName)
                }
            } else {
                // Write to internal storage
                createFileOnInternalStorage(fileName)
            }

            val outputStream = outputStreamAndPath.first
            val path = outputStreamAndPath.second

            if (writeContent(outputStream, body)) {
                Log.i(TAG, "Content download was successful from ${content.url} to $path")
                return path
            }

            return null
        } catch (e: IOException) {
            Log.e(TAG, "Content download failed from ${content.url}.")
            Log.e(TAG, "${e.javaClass} -> ${e.message}")
            return null
        } finally {
            outputStreamAndPath.first?.close()
        }
    }

    private fun createFileOnInternalStorage(fileName: String): Pair<OutputStream, String> {
        val directory = File(context.filesDir, CONTENTS_DIRECTORY)
        val file = File(directory, fileName)
        Log.v(TAG, "createFileOnInternalStorage")
        return Pair(FileOutputStream(file), file.path)
    }

    private fun createFileOnExternalStorage(fileName: String): Pair<OutputStream, String> {
        val rootDir = Environment.getExternalStorageDirectory().absolutePath
        val customDirectoryName = context.getCustomExternalStorageDirectory()
        val customDirectory = File(rootDir, customDirectoryName)
        if (!customDirectory.exists()) {
            val directoryCreated = customDirectory.mkdirs()
            if (!directoryCreated) {
                // Directory creation failed.
                throw Exception("[createFileOnExternalStorage] Directory creation failed.")
            }
        }
        val file = File(customDirectory, fileName)
        Log.v(TAG, "createFileOnExternalStorage")
        return Pair(FileOutputStream(file), file.path)
    }

    @RequiresApi(Build.VERSION_CODES.Q)
    private fun createFileOnExtStorageWithMediaStore(fileName: String, contentType: String): Pair<OutputStream?, String?> {
        val contentValues = ContentValues().apply {
            put(MediaStore.MediaColumns.DISPLAY_NAME, fileName)
            put(MediaStore.MediaColumns.MIME_TYPE, contentType)
            put(MediaStore.MediaColumns.RELATIVE_PATH, context.getCustomExternalStorageDirectory())
        }

        val contentResolver = context.contentResolver
        val contentUri = MediaStore.Files.getContentUri(MediaStore.VOLUME_EXTERNAL_PRIMARY)

        val uri = contentResolver.insert(contentUri, contentValues)

        val outputStream = uri?.let { contentResolver.openOutputStream(it) }
        val localPath = getFilePath(uri)
        Log.v(TAG, "createFileOnExtStorageWithMediaStore")
        return Pair(outputStream, localPath)
    }

    @RequiresApi(Build.VERSION_CODES.Q)
    @SuppressLint("Range")
    fun getFilePath(uri: Uri?): String? {
        val contentResolver = context.contentResolver
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

    private fun writeContent(outputStream: OutputStream?, body: ResponseBody): Boolean {
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

    fun getLocalPathActiveContents(): List<String> {
        return contentDbService.findLocalPathContents()
    }

    fun getAllContents(): List<Content> {
        return contentDbService.findAllContents()
    }

    fun getContentById(id: Long): Content? {
        return contentDbService.findByContentId(id)
    }

    fun deleteExpiredContent() {
        val contentList = contentDbService.findAllContents()
        contentList.forEach { content ->
            if (!scheduleDBService.existsScheduleWithContentId(content.id)
                && contentDbService.delete(content.id) > 0
            ) {
                Log.i(TAG, "Content was deleted: $content")
            }
        }
    }

    fun deleteExpiredContentFiles() {
        if (sharedPreferences.useExternalStorage()) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                deleteFilesOnExtStorageWithMediaStore()
            } else {
                val rootDir = Environment.getExternalStorageDirectory().absolutePath
                val customDirectoryName = context.getCustomExternalStorageDirectory()
                deleteFiles(File(rootDir, customDirectoryName))
            }
        } else {
            deleteFiles(File(context.filesDir, CONTENTS_DIRECTORY))
        }
    }

    private fun deleteFiles(directory: File) {
        val files = directory.listFiles()
        files?.forEach { file ->
            if (!getLocalPathActiveContents().contains(file.path)) {
                if (file.delete()) {
                    Log.i(TAG, "$LOG_REMOVE_OK: ${file.path}")
                } else {
                    Log.e(TAG, "$LOG_REMOVE_KO: ${file.path}")
                }
            }
        }
    }

     @RequiresApi(Build.VERSION_CODES.Q)
     private fun deleteFilesOnExtStorageWithMediaStore() {
         val customDirectoryPath = context.getCustomExternalStorageDirectory()

         val collection = MediaStore.Files.getContentUri(MediaStore.VOLUME_EXTERNAL_PRIMARY)
         val projection = arrayOf(MediaStore.MediaColumns._ID, MediaStore.MediaColumns.DATA)
         val selection = "${MediaStore.MediaColumns.DATA} like ?"
         val selectionArgs = arrayOf("%/$customDirectoryPath/%")

         val contentResolver = context.contentResolver
         val cursor = contentResolver.query(
             collection,
             projection,
             selection,
             selectionArgs,
             null
         )

         cursor?.use { cursor ->
             while (cursor.moveToNext()) {
                 val columnIndex = cursor.getColumnIndexOrThrow(MediaStore.MediaColumns.DATA)
                 val filePath = cursor.getString(columnIndex)

                 if (!getLocalPathActiveContents().contains(filePath)) {
                     val fileId = cursor.getLong(cursor.getColumnIndexOrThrow(MediaStore.MediaColumns._ID))
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

    companion object {
        const val TAG = "[ContentService]"
        private const val LOG_REMOVE_OK = "Removal successful"
        private const val LOG_REMOVE_KO = "Failed to delete"
    }

}