package com.distritv.bootup

import android.app.Activity
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log
import com.distritv.DistriTVApp
import com.distritv.R
import com.distritv.data.service.AlarmService
import com.distritv.ui.home.HomeActivity
import com.distritv.ui.image.ImageFragment
import com.distritv.ui.video.VideoPlaybackFragment
import com.distritv.utils.*
import org.koin.java.KoinJavaComponent.inject


class ScheduleReceiver(): BroadcastReceiver() {


    override fun onReceive(context: Context, intent: Intent) {

        Log.v(TAG, "eetooo borad  111")


        val contentLocalPath = intent.extras?.getString(LOCAL_PATH_PARAM)
        val contentType = intent.extras?.getString(CONTENT_TYPE_PARAM)

        val currentActivity: Activity? = (context.applicationContext as DistriTVApp).getCurrentActivity()

        if (contentLocalPath.isNullOrBlank() || contentType.isNullOrBlank()) {
            return
        }



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


        Log.d(TAG, "------------ Alarm just fired 2222222")
    }

    companion object {
        const val TAG = "[ScheduleReceiver]"
    }

}