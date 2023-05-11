/**
 * Start app after device boot.
 */

package com.distritv.afterBoot

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import com.distritv.ui.home.HomeActivity


class StarterReceiver: BroadcastReceiver() {

    override fun onReceive(context: Context?, intent: Intent?) {
        if (intent?.action.equals(Intent.ACTION_BOOT_COMPLETED)) {
            startHomeActivity(context)
        }
    }

    private fun startHomeActivity(context: Context?) {
        val intent = Intent(context, HomeActivity::class.java)
        intent.addFlags(
            Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                    or Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED or Intent.FLAG_ACTIVITY_SINGLE_TOP
        )
        context?.startActivity(intent)
    }

    companion object {
        const val TAG = "[StarterReceiver]"
    }
}