package com.distritv.data.service

import android.content.Context
import android.util.Log
import com.distritv.data.model.Content
import com.distritv.data.helper.StorageHelper.createFileOnExternalStorage
import com.distritv.data.helper.StorageHelper.createFileOnInternalStorage
import com.distritv.data.helper.StorageHelper.deleteFiles
import com.distritv.data.helper.StorageHelper.getExternalStorageDirectory
import com.distritv.data.helper.StorageHelper.getInternalStorageDirectory
import com.distritv.data.helper.StorageHelper.writeContent
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
            val fileName = writeContentToStorage(content, response)
            if (fileName != null) {
                content.fileName = fileName
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
            val fileName = writeContentToStorage(content, response)
            if (fileName != null) {
                content.fileName = fileName
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
        var outputStreamAndPath: Triple<OutputStream?, String?, String?> = Triple(null, null, null)

        try {
            outputStreamAndPath = if (sharedPreferences.useExternalStorage()) {
                // Write to external storage
                context.createFileOnExternalStorage(content.name)
            } else {
                // Write to internal storage
                context.createFileOnInternalStorage(content.name)
            }

            val outputStream = outputStreamAndPath.first
            val path = outputStreamAndPath.second
            val resultFileName = outputStreamAndPath.third

            if (writeContent(outputStream, body)) {
                Log.i(TAG, "Content download was successful from ${content.url} to $path")
                return resultFileName
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

    private fun getFileNameActiveContents(): List<String> {
        return contentDbService.findFileNameContents()
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
            val externalStorageDirectory = context.getExternalStorageDirectory()
            if (externalStorageDirectory != null) {
                deleteFiles(File(externalStorageDirectory), getFileNameActiveContents())
            }
        } else {
            deleteFiles(File(context.getInternalStorageDirectory()), getFileNameActiveContents())
        }
    }

    companion object {
        const val TAG = "[ContentService]"
    }

}