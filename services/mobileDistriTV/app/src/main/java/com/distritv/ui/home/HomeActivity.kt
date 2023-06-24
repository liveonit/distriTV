package com.distritv.ui.home

import android.annotation.SuppressLint
import android.app.Activity
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.distritv.DistriTVApp
import com.distritv.R
import com.distritv.daemon.ContentSchedulingDaemon
import com.distritv.daemon.GarbageCollectorDaemon
import com.distritv.daemon.RequestDaemon
import com.distritv.databinding.ActivityHomeBinding
import com.distritv.utils.*
import org.koin.androidx.viewmodel.ext.android.viewModel


class HomeActivity : AppCompatActivity(), DeviceInfoFragment.OnFragmentInteractionListener {

    val viewModel by viewModel<HomeViewModel>()

    private lateinit var binding: ActivityHomeBinding

    private lateinit var myApp: DistriTVApp

    @SuppressLint("AppCompatMethod")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityHomeBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Request for user to grant this permission,
        // only for Android 10 and higher:
        requestPermissionDisplayOverOtherApps()

        startServices()

        myApp = this.applicationContext as DistriTVApp

        tvCodeValidationObserver()
        addFragmentObserver()

        checkIfDeviceIsRegistered()

        requestPermissionExternalStorage()

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

    private fun requestPermissionDisplayOverOtherApps() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q && !Settings.canDrawOverlays(this)) {
            startActivity(Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION))
        }
    }

    private fun startServices() {
        if (!isServiceRunning(RequestDaemon::class.java)) {
            startService(RequestDaemon::class.java)
        }
        if (!isServiceRunning(ContentSchedulingDaemon::class.java)) {
            startService(ContentSchedulingDaemon::class.java)
        }
        if (!isServiceRunning(GarbageCollectorDaemon::class.java)) {
            startService(GarbageCollectorDaemon::class.java)
        }
    }

    private fun startService(serviceClass: Class<*>) {
        ContextCompat.startForegroundService(this,
            Intent(this, serviceClass))
    }

    private fun isServiceRunning(serviceClass: Class<*>): Boolean {
        return isServiceRunning(this, serviceClass)
    }

    private fun checkIfDeviceIsRegistered() {
        viewModel.checkIfDeviceIsRegistered()
    }

    override fun onRegisterButtonPressed(code: String) {
        viewModel.registerTvCode(code)
    }

    private fun tvCodeValidationObserver() {
        viewModel.isValid.observe(this) { isValid ->
            if (isValid) {
                supportFragmentManager.addFragment(
                    R.id.home_fragment_container,
                    HomeFragment(),
                    false,
                    HomeFragment.TAG
                )
            }
        }
    }

    private fun addFragmentObserver() {
        viewModel.isRegistered.observe(this) { isRegistered ->
            if (isRegistered) {
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
    }

    private fun requestPermissionExternalStorage() {
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

    companion object {
        private const val MY_PERMISSIONS_REQUEST = 100
        const val TAG = "[HomeActivity]"
    }

}