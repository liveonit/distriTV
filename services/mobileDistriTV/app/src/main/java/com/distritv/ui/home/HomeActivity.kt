package com.distritv.ui.home

import android.annotation.SuppressLint
import android.app.Activity
import android.app.ActivityManager
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.distritv.DistriTVApp
import com.distritv.R
import com.distritv.daemon.GarbageCollectorDaemon
import com.distritv.databinding.ActivityHomeBinding
import com.distritv.daemon.RequestDaemon
import com.distritv.daemon.ContentSchedulingDaemon
import com.distritv.data.repositories.ScheduleRepository
import com.distritv.data.service.SharedPreferencesService
import com.distritv.ui.player.ImageFragment
import com.distritv.ui.player.ImageViewModel
import com.distritv.utils.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import org.koin.android.ext.android.inject
import org.koin.androidx.viewmodel.ext.android.viewModel
import java.util.concurrent.TimeUnit


class HomeActivity : AppCompatActivity(), DeviceInfoFragment.OnFragmentInteractionListener {

    private val viewModel by viewModel<HomeViewModel>()

    private val MY_PERMISSIONS_REQUEST = 100

    private lateinit var binding: ActivityHomeBinding

    private lateinit var myApp: DistriTVApp


    @SuppressLint("AppCompatMethod")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityHomeBinding.inflate(layoutInflater)
        setContentView(binding.root)

        //setPermission()

        startServices()

        myApp = this.applicationContext as DistriTVApp

        addFragment()

        actionBar?.hide()

        loadObserver()
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
         viewModel.isRegistered()
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
        viewModel.registerDeviceId(id)
    }

    private fun loadObserver() {
        viewModel.isValid.observe(this) {
            if (it) {
                supportFragmentManager.addFragment(
                    R.id.home_fragment_container,
                    HomeFragment(),
                    false,
                    HomeFragment.TAG
                )
            } else {
                Toast.makeText(this, "ID INVALIDA", Toast.LENGTH_SHORT).show()
            }
        }
        viewModel.isRegistered.observe(this){
            if(it){
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



    companion object {
        const val TAG = "[HomeActivity]"
    }

}