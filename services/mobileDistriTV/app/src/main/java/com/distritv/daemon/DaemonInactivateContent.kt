package com.distritv.daemon

import android.app.Service
import android.content.Intent
import android.os.IBinder

class DaemonInactivateContent: Service() {
    override fun onBind(intent: Intent?): IBinder? {
        return null
    }
}