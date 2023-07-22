package com.distritv.ui.player.content

import android.annotation.SuppressLint
import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.WindowManager
import androidx.appcompat.app.AppCompatActivity
import com.distritv.DistriTVApp
import com.distritv.R
import com.distritv.data.model.Content
import com.distritv.databinding.ActivityPlayerBinding
import com.distritv.ui.*
import com.distritv.ui.home.HomeActivity
import com.distritv.utils.*


class ContentPlayerActivity : AppCompatActivity() {

    private lateinit var binding: ActivityPlayerBinding

    private var myApp: DistriTVApp? = null

    private var content: Content? = null
    private var playStartDate: Long? = null


    @SuppressLint("AppCompatMethod")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityPlayerBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // So that this activity is not removed by the screen saver
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)

        myApp = this.applicationContext as DistriTVApp?

        content = intent.extras?.getParcelable(CONTENT_PARAM)
        if (content == null) {
            Log.e(TAG, "An error occurred while trying to play, back to home...")
            val intent = Intent(this, HomeActivity::class.java)
            this.startActivity(intent)
            this.finish()
        }

        playStartDate = intent.extras?.getLong(CONTENT_PLAY_START_DATE_PARAM)
        if (playStartDate == null) {
            playStartDate = -1L
        }

        addFragment()

        actionBar?.hide()
    }

    override fun onResume() {
        super.onResume()
        // Set the current activity
        myApp?.setCurrentActivity(this)
        // Set the identifier of the currently playing content:
        myApp?.setCurrentlyPlayingContentId(content?.id)
    }

    override fun onStop() {
        super.onStop()
        if (myApp?.skipClearing() == false) {
            clearReferences()
        }
    }

    override fun onPause() {
        super.onPause()
        if (myApp?.skipClearing() == false) {
            clearReferences()
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        if (myApp?.skipClearing() == false) {
            // Notice that the content playback has finished:
            myApp?.setIfAnyContentIsCurrentlyPlaying(false)
            // Clear the identifier of the content that was playing:
            myApp?.setCurrentlyPlayingContentId(null)
            clearReferences()
            myApp?.setSkipClearing(null)
        }
    }

    private fun clearReferences() {
        val currActivity: Activity? = myApp?.getCurrentActivity()
        if (this == currActivity) myApp?.setCurrentActivity(null)
    }

    private fun addFragment() {
        if (content?.isImage() == true) {
            supportFragmentManager.addFragment(
                R.id.player_fragment_container,
                ImageFragment.newInstance(content!!, playStartDate!!),
                false,
                ImageFragment.TAG
            )
        } else if (content?.isVideo() == true) {
            supportFragmentManager.addFragment(
                R.id.player_fragment_container,
                VideoFragment.newInstance(content!!, playStartDate!!),
                false,
                VideoFragment.TAG
            )
        } else if (content?.isText() == true) {
            supportFragmentManager.addFragment(
                R.id.player_fragment_container,
                TextFragment.newInstance(content!!, playStartDate!!),
                false,
                TextFragment.TAG
            )
        } else {
            Log.e(TAG, "Unsupported content type: ${content?.type ?: ""}")
        }
    }

    companion object {
        const val TAG = "[ContentPlayerActivity]"
    }

}