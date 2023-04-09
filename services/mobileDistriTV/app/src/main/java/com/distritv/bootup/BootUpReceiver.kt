package com.distritv.bootup

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent


class BootUpReceiver: BroadcastReceiver() {
    override fun onReceive(context: Context?, intent: Intent?) {
        context?.startForegroundService(Intent(context, BootUpService::class.java));

        if (intent?.action.equals(Intent.ACTION_BOOT_COMPLETED)) {
            val i = context!!.packageManager.getLeanbackLaunchIntentForPackage(context.packageName)
            i?.addFlags(
                Intent.FLAG_ACTIVITY_NEW_TASK or
                        Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED
            )
            context.startActivity(i)
        }
    }
}