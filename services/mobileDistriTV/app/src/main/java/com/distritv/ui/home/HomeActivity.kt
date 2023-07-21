package com.distritv.ui.home

import android.Manifest
import android.annotation.SuppressLint
import android.app.Activity
import android.app.AlertDialog
import android.content.Context
import android.content.DialogInterface
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.os.PowerManager
import android.provider.Settings
import android.view.View
import android.view.WindowManager
import android.widget.RadioButton
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.distritv.DistriTVApp
import com.distritv.R
import com.distritv.daemon.ContentSchedulingDaemon
import com.distritv.daemon.GarbageCollectorDaemon
import com.distritv.daemon.RequestDaemon
import com.distritv.data.helper.StorageHelper.SDK_VERSION_FOR_MEDIA_STORE
import com.distritv.data.helper.StorageHelper.getExternalMountedStorages
import com.distritv.databinding.ActivityHomeBinding
import com.distritv.ui.home.HomeViewModel.Companion.DEVICE_INFO
import com.distritv.ui.home.HomeViewModel.Companion.HOME
import com.distritv.utils.*
import org.koin.androidx.viewmodel.ext.android.viewModel


class HomeActivity : AppCompatActivity(), DeviceInfoFragment.OnFragmentInteractionListener,
    HomeFragment.OnFragmentInteractionListener {

    private lateinit var wakeLock: PowerManager.WakeLock

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

        // So that this activity is not removed by the screen saver
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        acquireWakeLock()

        myApp = this.applicationContext as DistriTVApp

        tvCodeValidationObserver()
        referrerRequestPermissionObserver()
        addFragmentObserver()
        extStorageNotFoundObserver()

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
        wakeLock.release()
        if (::externalStorageDialog.isInitialized && externalStorageDialog.isShowing) {
            externalStorageDialog.cancel()
        }
        clearReferences()
    }

    private fun acquireWakeLock() {
        // Acquire a wake lock to wake up the device
        val powerManager = getSystemService(Context.POWER_SERVICE) as PowerManager
        wakeLock = powerManager.newWakeLock(
            PowerManager.SCREEN_BRIGHT_WAKE_LOCK or PowerManager.ACQUIRE_CAUSES_WAKEUP,
            "$this.javaClass.simpleName::WakeLock"
        )
        wakeLock.acquire(10 * 60 * 1000L /*10 minutes*/)
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
            afterPermissionGranted()
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
                afterPermissionGranted()
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

    private fun afterPermissionGranted() {
        val externalStoragePathList = getExternalMountedStorages()

        if (externalStoragePathList == null) {
            showExternalStorageNotFoundDialog()
            return
        }

        if (externalStoragePathList.size > 1) {
            selectExternalStorageDrive(externalStoragePathList)
        } else if (referrer == DEVICE_INFO) {
            viewModel.afterWriteExternalStoragePermissionGranted()
            addHomeFragment()
        } else {
            viewModel.afterWriteExternalStoragePermissionGrantedAndMoveFiles()
        }
    }



    /**
     * This function is used to choose the storage when more than one is connected
     */
    private fun selectExternalStorageDrive(externalStoragePathList: List<String>) {
        if (externalStoragePathList.size < 2) {
            return
        }

        binding.externalStorageDriveGroup.removeAllViews()

        externalStoragePathList.forEachIndexed { index, storage ->
            val radioButton = RadioButton(this)
            radioButton.id = View.generateViewId()
            radioButton.text = "USB ${index + 1}"
            binding.externalStorageDriveGroup.addView(radioButton)
        }

        binding.externalStorageDriveGroup.visibility = View.VISIBLE

        binding.externalStorageDriveGroup.setOnCheckedChangeListener { group, checkedId ->
            binding.externalStorageDriveGroup.visibility = View.GONE

            val selectedRadioButton = findViewById<RadioButton>(checkedId)
            val indexList = selectedRadioButton.text.split(" ")[1].toInt() - 1

            if (referrer == DEVICE_INFO) {
                viewModel.afterWriteExternalStoragePermissionGranted(externalStoragePathList[indexList])
                addHomeFragment()
            } else {
                viewModel.afterWriteExternalStoragePermissionGrantedAndMoveFiles(externalStoragePathList[indexList])
            }
        }
    }

    private fun extStorageNotFoundObserver() {
        viewModel.externalStorageNotFound.observe(this) {
            if (it) {
                showExternalStorageNotFoundDialog()
            }
        }
    }

    private fun showExternalStorageNotFoundDialog() {
        val dialogText = viewModel.getDialogTextExternalStorageNotFound()
        showDialog(
            dialogText.first,
            dialogText.second,
            dialogText.third,
            dialogConfirmFun
        )
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