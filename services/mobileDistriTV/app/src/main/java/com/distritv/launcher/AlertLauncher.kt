/**
 * This component is responsible for reproducing the contents, by replacing fragments
 * or launching the HomeActivity with the corresponding fragment.
 */

package com.distritv.launcher

import android.app.Activity
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.util.Log
import com.distritv.DistriTVApp
import com.distritv.data.model.Content
import com.distritv.ui.home.HomeActivity
import com.distritv.ui.player.AlertPlayerActivity
import com.distritv.utils.*


class AlertLauncher : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {

        var content: Content? = null

        intent.setExtrasClassLoader(Content::class.java.classLoader)
        val bundle = intent.extras?.getParcelable<Bundle>(CONTENT_BUNDLE_PARAM)
        if (bundle != null) {
            content = bundle.getParcelable(CONTENT_PARAM)

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

        if (isAlertCurrentlyPlaying) {
            Log.w(TAG, "Alert is playing but new alert must override it")
            currentActivity?.finish()
        }

        // Notice that some new alert is being played
        (context.applicationContext as DistriTVApp).setIfAnyAlertIsCurrentlyPlaying(true)

        if (isContentCurrentlyPlaying) {
            Log.w(TAG, "Content is playing but new alert must override it")
            currentActivity?.finish()
            (context.applicationContext as DistriTVApp).setIfAnyContentIsCurrentlyPlaying(false)

        }

        if (currentActivity == null) {
            val homeIntent = Intent(context, HomeActivity::class.java)
            homeIntent.addFlags(
                Intent.FLAG_ACTIVITY_NEW_TASK or
                        Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED
            )
            context.startActivity(homeIntent)
        }

        val scheduledIntent = Intent(context, AlertPlayerActivity::class.java)
        scheduledIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        scheduledIntent.putExtra(CONTENT_PARAM, content)
        scheduledIntent.putExtra(IS_ALERT, true)
        context.startActivity(scheduledIntent)



        if (currentActivity != null && currentActivity is HomeActivity) {
            currentActivity.finish()
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

    companion object {
        const val TAG = "[AlertLauncher]"
    }

}