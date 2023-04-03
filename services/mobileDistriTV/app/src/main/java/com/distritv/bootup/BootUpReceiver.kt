package com.distritv.bootup

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log


class BootUpReceiver: BroadcastReceiver() {


    override fun onReceive(context: Context?, intent: Intent?) {
        Log.v(TAG, "++++++ abriendo luego de reinicio / apagado 0 +++++")
        if (intent?.action.equals(Intent.ACTION_BOOT_COMPLETED)) {
            context?.startForegroundService(Intent(context, BootUpService::class.java));
            Log.v(TAG, "++++++ abriendo luego de reinicio / apagado 1 +++++")
            appInit(context, intent)
            Log.v(TAG, "++++++ abriendo luego de reinicio / apagado 2 +++++")
            setAlarm(context, intent)
        }
    }

    private fun appInit(context: Context?, intent: Intent?) {

        val i = context!!.packageManager.getLeanbackLaunchIntentForPackage(context.packageName)
        i?.addFlags(
            Intent.FLAG_ACTIVITY_NEW_TASK
                    or Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED
                    or Intent.FLAG_ACTIVITY_SINGLE_TOP
        )
        context.startActivity(i)

        Log.v(TAG, "++++++ abriendo luego de reinicio / apagado 3 +++++")
    }

    private fun setAlarm(context: Context?, intent: Intent?) {


        context?.startService(Intent(context, AlarmRescheduleService::class.java))


    }

    companion object {
        const val TAG = "[BootUpReceiver]"
    }
}