package com.distritv.ui

import android.app.Activity
import android.app.ActivityManager
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.distritv.DistriTVApp
import com.distritv.R
import com.distritv.databinding.ActivityHomeBinding
import com.distritv.daemon.DaemonRequest
import com.distritv.daemon.DaemonSchedule
import com.distritv.utils.*


class HomeActivity : AppCompatActivity() {

    private val MY_PERMISSIONS_REQUEST = 100

    private lateinit var binding: ActivityHomeBinding

    private lateinit var myApp: DistriTVApp

    private lateinit var contentParam: String


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityHomeBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setPermission()

        myApp = this.applicationContext as DistriTVApp

        contentParam = intent.extras?.getString(CONTENT_PARAM).toString()

        val contentType = intent.extras?.getString(CONTENT_TYPE_PARAM)
        val contentDuration = intent.extras?.getLong(CONTENT_DURATION_PARAM) ?: -1L

        addFragment(contentType, contentDuration)

        if (!isServiceRunning(DaemonRequest::class.java)) {
            ContextCompat.startForegroundService(this, Intent(this, DaemonRequest::class.java))
        }

        if (!isServiceRunning(DaemonSchedule::class.java)) {
            ContextCompat.startForegroundService(this, Intent(this, DaemonSchedule::class.java))
        }

        //if (!isServiceRunning(DaemonInactivateContent::class.java)) {
        //    ContextCompat.startForegroundService(this, Intent(this, DaemonInactivateContent::class.java))
        //}

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
    }

    private fun clearReferences() {
        val currActivity: Activity? = myApp.getCurrentActivity()
        if (this == currActivity) myApp.setCurrentActivity(null)
    }

    private fun addFragment(contentType: String?, contentDuration: Long) {
        if (contentType.isNullOrBlank()) {
            //Default load
            supportFragmentManager.addFragment(
                R.id.home_fragment_container,
                ImageFragment(),
                false,
                ImageFragment.TAG
            )
        } else {
            //Content load
            when (contentType) {
                IMAGE ->
                    supportFragmentManager.addFragment(
                        R.id.home_fragment_container,
                        ImageFragment.newInstance(contentParam, contentDuration),
                        false,
                        ImageFragment.TAG
                    )
                VIDEO ->
                    supportFragmentManager.addFragment(
                        R.id.home_fragment_container,
                        VideoFragment.newInstance(contentParam, contentDuration),
                        false,
                        VideoFragment.TAG
                    )
                else -> {
                    Log.e(TAG, "Unsupported content type: $contentType")
                }
            }
        }
    }

    private fun setPermission() {
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
    }

    private fun isServiceRunning(serviceClass: Class<*>): Boolean {
        val manager = getSystemService(ACTIVITY_SERVICE) as ActivityManager
        for (service in manager.getRunningServices(Int.MAX_VALUE)) {
            if (serviceClass.name == service.service.className) {
                return true
            }
        }
        return false
    }

    companion object {
        const val TAG = "[HomeActivity]"
    }

}