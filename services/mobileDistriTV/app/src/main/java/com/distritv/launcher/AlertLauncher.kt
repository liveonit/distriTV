/**
 * This component is responsible for reproducing the alert, by replacing fragments
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
import com.distritv.data.model.Alert
import com.distritv.data.model.Content
import com.distritv.ui.home.HomeActivity
import com.distritv.ui.player.alert.AlertPlayerActivity
import com.distritv.utils.*


class AlertLauncher : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {

        var alert: Alert? = null

        intent.setExtrasClassLoader(Content::class.java.classLoader)
        val bundle = intent.extras?.getParcelable<Bundle>(ALERT_BUNDLE_PARAM)
        if (bundle != null) {
            alert = bundle.getParcelable(ALERT_PARAM)

        }

        val currentActivity: Activity? =
            (context.applicationContext as DistriTVApp).getCurrentActivity()

        val isContentCurrentlyPlaying: Boolean =
            (context.applicationContext as DistriTVApp).isContentCurrentlyPlaying()

        val isAlertCurrentlyPlaying: Boolean =
            (context.applicationContext as DistriTVApp).isAlertCurrentlyPlaying()

        if (alert == null || !alertIsValid(alert)) {
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
                Intent.FLAG_ACTIVITY_NEW_TASK
                        or Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED
                        or Intent.FLAG_ACTIVITY_CLEAR_TOP
            )
            context.startActivity(homeIntent)
        }

        val alertIntent = Intent(context, AlertPlayerActivity::class.java)
        alertIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        alertIntent.putExtra(ALERT_PARAM, alert)
        context.startActivity(alertIntent)



        if (currentActivity != null && currentActivity is HomeActivity) {
            currentActivity.finish()
        }

    }

    private fun alertIsValid(alert: Alert?): Boolean {
        if (alert == null) return false
        if (alert.type.isBlank()) return false
        if (alert.isImage()) {
            return alert.url.isNotBlank()
        } else if (alert.isText()) {
            return alert.text.isNotBlank()
        }
        return false
    }

    companion object {
        const val TAG = "[AlertLauncher]"
    }

}