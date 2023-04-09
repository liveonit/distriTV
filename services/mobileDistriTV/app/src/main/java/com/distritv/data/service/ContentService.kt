package com.distritv.data.service

import android.content.Context
import android.util.Log
import com.distritv.data.model.Content
import okhttp3.ResponseBody
import java.io.*
import java.util.*

class ContentService(private val contentDbService: ContentDbService,
                     private val context: Context) {

    /**
     * Insert content into DB
     */
    fun saveContent(content: Content): Long {
        return try {
            contentDbService.insert(content)
        } catch (e: Exception) {
            Log.d(TAG, "${e.message}")
            -1L
        }
    }

    /**
     * Download content to local storage and insert into DB
     */
    fun saveContent(content: Content, response: ResponseBody): Long? {
        return try {

            if (response == null) -1L

            if (writeContentToLocalStorage(content, response)) {
                contentDbService.insert(content)
            } else {
                Log.e(TAG, "Server contact failed")
                -1L
            }
        } catch (e: Exception) {
            Log.d(TAG, "${e.message}")
            -1L
        }
    }

    private fun writeContentToLocalStorage(content: Content, body: ResponseBody): Boolean {
        return try {

            val fileName = UUID.randomUUID().toString()

            val futureStudioIconFile =
                File(context.
                    getExternalFilesDir(null), File.separator.toString() + fileName)

            content.localPath = futureStudioIconFile.path

            var inputStream: InputStream? = null
            var outputStream: OutputStream? = null
            try {
                val fileReader = ByteArray(4096)
                //val fileSize = body.contentLength()
                var fileSizeDownloaded: Long = 0
                inputStream = body.byteStream()
                outputStream = FileOutputStream(futureStudioIconFile)
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
                Log.i(TAG, "Content download was successful from ${content.url} to ${content.localPath}")
                true
            } catch (e: IOException) {
                Log.e(TAG, "Content download failed from ${content.url}")
                false
            } finally {
                inputStream?.close()
                outputStream?.close()
            }
        } catch (e: IOException) {
            false
        }
    }

    companion object {
        const val TAG = "[ContentService]"
    }

}