package com.distritv.data.service

import android.content.ContentValues.TAG
import android.content.Context
import android.util.Log
import com.distritv.data.model.Content
import okhttp3.ResponseBody
import java.io.*
import java.util.*

class ContentService(private val contentDbService: ContentDbService,
                     private val context: Context) {

    /**
     * Download content to local storage and insert into DB
     */
    fun downloadContent(content: Content, response: ResponseBody): Long {
        return try {
            if (response == null) -1
            if (writeContentToLocalStorage(content, response)) {
                contentDbService.insert(content)
            } else {
                Log.d(TAG, "Server contact failed")
                -1
            }
        } catch (e: Exception) {
            Log.d(TAG, "${e.message}")
            -1
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
                Log.d(TAG, "Content download was successful from ${content.url} to ${content.localPath}")
                true
            } catch (e: IOException) {
                Log.d(TAG, "Content download failed from ${content.url}")
                false
            } finally {
                inputStream?.close()
                outputStream?.close()
            }
        } catch (e: IOException) {
            false
        }
    }

}