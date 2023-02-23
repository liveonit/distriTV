package com.distritv.ui.image

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Toast
import com.distritv.ui.home.HomeActivity
import com.distritv.databinding.ActivityImageBinding
import com.distritv.ui.FullscreenManager
import org.koin.androidx.viewmodel.ext.android.viewModel


class ImageActivity : AppCompatActivity() {

    private lateinit var binding: ActivityImageBinding
    private val viewModel by viewModel<ImageViewModel>()
    lateinit var fileLocalPath: String

    private val fullscreenManager by lazy {
        FullscreenManager(window) {
            (binding.imageContainer)
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityImageBinding.inflate(layoutInflater)
        setContentView(binding.root)

        fileLocalPath = intent.extras?.getString("localPath").toString()

        loadImageObserver()

        fullscreenManager.enterFullscreen()

        binding.btnBack.setOnClickListener {
            val intent = Intent(this, HomeActivity::class.java)
            startActivity(intent)
            finish()
        }

        viewModel.fetchImage(fileLocalPath)
    }

    private fun loadImageObserver() {
        viewModel.image.observe(this) {
            if (it != null) {
                binding.imageContainer.setImageBitmap(it)
                //Toast.makeText(this, "${it.second}", Toast.LENGTH_SHORT).show()
            } else {
                Toast.makeText(this, "No hay contenido disponible.", Toast.LENGTH_SHORT).show()
            }
        }
    }
}