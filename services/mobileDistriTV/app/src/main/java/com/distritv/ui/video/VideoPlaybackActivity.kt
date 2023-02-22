package com.distritv.ui.video

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.distritv.R
import com.distritv.databinding.ActivityVideoPlaybackBinding
import com.distritv.utils.addFragment

class VideoPlaybackActivity : AppCompatActivity(),
    VideoPlaybackFragment.OnFragmentInteractionListener {

    private lateinit var binding: ActivityVideoPlaybackBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityVideoPlaybackBinding.inflate(layoutInflater)
        setContentView(binding.root)

        supportFragmentManager.addFragment(
            R.id.video_playback_fragment_container,
            VideoPlaybackFragment(),
            false,
            VideoPlaybackFragment.TAG
        )
    }

    override fun onHelpButtonPressed(exampleParam: Int) {
        TODO("Not yet implemented")
    }

    override fun onStartButtonPressed() {
        TODO("Not yet implemented")
    }

}