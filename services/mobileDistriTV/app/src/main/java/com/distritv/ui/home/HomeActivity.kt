package com.distritv.ui.home

import android.app.Activity
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.distritv.DistriTVApp
import com.distritv.R
import com.distritv.bootup.RequestService
import com.distritv.data.service.AlarmService
import com.distritv.databinding.ActivityHomeBinding
import com.distritv.ui.image.ImageFragment
import com.distritv.ui.video.VideoPlaybackFragment
import com.distritv.utils.*
import org.koin.android.ext.android.inject


class HomeActivity : AppCompatActivity(), HomeFragment.OnFragmentInteractionListener,
    ContentListFragment.OnFragmentInteractionListener {

    private val MY_PERMISSIONS_REQUEST = 100

    private lateinit var binding: ActivityHomeBinding

    private lateinit var myApp: DistriTVApp

    private lateinit var contentLocalPath: String

    private val alarmService: AlarmService by inject()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityHomeBinding.inflate(layoutInflater)
        setContentView(binding.root)

        Log.v(TAG, "pasando por homeActivity")

        setPermission()

        myApp = this.applicationContext as DistriTVApp

        contentLocalPath = intent.extras?.getString(LOCAL_PATH_PARAM).toString()

        addFragment(intent.extras?.getString(CONTENT_TYPE_PARAM))

        //Start request service in the background
        startService(Intent(this, RequestService::class.java))

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

    private fun addFragment(contentType: String?) {
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
                        ImageFragment.newInstance(contentLocalPath),
                        false,
                        ImageFragment.TAG
                    )
                VIDEO ->
                    supportFragmentManager.addFragment(
                        R.id.home_fragment_container,
                        VideoPlaybackFragment.newInstance(contentLocalPath),
                        false,
                        VideoPlaybackFragment.TAG
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

    override fun onDownloadButtonPressed() {
        supportFragmentManager.replaceFragment(
            R.id.home_fragment_container,
            ContentListFragment(),
            true,
            ContentListFragment.TAG
        )
    }

    override fun onBackButtonPressed() {
        supportFragmentManager.replaceFragment(
            R.id.home_fragment_container,
            HomeFragment(),
            true,
            HomeFragment.TAG
        )
    }

    companion object {
        const val TAG = "[HomeActivity]"
    }

}