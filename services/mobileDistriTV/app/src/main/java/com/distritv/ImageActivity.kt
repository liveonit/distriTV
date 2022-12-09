package com.distritv

import android.content.Intent
import android.graphics.BitmapFactory
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.distritv.databinding.ActivityImageBinding
import java.io.File

const val IMAGE_PATH = "imagePath"

class ImageActivity : AppCompatActivity() {

    private lateinit var binding: ActivityImageBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityImageBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val imagePath = intent.extras?.getString(IMAGE_PATH) ?: ""

        if (!imagePath.isNullOrEmpty()) {
            val imgFile = File(imagePath)
            if (imgFile.exists()) {
                val imgBitmap = BitmapFactory.decodeFile(imgFile.absolutePath)
                binding.imageContainer.setImageBitmap(imgBitmap)
            }
        }

        binding.btnBack.setOnClickListener {
            val intent = Intent(this, MainActivity::class.java)
            startActivity(intent)
            finish()
        }

    }
}