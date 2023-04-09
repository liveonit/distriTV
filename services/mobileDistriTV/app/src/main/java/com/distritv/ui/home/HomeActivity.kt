package com.distritv.ui.home


import android.content.Intent
import android.content.pm.PackageManager
import android.net.wifi.WifiManager
import android.os.Bundle
import android.provider.Settings
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.distritv.R
import com.distritv.bootup.RequestService
import com.distritv.databinding.ActivityHomeBinding
import com.distritv.ui.text.TextFragment
import com.distritv.utils.*

import android.provider.Settings.Secure;
import java.security.AccessController.getContext

class HomeActivity : AppCompatActivity(), HomeFragment.OnFragmentInteractionListener,
    ContentListFragment.OnFragmentInteractionListener {

    private val MY_PERMISSIONS_REQUEST = 100

    private lateinit var binding: ActivityHomeBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityHomeBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setPermission()

        val iDTV = Settings.Secure.getString(getApplicationContext().getContentResolver(), Settings.Secure.ANDROID_ID)


        supportFragmentManager.addFragment(
            R.id.home_fragment_container,
            HomeFragment(),
            false,
            HomeFragment.TAG
        )

        //Start request service in the background
        startService(Intent(this, RequestService::class.java))

        actionBar?.hide()
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

}







