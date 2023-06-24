package com.distritv.data.service

import android.content.Context
import android.os.Environment
import android.util.Log
import com.distritv.data.model.Content
import com.distritv.utils.CONTENTS_DIRECTORY
import okhttp3.ResponseBody
import java.io.*

class ContentService(private val contentDbService: ContentDBService,
                     private val scheduleDBService: ScheduleDBService,
                     private val context: Context) {

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
            val localPath = writeContentToLocalStorage(content, response)
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
            val localPath = writeContentToLocalStorage(content, response)
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

    private fun writeContentToLocalStorage(content: Content, body: ResponseBody): String? {
        return try {
          /*  val extStorageState = Environment.getExternalStorageState()
            if (Environment.MEDIA_MOUNTED == extStorageState) {
                Log.v(TAG, "siiiiii")
            } else{
                Log.v(TAG, "noooo")
            }

            val directory = Environment.getExternalStorageDirectory()*/

            ////////////////////////////////

            val rootDir = Environment.getExternalStorageDirectory().absolutePath
            val customDirectoryName = "MyCustomDirectory"
            val customDirectory = File(rootDir, customDirectoryName)
            if (!customDirectory.exists()) {
                val directoryCreated = customDirectory.mkdirs()
                if (!directoryCreated) {
                    // Directory creation failed. Handle the situation accordingly.
                }
            }
            //val fileName = "example.txt"
           // val file = File(customDirectory, fileName)
            val fileName = "${content.name}.${content.type.substringAfterLast("/")}"
            val file = File(customDirectory, fileName)

//////////////////////////////////////

        //    val directory = File(context.filesDir, CONTENTS_DIRECTORY)
//
           // val fileName = "${content.name}.${content.type.substringAfterLast("/")}"

     //       val file = File(directory, fileName)

            var inputStream: InputStream? = null
            var outputStream: OutputStream? = null

            try {
                val fileReader = ByteArray(4096)
                //val fileSize = body.contentLength()
                var fileSizeDownloaded: Long = 0
                inputStream = body.byteStream()
                outputStream = FileOutputStream(file)
                while (true) {
                    val read: Int = inputStream.read(fileReader)
                    if (read == -1) {
                        break
                    }
                    if (outputStream != null) {
                        outputStream.write(fileReader, 0, read)
                    }
                    fileSizeDownloaded += read.toLong()
                    //Log.d(TAG, "Content download: $fileSizeDownloaded of $fileSize")
                }
                if (outputStream != null) {
                    outputStream.flush()
                }
                Log.i(TAG, "Content download was successful from ${content.url} to ${file.path}")
                file.path
            } catch (e: IOException) {
                Log.e(TAG, "Content download failed from ${content.url}.")
                Log.e(TAG, "${e.javaClass} -> ${e.message}")
                null
            } finally {
                inputStream?.close()
                outputStream?.close()
            }
        } catch (e: IOException) {
            Log.e(TAG, "Content download failed from ${content.url}.")
            Log.e(TAG, "${e.javaClass} -> ${e.message}")
            null
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
                && contentDbService.delete(content.id) > 0) {
                Log.i(TAG, "Content was deleted: $content")
            }
        }
    }

    companion object {
        const val TAG = "[ContentService]"
    }

}