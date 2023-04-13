package com.distritv.ui

import android.annotation.SuppressLint
import android.app.Activity
import android.app.ActivityManager
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.util.Log
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.distritv.DistriTVApp
import com.distritv.R
import com.distritv.daemon.GarbageCollectorDaemon
import com.distritv.databinding.ActivityHomeBinding
import com.distritv.daemon.ContentRequestDaemon
import com.distritv.daemon.ContentSchedulingDaemon
import com.distritv.data.service.SharedPreferencesService
import com.distritv.utils.*
import org.koin.android.ext.android.inject


class HomeActivity : AppCompatActivity() , DeviceInfoFragment.OnFragmentInteractionListener {

    private val sharedPreferences: SharedPreferencesService by inject()

    private val MY_PERMISSIONS_REQUEST = 100

    private lateinit var binding: ActivityHomeBinding

    private lateinit var myApp: DistriTVApp

    private lateinit var contentParam: String


    @SuppressLint("AppCompatMethod")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityHomeBinding.inflate(layoutInflater)
        setContentView(binding.root)

        //setPermission()

        startServices()

        myApp = this.applicationContext as DistriTVApp

        contentParam = intent.extras?.getString(CONTENT_PARAM).toString()

        val contentType = intent.extras?.getString(CONTENT_TYPE_PARAM)
        val contentDuration = intent.extras?.getLong(CONTENT_DURATION_PARAM) ?: -1L

        addFragment(contentType, contentDuration)

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
            if(sharedPreferences.isDeviceRegistered()){
                supportFragmentManager.addFragment(
                    R.id.home_fragment_container,
                    ImageFragment(),
                    false,
                    ImageFragment.TAG
                )
                idDisplay()
            } else {
                binding.idInformationDisplay.visibility = View.INVISIBLE
                supportFragmentManager.addFragment(
                    R.id.home_fragment_container,
                    DeviceInfoFragment(),
                    false,
                    DeviceInfoFragment.TAG
                )
            }
        } else {
            //Content load
            binding.idInformationDisplay.visibility = View.INVISIBLE
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
                TEXT ->
                    supportFragmentManager.addFragment(
                        R.id.home_fragment_container,
                        TextFragment.newInstance(contentParam, contentDuration),
                        false,
                        TextFragment.TAG
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

    private fun startServices() {
        if (!isServiceRunning(ContentRequestDaemon::class.java)) {
            ContextCompat.startForegroundService(this, Intent(this, ContentRequestDaemon::class.java))
        }

        if (!isServiceRunning(ContentSchedulingDaemon::class.java)) {
            ContextCompat.startForegroundService(this, Intent(this, ContentSchedulingDaemon::class.java))
        }

        if (!isServiceRunning(GarbageCollectorDaemon::class.java)) {
            ContextCompat.startForegroundService(this, Intent(this, GarbageCollectorDaemon::class.java))
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

    @SuppressLint("HardwareIds", "SetTextI18n")
    private fun idDisplay(){
        binding.idInformationDisplay.text = "id : ${sharedPreferences.getDeviceId()}"
        binding.idInformationDisplay.visibility = View.VISIBLE
    }

    override fun onStartButtonPressed(id: String) {
        sharedPreferences.addDeviceId(id)
        supportFragmentManager.addFragment(
            R.id.home_fragment_container,
            ImageFragment(),
            false,
            ImageFragment.TAG
        )
        idDisplay()
    }

    companion object {
        const val TAG = "[HomeActivity]"
    }

}