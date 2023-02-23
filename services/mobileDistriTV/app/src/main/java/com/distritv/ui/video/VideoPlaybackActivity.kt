package com.distritv.ui.video

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.distritv.R
import com.distritv.databinding.ActivityVideoPlaybackBinding
import com.distritv.utils.addFragment

class VideoPlaybackActivity : AppCompatActivity() {

    private lateinit var binding: ActivityVideoPlaybackBinding
    lateinit var fileLocalPath: String

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityVideoPlaybackBinding.inflate(layoutInflater)
        setContentView(binding.root)

        fileLocalPath = intent.extras?.getString("localPath").toString()

        supportFragmentManager.addFragment(
            R.id.video_playback_fragment_container,
            VideoPlaybackFragment.newInstance(fileLocalPath),
            false,
            VideoPlaybackFragment.TAG
        )
    }

}