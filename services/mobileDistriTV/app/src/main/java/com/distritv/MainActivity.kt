package com.distritv



import android.content.ContentValues.TAG
import android.content.Intent
import android.content.pm.PackageManager

import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.distritv.databinding.ActivityMainBinding
import com.distritv.service.FileDownloadClient
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.io.*


class MainActivity : AppCompatActivity() {

    private val MY_PERMISSIONS_REQUEST = 100

    private lateinit var binding: ActivityMainBinding

    var imagePath = ""

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        if (ContextCompat.checkSelfPermission(
                this,
                android.Manifest.permission.WRITE_EXTERNAL_STORAGE
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            ActivityCompat.requestPermissions(
                this,
                arrayOf(android.Manifest.permission.WRITE_EXTERNAL_STORAGE), MY_PERMISSIONS_REQUEST
            )
        }

        binding.btnDownload.setOnClickListener {
            downloadFile()
        }

        binding.btnPlay.setOnClickListener {
            play()
        }

    }

    fun downloadFile() {

        val call: Call<ResponseBody> = FileDownloadClient.service.downloadFileWithFixedUrl()

        call.enqueue(object : Callback<ResponseBody?> {
            override fun onResponse(
                call: Call<ResponseBody?>?,
                response: Response<ResponseBody?>?
            ) {
                if (response != null) {
                    if (response.isSuccessful()) {
                        Log.d(TAG, "server contacted and has file")
                        val writtenToDisk: Boolean = response.body()
                            ?.let { writeResponseBodyToDisk(it) } == true
                        Log.d(TAG, "file download was a success? $writtenToDisk")
                    } else {
                        Log.d(TAG, "server contact failed")
                    }
                }
            }

            override fun onFailure(call: Call<ResponseBody?>?, t: Throwable?) {
                Log.e(TAG, "error")
            }
        })
    }

    private fun writeResponseBodyToDisk(body: ResponseBody): Boolean {
        return try {
            // todo change the file location/name according to your needs
            val futureStudioIconFile =
                File(getExternalFilesDir(null), File.separator.toString() + "Descarga.png")

            imagePath = futureStudioIconFile.path

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
                    Log.d(TAG, "file download: $fileSizeDownloaded of $fileSize")
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


    fun play() {
        if (imagePath.isNullOrEmpty()) {
            Toast.makeText(this, "No hay contenido disponible. Vuelva a descargar.", Toast.LENGTH_SHORT).show()
        } else {
            val intent = Intent(this, ImageActivity::class.java)
            intent.putExtra(IMAGE_PATH, imagePath)
            startActivity(intent)
        }
    }


}