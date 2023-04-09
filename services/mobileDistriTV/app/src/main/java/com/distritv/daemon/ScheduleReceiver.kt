package com.distritv.daemon

import android.app.Activity
import android.app.AlarmManager
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import com.distritv.DistriTVApp
import com.distritv.R
import com.distritv.ui.HomeActivity
import com.distritv.ui.ImageFragment
import com.distritv.ui.VideoPlaybackFragment
import com.distritv.utils.*


class ScheduleReceiver() : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {

        val contentParam = intent.extras?.getString(CONTENT_PARAM)
        val contentType = intent.extras?.getString(CONTENT_TYPE_PARAM)
        val contentId = intent.extras?.getInt(CONTENT_ID_PARAM)
        val contentDuration = intent.extras?.getLong(CONTENT_DURATION_PARAM) ?: -1L
        val isAlarm = intent.extras?.getBoolean(IS_ALARM_PARAM)

        val currentActivity: Activity? =
            (context.applicationContext as DistriTVApp).getCurrentActivity()

        if (contentParam.isNullOrBlank() || contentType.isNullOrBlank() || contentId == null) {
            return
        }

        if (currentActivity != null) {

            if (VIDEO_TYPES.contains(contentType)) {
                (currentActivity as HomeActivity).supportFragmentManager.replaceFragment(
                    R.id.home_fragment_container,
                    VideoPlaybackFragment.newInstance(contentParam),
                    true,
                    VideoPlaybackFragment.TAG
                )
            } else if (IMAGE_TYPES.contains(contentType)) {
                (currentActivity as HomeActivity).supportFragmentManager.replaceFragment(
                    R.id.home_fragment_container,
                    ImageFragment.newInstance(contentParam, contentDuration),
                    true,
                    ImageFragment.TAG
                )
            }

        } else {

            val scheduledIntent = Intent(context, HomeActivity::class.java)

            scheduledIntent.addFlags(
                Intent.FLAG_ACTIVITY_NEW_TASK or
                        Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED
            )

            scheduledIntent.putExtra(CONTENT_PARAM, contentParam)

            if (VIDEO_TYPES.contains(contentType)) {
                scheduledIntent.putExtra(CONTENT_TYPE_PARAM, VIDEO)
            } else if (IMAGE_TYPES.contains(contentType)) {
                scheduledIntent.putExtra(CONTENT_TYPE_PARAM, IMAGE)
            }

            context.startActivity(scheduledIntent)
        }

        if (isAlarm != null && isAlarm) {
            cancelAlarm(context, contentParam, contentType, contentDuration, contentId.toInt())
        }

    }

    private fun cancelAlarm(context: Context, contentParam: String, contentType: String, contentDuration: Long, reqCode: Int) {
        val pendingIntent = createPendingIntent(context, contentParam, contentType, contentDuration, reqCode)

        val alarmManager =
            context.getSystemService(Context.ALARM_SERVICE) as? AlarmManager

        if (alarmManager != null) {
            pendingIntent.cancel()
            alarmManager.cancel(pendingIntent)
        }
    }

    companion object {
        const val TAG = "[ScheduleReceiver]"
    }

}