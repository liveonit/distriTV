package com.distritv.service

import android.content.ContentValues
import android.content.ContentValues.TAG
import android.content.Context
import android.util.Log
import com.distritv.data.ApiService
import com.distritv.data.FileDbService
import com.distritv.model.FileDownload
import okhttp3.ResponseBody
import java.io.*

class FileDownloadService(private val fileDbService: FileDbService,
                          private val context: Context, private val apiService: ApiService) {

    fun downloadFile(fileDownload: FileDownload, response: ResponseBody): Long {
        return try {
            if (response != null) {
                val idBD = fileDbService.insert(fileDownload)
                writeResponseBodyToDisk(fileDownload, response, idBD)
                idBD
            } else {
                Log.d(TAG, "server contact failed")
                -1
            }
        } catch (ex: Exception) {
            -1
        }
    }

    private fun writeResponseBodyToDisk(fileDownload: FileDownload, body: ResponseBody, idBD: Long): Boolean {
        return try {
            // todo change the file location/name according to your needs


            val futureStudioIconFile =
                File(context.
                    getExternalFilesDir(null), File.separator.toString() + fileDownload.name)

            fileDownload.localPath = futureStudioIconFile.path
            fileDbService.update(idBD, fileDownload)

            var inputStream: InputStream? = null
            var outputStream: OutputStream? = null
            try {
                val fileReader = ByteArray(4096)
                val fileSize = body.contentLength()
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
                    Log.d(ContentValues.TAG, "file download: $fileSizeDownloaded of $fileSize")
                }
                if (outputStream != null) {
                    outputStream.flush()
                }
                true
            } catch (e: IOException) {
                false
            } finally {
                if (inputStream != null) {
                    inputStream.close()
                }
                if (outputStream != null) {
                    outputStream.close()
                }
            }
        } catch (e: IOException) {
            false
        }
    }
}