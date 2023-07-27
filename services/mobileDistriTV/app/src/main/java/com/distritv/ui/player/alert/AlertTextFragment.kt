package com.distritv.ui.player.alert

import android.graphics.Color
import android.os.Bundle
import android.os.CountDownTimer
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.distritv.BuildConfig
import com.distritv.data.helper.PlaybackHelper.removePausedAlert
import com.distritv.data.helper.PlaybackHelper.setPausedAlert
import com.distritv.data.model.Alert
import com.distritv.databinding.FragmentTextBinding
import com.distritv.ui.FullscreenManager
import com.distritv.utils.*
import java.util.concurrent.TimeUnit

class AlertTextFragment : Fragment() {

    private var _binding: FragmentTextBinding? = null
    private val binding get() = _binding!!

    private lateinit var timer: CountDownTimer

    private var alert: Alert? = null

    private val fullscreenManager by lazy {
        activity?.let {
            FullscreenManager(it.window) {
                (binding.textContainer)
            }
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        _binding = FragmentTextBinding.inflate(layoutInflater, container, false)
        arguments?.let {
            alert = it.getParcelable(ALERT_PARAM)
            if (alert == null) {
                Log.e(TAG, "An error occurred while trying to play, back to home...")
                onAfterCompletionAlert(TAG)
            }
        }

        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        fullscreenManager?.enterFullscreen()
    }

    override fun onResume() {
        super.onResume()
        showText()
    }

    override fun onPause() {
        super.onPause()
        this.cancelPlay()
        timer.cancel()
        if (alert != null && alert!!.durationLeft > 0L) {
            setPausedAlert(alert!!)
        } else {
            removePausedAlert()
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        timer.cancel()
    }

    private fun showText() {
        binding.textContainer.text = alert?.text ?: ""
        setDecoration()

        Log.i(TAG, "Alert with id [${alert?.id}] has started!")

        timer = object : CountDownTimer(
            TimeUnit.SECONDS.toMillis(alert?.durationLeft!!),
            TimeUnit.SECONDS.toMillis(1)
        ) {
            override fun onTick(millisUntilFinished: Long) {
                // Code to run every second
                val durationLeft = millisUntilFinished / TimeUnit.SECONDS.toMillis(1)
                Log.d(TAG, "Timer: $durationLeft seconds remaining")
                setAlertDurationLeft(durationLeft)
                alert?.durationLeft = durationLeft
            }

            override fun onFinish() {
                // Code to run after the timer finishes
                Log.i(TAG, "Alert with id [${alert?.id}] has finished!")
                onAfterCompletionAlert(TAG, alert?.id)
            }
        }.start()

    }

    private fun setDecoration() {
        val textColor: String = BuildConfig.ALERT_TEXT_COLOR
        val backgroundColor: String = BuildConfig.ALERT_BACKGROUND_COLOR
        if (isHexColorCode(textColor)) {
            binding.textContainer.setTextColor(Color.parseColor(textColor))
        } else {
            binding.textContainer.setTextColor(Color.parseColor(TEXT_COLOR_DEFAULT))
        }
        if (isHexColorCode(backgroundColor)) {
            binding.textContainer.setBackgroundColor(Color.parseColor(backgroundColor))
        } else {
            binding.textContainer.setBackgroundColor(Color.parseColor(TEXT_BACKGROUND_COLOR_DEFAULT))
        }
    }

    companion object {
        const val TAG = "[AlertTextFragment]"

        @JvmStatic
        fun newInstance(alert: Alert) = AlertTextFragment().apply {
            arguments = Bundle().apply {
                putParcelable(ALERT_PARAM, alert)
            }
        }

    }

}