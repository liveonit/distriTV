package com.distritv

import android.content.Intent
import android.graphics.BitmapFactory
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Toast
import com.distritv.data.FileDbService
import com.distritv.databinding.ActivityImageBinding
import java.io.File


class ImageActivity : AppCompatActivity() {

    private lateinit var binding: ActivityImageBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityImageBinding.inflate(layoutInflater)
        setContentView(binding.root)

        loadImage()

        binding.btnBack.setOnClickListener {
            val intent = Intent(this, MainActivity::class.java)
            startActivity(intent)
            finish()
        }

    }

    fun loadImage() {
        val fileDbService = FileDbService(this@ImageActivity)

        try {
            val file = fileDbService.getLastFileDownload()
            if (!file.localPath.isNullOrEmpty()) {
                val imgFile = File(file.localPath)
                if (imgFile.exists()) {
                    val imgBitmap = BitmapFactory.decodeFile(imgFile.absolutePath)
                    binding.imageContainer.setImageBitmap(imgBitmap)
                    Toast.makeText(this, "${file.name}", Toast.LENGTH_SHORT).show()
                }
            } else {
                RuntimeException()
            }
        } catch (e: Exception) {
            Toast.makeText(this, "No hay contenido disponible.", Toast.LENGTH_SHORT).show()
        }

    }
}