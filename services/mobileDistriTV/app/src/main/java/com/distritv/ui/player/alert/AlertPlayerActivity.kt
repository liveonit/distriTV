package com.distritv.ui.player.alert

import android.annotation.SuppressLint
import android.app.Activity
import android.os.Bundle
import android.util.Log
import android.view.WindowManager
import androidx.appcompat.app.AppCompatActivity
import com.distritv.DistriTVApp
import com.distritv.R
import com.distritv.data.model.Alert
import com.distritv.databinding.ActivityPlayerBinding
import com.distritv.ui.*
import com.distritv.utils.*


class AlertPlayerActivity : AppCompatActivity() {

    private lateinit var binding: ActivityPlayerBinding

    private var myApp: DistriTVApp? = null

    private var alert: Alert? = null


    @SuppressLint("AppCompatMethod")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityPlayerBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // So that this activity is not removed by the screen saver
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)

        myApp = this.applicationContext as DistriTVApp?

        alert = intent.extras?.getParcelable(ALERT_PARAM)

        addFragment()

        actionBar?.hide()
    }

    override fun onResume() {
        super.onResume()
        // Set the current activity
        myApp?.setCurrentActivity(this)
        // Set the identifier of the currently playing content:
        myApp?.setCurrentlyPlayingAlertId(alert?.id)
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
        // Notice that the content playback has finished:
        myApp?.setIfAnyAlertIsCurrentlyPlaying(false)
        // Clear the identifier of the content that was playing:
        myApp?.setCurrentlyPlayingAlertId(null)
    }

    private fun clearReferences() {
        val currActivity: Activity? = myApp?.getCurrentActivity()
        if (this == currActivity) myApp?.setCurrentActivity(null)
    }

    private fun addFragment() {
        if (alert?.isImage() == true) {
            supportFragmentManager.addFragment(
                R.id.player_fragment_container,
                AlertImageFragment.newInstance(alert!!),
                false,
                AlertImageFragment.TAG
            )
        } else if (alert?.isText() == true) {
            supportFragmentManager.addFragment(
                R.id.player_fragment_container,
                AlertTextFragment.newInstance(alert!!),
                false,
                AlertTextFragment.TAG
            )
        } else {
            Log.e(TAG, "Unsupported alert type: ${alert?.type ?: ""}")
        }
    }

    companion object {
        const val TAG = "[AlertPlayerActivity]"
    }

}