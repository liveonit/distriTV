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

    suspend fun downloadFile(): Boolean {
        return try {
            val response = apiService.downloadFileWithFixedUrl()
            if (response != null) {
                val idBD = fileDbService.insert(FileDownload(null, "", "", "", ""))
                writeResponseBodyToDisk(response, idBD)
                true
            } else {
                Log.d(TAG, "server contact failed")
                false
            }
        } catch (ex: Exception) {
            false
        }
    }

    private fun writeResponseBodyToDisk(body: ResponseBody, idBD: Long): Boolean {
        return try {
            // todo change the file location/name according to your needs
            val fileExtension = body.contentType()?.subtype
            val fileNameWithExtension = "Descarga $idBD.$fileExtension"
            val futureStudioIconFile =
                File(context.
                    getExternalFilesDir(null), File.separator.toString() + fileNameWithExtension)

            fileDbService.update(idBD, FileDownload(null, fileNameWithExtension, futureStudioIconFile.path, "", ""))

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