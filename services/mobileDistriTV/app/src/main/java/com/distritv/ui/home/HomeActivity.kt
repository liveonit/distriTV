package com.distritv.ui.home

import android.Manifest
import android.annotation.SuppressLint
import android.app.Activity
import android.app.AlertDialog
import android.content.DialogInterface
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
import com.distritv.data.helper.StorageHelper.SDK_VERSION_FOR_MEDIA_STORE
import com.distritv.databinding.ActivityHomeBinding
import com.distritv.ui.home.HomeViewModel.Companion.DEVICE_INFO
import com.distritv.ui.home.HomeViewModel.Companion.HOME
import com.distritv.utils.*
import org.koin.androidx.viewmodel.ext.android.viewModel


class HomeActivity : AppCompatActivity(), DeviceInfoFragment.OnFragmentInteractionListener,
    HomeFragment.OnFragmentInteractionListener {

    val viewModel by viewModel<HomeViewModel>()

    private lateinit var binding: ActivityHomeBinding

    private lateinit var myApp: DistriTVApp

    private var referrer = -1
    private lateinit var externalStorageDialog: AlertDialog

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
        referrerRequestPermissionObserver()
        addFragmentObserver()

        checkIfDeviceIsRegistered()

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
        if (::externalStorageDialog.isInitialized && externalStorageDialog.isShowing) {
            externalStorageDialog.cancel()
        }
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

    override fun onRegisterButtonPressed(code: String, useExternalStorage: Boolean) {
        viewModel.registerTvCode(code, useExternalStorage)
    }

    override fun onChangeStorage(useExternalStorage: Boolean) {
        viewModel.changeUseExternalStorage(useExternalStorage)
    }

    private fun tvCodeValidationObserver() {
        viewModel.isValid.observe(this) { isValid ->
            if (isValid) {
                if (viewModel.externalStorageSelected.value == true) {
                    requestWriteExternalStoragePermission()
                } else {
                    addHomeFragment()
                }
            }
        }
    }

    private fun referrerRequestPermissionObserver() {
        viewModel.referrerRequestPerm.observe(this) {ref ->
            referrer = ref
            if (ref == HOME){
                requestWriteExternalStoragePermission()
            }
        }
    }


    private fun addHomeFragment() {
        supportFragmentManager.addFragment(
            R.id.home_fragment_container,
            HomeFragment(),
            false,
            HomeFragment.TAG
        )
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

    private fun requestWriteExternalStoragePermission() {
        if (Build.VERSION.SDK_INT >= SDK_VERSION_FOR_MEDIA_STORE || ContextCompat.checkSelfPermission(
                this,
                Manifest.permission.WRITE_EXTERNAL_STORAGE
            ) == PackageManager.PERMISSION_GRANTED
        ) {
            if (referrer == DEVICE_INFO) {
                viewModel.afterWriteExternalStoragePermissionGranted()
                addHomeFragment()
            } else {
                viewModel.afterWriteExternalStoragePermissionGrantedAndMoveFiles()
            }
        } else {
            ActivityCompat.requestPermissions(
                this,
                arrayOf(Manifest.permission.WRITE_EXTERNAL_STORAGE),
                PERMISSIONS_REQUEST
            )
        }
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == PERMISSIONS_REQUEST) {
            if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                // Permission granted
                if (referrer == DEVICE_INFO) {
                    viewModel.afterWriteExternalStoragePermissionGranted()
                    addHomeFragment()
                } else {
                    viewModel.afterWriteExternalStoragePermissionGrantedAndMoveFiles()
                }
            } else {
                // Permission denied
                viewModel.setExternalStorage(false)
                val dialogText = viewModel.getDialogTextPermissionDenied()
                if (referrer == DEVICE_INFO) {
                    showDialog(
                        dialogText.first,
                        dialogText.second,
                        dialogText.third,
                        dialogConfirmFun
                    )
                } else {
                    showDialog(dialogText.first, dialogText.second, dialogText.third, null)
                }
            }
        }
    }

    private fun showDialog(
        title: String,
        msg: String,
        posBtn: String,
        dialogConfirmFun: ((dialog: DialogInterface, _: Int) -> Unit)?
    ) {
        val builder = AlertDialog.Builder(this)
        builder.setTitle(title)
        builder.setMessage(msg)
        builder.setPositiveButton(posBtn, dialogConfirmFun)
        externalStorageDialog = builder.create()
        externalStorageDialog.setCanceledOnTouchOutside(false)
        externalStorageDialog.show()
    }

    private val dialogConfirmFun = { dialog: DialogInterface, _: Int ->
        addHomeFragment()
        dialog.dismiss()
    }

    companion object {
        private const val PERMISSIONS_REQUEST = 100
        const val TAG = "[HomeActivity]"
    }

}