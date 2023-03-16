package com.distritv.ui.video

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.distritv.R
import com.distritv.databinding.ActivityVideoPlaybackBinding
import com.distritv.utils.LOCAL_PATH_PARAM
import com.distritv.utils.addFragment

class VideoPlaybackActivity : AppCompatActivity() {

    private lateinit var binding: ActivityVideoPlaybackBinding
    lateinit var contentLocalPath: String

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityVideoPlaybackBinding.inflate(layoutInflater)
        setContentView(binding.root)

        contentLocalPath = intent.extras?.getString(LOCAL_PATH_PARAM).toString()

        supportFragmentManager.addFragment(
            R.id.video_playback_fragment_container,
            VideoPlaybackFragment.newInstance(contentLocalPath),
            false,
            VideoPlaybackFragment.TAG
        )
    }

}