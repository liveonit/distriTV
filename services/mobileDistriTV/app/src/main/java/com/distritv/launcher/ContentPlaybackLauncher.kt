/**
 * This component is responsible for reproducing the contents, by replacing fragments
 * or launching the HomeActivity with the corresponding fragment.
 */

package com.distritv.launcher

import android.app.Activity
import android.app.AlarmManager
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import com.distritv.DistriTVApp
import com.distritv.R
import com.distritv.data.helper.ErrorHelper.saveError
import com.distritv.data.model.Content
import com.distritv.ui.home.HomeActivity
import com.distritv.ui.player.content.ContentPlayerActivity
import com.distritv.utils.*
import com.distritv.data.helper.StorageHelper.getCurrentDirectory


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

        val isAlertCurrentlyPlaying: Boolean =
            (context.applicationContext as DistriTVApp).isAlertCurrentlyPlaying()

        if (content == null || !contentIsValid(content)) {
            return
        }

        if (isContentCurrentlyPlaying || isAlertCurrentlyPlaying) {
            Log.w(TAG, "Cannot be played because other content or alert is currently playing")
            if (isAlarm != null && isAlarm) {
                cancelAlarm(context, content)
            }
            return
        }

        if (!content.fileExists(context.getCurrentDirectory())) {
            val msgError = "Content file not found. Content id: ${content.id}, name: ${content.fileName}"
            saveError(javaClass.name, msgError)
            Log.e(TAG, msgError)
            Toast.makeText(
                context, context.getString(R.string.msg_unavailable_content),
                Toast.LENGTH_LONG
            ).show()
            return
        }

        if (currentActivity == null) {
            val homeIntent = Intent(context, HomeActivity::class.java)
            homeIntent.addFlags(
                Intent.FLAG_ACTIVITY_NEW_TASK
                        or Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED
                        or Intent.FLAG_ACTIVITY_CLEAR_TOP
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
        (context.applicationContext as DistriTVApp).setIfAnyContentIsCurrentlyPlaying(true)

        if (isAlarm != null && isAlarm) {
            cancelAlarm(context, content)
        }
    }

    private fun contentIsValid(content: Content?): Boolean {
        if (content == null) return false
        if (content.type.isBlank()) return false
        if (content.isVideo() || content.isImage()) {
            return !content.fileName.isNullOrBlank()
        } else if (content.isText()) {
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