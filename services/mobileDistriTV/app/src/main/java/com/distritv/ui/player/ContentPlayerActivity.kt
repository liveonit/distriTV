package com.distritv.ui.player

import android.annotation.SuppressLint
import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import com.distritv.DistriTVApp
import com.distritv.R
import com.distritv.data.model.Content
import com.distritv.databinding.ActivityContentPlayerBinding
import com.distritv.ui.*
import com.distritv.ui.home.HomeActivity
import com.distritv.utils.*


class ContentPlayerActivity : AppCompatActivity() {

    private lateinit var binding: ActivityContentPlayerBinding

    private lateinit var myApp: DistriTVApp

    private var content: Content? = null


    @SuppressLint("AppCompatMethod")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityContentPlayerBinding.inflate(layoutInflater)
        setContentView(binding.root)

        myApp = this.applicationContext as DistriTVApp

        content = intent.extras?.getParcelable(CONTENT_PARAM)
        if (content == null) {
            Log.e(TAG, "An error occurred while trying to play, back to home...")
            val intent = Intent(this, HomeActivity::class.java)
            this.startActivity(intent)
            this.finish()
        }

        addFragment()

        actionBar?.hide()
    }

    override fun onResume() {
        super.onResume()
        myApp.setCurrentActivity(this)
    }

    override fun onStop() {
        super.onStop()
        clearReferences()
    }

    override fun onPause() {
        super.onPause()
        clearReferences()
    }

    override fun onDestroy() {
        super.onDestroy()
        clearReferences()
        (this.applicationContext as DistriTVApp).setContentCurrentlyPlaying(false)
    }

    private fun clearReferences() {
        val currActivity: Activity? = myApp.getCurrentActivity()
        if (this == currActivity) myApp.setCurrentActivity(null)
    }

    private fun addFragment() {
        if (content?.isImage() == true) {
            supportFragmentManager.addFragment(
                R.id.player_fragment_container,
                ImageFragment.newInstance(content!!),
                false,
                ImageFragment.TAG
            )
        } else if (content?.isVideo() == true) {
            supportFragmentManager.addFragment(
                R.id.player_fragment_container,
                VideoFragment.newInstance(content!!),
                false,
                VideoFragment.TAG
            )
        } else if (content?.isText() == true) {
            supportFragmentManager.addFragment(
                R.id.player_fragment_container,
                TextFragment.newInstance(content!!),
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