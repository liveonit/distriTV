package com.distritv.ui.home

import android.annotation.SuppressLint
import android.app.Activity
import android.app.ActivityManager
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.distritv.DistriTVApp
import com.distritv.R
import com.distritv.daemon.ContentSchedulingDaemon
import com.distritv.daemon.GarbageCollectorDaemon
import com.distritv.daemon.RequestDaemon
import com.distritv.data.service.SharedPreferencesService
import com.distritv.databinding.ActivityHomeBinding
import com.distritv.utils.*
import org.koin.android.ext.android.inject


class HomeActivity : AppCompatActivity(), DeviceInfoFragment.OnFragmentInteractionListener {

    private val sharedPreferences: SharedPreferencesService by inject()

    private val MY_PERMISSIONS_REQUEST = 100

    private lateinit var binding: ActivityHomeBinding

    private lateinit var myApp: DistriTVApp


    @SuppressLint("AppCompatMethod")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityHomeBinding.inflate(layoutInflater)
        setContentView(binding.root)

        //setPermission()

        // Request for user to grant this permission,
        // only for Android 10 and higher:
        requestPermissionDisplayOverOtherApps()

        startServices()

        myApp = this.applicationContext as DistriTVApp

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
    }

    private fun clearReferences() {
        val currActivity: Activity? = myApp.getCurrentActivity()
        if (this == currActivity) myApp.setCurrentActivity(null)
    }

    private fun addFragment() {
        if (sharedPreferences.isDeviceRegistered()) {
            supportFragmentManager.addFragment(
                R.id.home_fragment_container,
                HomeFragment(),
                false,
                HomeFragment.TAG
            )
        } else {
            supportFragmentManager.addFragment(
                R.id.home_fragment_container,
                DeviceInfoFragment(),
                false,
                DeviceInfoFragment.TAG
            )
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

    private fun requestPermissionDisplayOverOtherApps() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q && !Settings.canDrawOverlays(this)) {
            startActivity(Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION))
        }
    }

    private fun startServices() {
        if (!isServiceRunning(RequestDaemon::class.java)) {
            ContextCompat.startForegroundService(this,
                Intent(this, RequestDaemon::class.java))
        }

        if (!isServiceRunning(ContentSchedulingDaemon::class.java)) {
            ContextCompat.startForegroundService(this,
                Intent(this, ContentSchedulingDaemon::class.java))
        }

        if (!isServiceRunning(GarbageCollectorDaemon::class.java)) {
            ContextCompat.startForegroundService(this,
                Intent(this, GarbageCollectorDaemon::class.java))
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

    override fun onRegisterButtonPressed(id: String) {
        sharedPreferences.addDeviceId(id)
        supportFragmentManager.addFragment(
            R.id.home_fragment_container,
            HomeFragment(),
            false,
            HomeFragment.TAG
        )
    }

    companion object {
        const val TAG = "[HomeActivity]"
    }

}