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
import com.distritv.data.helper.PlaybackHelper.existPausedContent
import com.distritv.data.helper.PlaybackHelper.removePausedContent
import com.distritv.data.model.Alert
import com.distritv.data.model.Content
import com.distritv.ui.home.HomeActivity
import com.distritv.ui.player.alert.AlertPlayerActivity
import com.distritv.ui.player.content.ContentPlayerActivity
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

        val alertWasPausedOrDestroyed: Boolean =
            (context.applicationContext as DistriTVApp).alertWasPausedOrDestroyed()

        if (alert != null && alert == getAlertBlank()) {
            // Cancel current alert
            currentActivity?.finish()
            (context.applicationContext as DistriTVApp).setSkipClearing(null)
            startHomeActivity(context)
            return
        }

        if (alert == null || !alertIsValid(alert)) {
            return
        }

        // Alert is new or paused or destroyed
        if ((isAlertCurrentlyPlaying && !alert.started) || alertWasPausedOrDestroyed) {
            Log.w(TAG, "Alert is playing but new alert must override it")
            (context.applicationContext as DistriTVApp).setSkipClearing(true)
            currentActivity?.finish()
        } else if (isAlertCurrentlyPlaying) {
            return
        }

        if (isContentCurrentlyPlaying) {
            Log.w(TAG, "Content is playing but new alert must override it")
            // Notice that the content playback has finished:
            (context.applicationContext as DistriTVApp).setIfAnyContentIsCurrentlyPlaying(false)
            // Clear the identifier of the content that was playing:
            (context.applicationContext as DistriTVApp).setCurrentlyPlayingContentId(null)
            currentActivity?.finish()
        }

        if (currentActivity != null
            && (currentActivity is HomeActivity || currentActivity is ContentPlayerActivity)) {
            currentActivity.finish()
        }

        removeContentIfPaused()

        if (currentActivity == null) {
            startHomeActivity(context)
        }

        val alertIntent = Intent(context, AlertPlayerActivity::class.java)
        alertIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        alertIntent.putExtra(ALERT_PARAM, alert)
        context.startActivity(alertIntent)
    }

    private fun alertIsValid(alert: Alert?): Boolean {
        if (alert == null) return false
        return alert.text.isNotBlank()
    }

    private fun startHomeActivity(context: Context) {
        val homeIntent = Intent(context, HomeActivity::class.java)
        homeIntent.addFlags(
            Intent.FLAG_ACTIVITY_NEW_TASK
                    or Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED
                    or Intent.FLAG_ACTIVITY_CLEAR_TOP
        )
        homeIntent.putExtra(ALERT_PARAM, true)
        context.startActivity(homeIntent)
    }

    private fun removeContentIfPaused() {
        if (existPausedContent()) {
            removePausedContent()
        }
    }

    companion object {
        const val TAG = "[AlertLauncher]"
    }

}