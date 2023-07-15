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
        println("--33")
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

        val currentlyPlayingAlertId: Long? =
            (context.applicationContext as DistriTVApp).getCurrentlyPlayingAlertId()
        println("--46 -- $alert sss ${alert == getAlertBlank()} fgg ${!alertIsValid(alert)}")

        if(alert != null && alert == getAlertBlank()){
            println("49")
            // Cancel current alert
            currentActivity?.finish()
            (context.applicationContext as DistriTVApp).setSkip(null)
            startHomeActivity(context)
            return
        }

        if (alert == null || !alertIsValid(alert)) {
            println("--56")
            return
        }

        println("--50")
        if (isAlertCurrentlyPlaying) {
            println("--52")
            if (currentlyPlayingAlertId != null && currentlyPlayingAlertId != alert.id) {
                Log.w(TAG, "Alert is playing but new alert must override it")
                (context.applicationContext as DistriTVApp).setSkip(true)
                currentActivity?.finish()
            } else {
                return
            }
        }
        println("--66")
        if (isContentCurrentlyPlaying) {
            println("--68")
            Log.w(TAG, "Content is playing but new alert must override it")
            // Notice that the content playback has finished:
            (context.applicationContext as DistriTVApp).setIfAnyContentIsCurrentlyPlaying(false)
            // Clear the identifier of the content that was playing:
            (context.applicationContext as DistriTVApp).setCurrentlyPlayingContentId(null)
            currentActivity?.finish()
        }
        println("--76")
        if (currentActivity == null) {
            startHomeActivity(context)
        }
        println("--86")
        if (currentActivity != null) {
        //if (currentActivity != null && currentActivity is HomeActivity) {
            println("--88")
            currentActivity.finish()
        }
        println("--91")
        val alertIntent = Intent(context, AlertPlayerActivity::class.java)
        alertIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        alertIntent.putExtra(ALERT_PARAM, alert)
        context.startActivity(alertIntent)

        println("--97")
        // Notice that some new alert is being played
       // (context.applicationContext as DistriTVApp).setIfAnyAlertIsCurrentlyPlaying(true)

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
        context.startActivity(homeIntent)
    }

    companion object {
        const val TAG = "[AlertLauncher]"
    }

}