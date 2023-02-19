package com.distritv.imageview

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Toast
import com.distritv.home.HomeActivity
import com.distritv.databinding.ActivityImageBinding
import org.koin.androidx.viewmodel.ext.android.viewModel


class ImageActivity : AppCompatActivity() {

    private lateinit var binding: ActivityImageBinding
    private val viewModel by viewModel<ImageViewModel>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityImageBinding.inflate(layoutInflater)
        setContentView(binding.root)

        loadImageObserver()

        binding.btnBack.setOnClickListener {
            val intent = Intent(this, HomeActivity::class.java)
            startActivity(intent)
            finish()
        }

        viewModel.fetchImage()
    }

    private fun loadImageObserver() {
        viewModel.image.observe(this) {
            if (it != null) {
                binding.imageContainer.setImageBitmap(it.first)
                Toast.makeText(this, "${it.second}", Toast.LENGTH_SHORT).show()
            } else {
                Toast.makeText(this, "No hay contenido disponible.", Toast.LENGTH_SHORT).show()
            }
        }
    }
}