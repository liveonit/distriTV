package com.distritv.bootup

import android.app.Activity
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log
import com.distritv.DistriTVApp
import com.distritv.R
import com.distritv.ui.home.HomeActivity
import com.distritv.ui.image.ImageFragment
import com.distritv.ui.video.VideoPlaybackFragment
import com.distritv.utils.*
import okhttp3.internal.wait
import java.lang.Thread.sleep

const val TAG = "ScheduleReceiver"
class ScheduleReceiver: BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {

        Log.v(TAG, "eetooo borad  111")


        //sleep(2000)

        if (intent?.action.equals(Intent.ACTION_BOOT_COMPLETED)) {
            Log.v(TAG, "fwwwrgthtrhj575")
            val i = context!!.packageManager.getLeanbackLaunchIntentForPackage(context.packageName)
            i?.addFlags(
                Intent.FLAG_ACTIVITY_NEW_TASK or
                        Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED
            )
            context.startActivity(i)
        }

       Log.v(TAG, "eetooo borad")
        context?.startForegroundService(Intent(context, BootUpService::class.java))


        val contentLocalPath = intent.extras?.getString(LOCAL_PATH_PARAM)
        val contentType = intent.extras?.getString(CONTENT_TYPE_PARAM)

        val currentActivity: Activity? = (context.applicationContext as DistriTVApp).getCurrentActivity()


        if(!contentLocalPath.isNullOrBlank() && !contentType.isNullOrBlank()) {


            if (currentActivity != null) {

                Log.v(TAG, "sssfrfr $currentActivity")


                if (VIDEO_TYPES.contains(contentType)) {
                    (currentActivity as HomeActivity).supportFragmentManager.replaceFragment(
                        R.id.home_fragment_container,
                        VideoPlaybackFragment.newInstance(contentLocalPath),
                        true,
                        VideoPlaybackFragment.TAG
                    )
                } else if (IMAGE_TYPES.contains(contentType)) {
                    (currentActivity as HomeActivity).supportFragmentManager.replaceFragment(
                        R.id.home_fragment_container,
                        ImageFragment.newInstance(contentLocalPath),
                        true,
                        ImageFragment.TAG
                    )
                }


            } else {
                Log.d(TAG, "------------ Alarm just fired -- $contentLocalPath")


                val scheduledIntent = Intent(context, HomeActivity::class.java)
                // val i = context!!.packageManager.getLeanbackLaunchIntentForPackage(context.packageName)
                // scheduledIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                scheduledIntent.addFlags(
                    Intent.FLAG_ACTIVITY_NEW_TASK or
                            Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED
                )
                scheduledIntent.putExtra(LOCAL_PATH_PARAM, contentLocalPath)

                Log.d(TAG, "------------ Alarm just fired -- $contentType")

                if (VIDEO_TYPES.contains(contentType)) {
                    scheduledIntent.putExtra(CONTENT_TYPE_PARAM, VIDEO)
                } else if (IMAGE_TYPES.contains(contentType)) {
                    scheduledIntent.putExtra(CONTENT_TYPE_PARAM, IMAGE)
                }


                context.startActivity(scheduledIntent)
            }
        }


        Log.d(TAG, "------------ Alarm just fired 2222222")
    }

}