/**
 * This component is responsible for reproducing the contents, by replacing fragments
 * or launching the HomeActivity with the corresponding fragment.
 */

package com.distritv.daemon

import android.app.Activity
import android.app.AlarmManager
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.util.Log
import com.distritv.DistriTVApp
import com.distritv.data.model.Content
import com.distritv.ui.home.HomeActivity
import com.distritv.ui.player.ContentPlayerActivity
import com.distritv.utils.*


class ContentPlaybackLauncher : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {

        var content: Content? = null
        var isAlarm: Boolean? = null

        intent.setExtrasClassLoader(Content::class.java.classLoader)
        val bundle = intent.extras?.getParcelable<Bundle>(CONTENT_BUNDLE_PARAM)
        if (bundle != null) {
            content = bundle.getParcelable(CONTENT_PARAM)
            isAlarm = bundle.getBoolean(IS_ALARM_PARAM)
        }

        val currentActivity: Activity? =
            (context.applicationContext as DistriTVApp).getCurrentActivity()

        val isContentCurrentlyPlaying: Boolean =
            (context.applicationContext as DistriTVApp).isContentCurrentlyPlaying()

        if (content == null || !contentIsValid(content)) {
            return
        }

        if (isContentCurrentlyPlaying) {
            Log.w(TAG, "Cannot be played because other content is currently playing")
            if (isAlarm != null && isAlarm) {
                cancelAlarm(context, content)
            }
            return
        }

        if (currentActivity == null) {
            val homeIntent = Intent(context, HomeActivity::class.java)
            homeIntent.addFlags(
                Intent.FLAG_ACTIVITY_NEW_TASK or
                        Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED
            )
            context.startActivity(homeIntent)
        }

        val scheduledIntent = Intent(context, ContentPlayerActivity::class.java)
        scheduledIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        scheduledIntent.putExtra(CONTENT_PARAM, content)
        context.startActivity(scheduledIntent)

        if (currentActivity != null && currentActivity is HomeActivity) {
            currentActivity.finish()
        }

        // Notice that some content is being played
        (context.applicationContext as DistriTVApp).setContentCurrentlyPlaying(true)

        if (isAlarm != null && isAlarm) {
            cancelAlarm(context, content)
        }
    }

    private fun contentIsValid(content: Content?): Boolean {
        if (content == null) return false
        if (content.type.isBlank()) return false
        if (isVideo(content.type) || isImage(content.type)) {
            return !content.localPath.isNullOrBlank()
        } else if (isText(content.type)) {
            return !content.text.isNullOrBlank()
        }
        return false
    }

    private fun cancelAlarm(context: Context, content: Content) {
        val reqCode = content.id.toInt()
        val pendingIntent = createPendingIntent(context, content, reqCode)

        val alarmManager =
            context.getSystemService(Context.ALARM_SERVICE) as? AlarmManager

        if (alarmManager != null) {
            pendingIntent.cancel()
            alarmManager.cancel(pendingIntent)
        }
    }

    companion object {
        const val TAG = "[ContentPlaybackLauncher]"
    }

}