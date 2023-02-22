package com.distritv.ui.home

import android.content.Intent
import android.content.pm.PackageManager

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.distritv.databinding.ActivityHomeBinding
import com.distritv.ui.image.ImageActivity
import com.distritv.ui.video.VideoPlaybackActivity
import org.koin.androidx.viewmodel.ext.android.viewModel


class HomeActivity : AppCompatActivity() {

    private val MY_PERMISSIONS_REQUEST = 100

    private lateinit var binding: ActivityHomeBinding
    private val viewModel by viewModel<HomeViewModel>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityHomeBinding.inflate(layoutInflater)
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

        downloadFileObserver()

        binding.btnDownload.setOnClickListener {
            viewModel.downloadFile()
        }

        binding.btnPlay.setOnClickListener {
            val intent = Intent(this, ImageActivity::class.java)
            startActivity(intent)
        }

        binding.btnPlayVideo.setOnClickListener {
            val intent = Intent(this, VideoPlaybackActivity::class.java)
            startActivity(intent)
        }

    }

    private fun downloadFileObserver() {
        viewModel.downloadResult.observe(this) {
            if (it) {
                Toast.makeText(this@HomeActivity, "Se descargó con éxito.", Toast.LENGTH_SHORT).show()
            } else {
                Toast.makeText(this@HomeActivity, "No se pudo realizar la descarga.", Toast.LENGTH_SHORT).show()
            }
        }
    }

}