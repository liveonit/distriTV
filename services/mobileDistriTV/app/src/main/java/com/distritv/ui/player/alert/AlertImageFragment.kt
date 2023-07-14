package com.distritv.ui.player.alert

import android.os.Bundle
import android.os.CountDownTimer
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import coil.load
import com.distritv.data.model.Alert
import com.distritv.databinding.FragmentImageBinding
import com.distritv.ui.FullscreenManager
import com.distritv.utils.*
import java.util.concurrent.TimeUnit


class AlertImageFragment : Fragment() {

    private var _binding: FragmentImageBinding? = null
    private val binding get() = _binding!!

    private var alert: Alert? = null

    private lateinit var timer: CountDownTimer

    private val fullscreenManager by lazy {
        activity?.let {
            FullscreenManager(it.window) {
                (binding.imageContainer)
            }
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        _binding = FragmentImageBinding.inflate(layoutInflater, container, false)

        arguments?.let {
            alert = it.getParcelable(ALERT_PARAM)
            if (alert == null) {
                Log.e(TAG, "An error occurred while trying to play, back to home...")
                onAfterCompletionContent(TAG)
            }
        }

        loadImage()

        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        fullscreenManager?.enterFullscreen()
    }

    override fun onResume() {
        super.onResume()
        backHomeOnResumeAlert()
    }

    override fun onPause() {
        super.onPause()
        timer.cancel()
    }

    override fun onDestroy() {
        super.onDestroy()
        timer.cancel()
    }

    private fun loadImage() {
        binding.imageContainer.load(alert?.getURL())

        Log.i(TAG, "Alert with id [${alert?.id}] has started!")

        // Create and start the timer
        timer = object : CountDownTimer(
            TimeUnit.SECONDS.toMillis(alert?.durationLeft!!),
            TimeUnit.SECONDS.toMillis(1)
        ) {
            override fun onTick(millisUntilFinished: Long) {
                // Code to run every second
                val durationLeft = millisUntilFinished / TimeUnit.SECONDS.toMillis(1)
                Log.v(TAG, "Timer: $durationLeft seconds remaining")
                setAlertDurationLeft(durationLeft)
            }

            override fun onFinish() {
                // Code to run after the timer finishes
                Log.i(TAG, "Alert with id [${alert?.id}] has finished!")
                onAfterCompletionAlert(TAG, alert?.id)
            }
        }.start()
    }

    companion object {

        const val TAG = "[AlertImageFragment]"

        @JvmStatic
        fun newInstance(alert: Alert) = AlertImageFragment().apply {
            arguments = Bundle().apply {
                putParcelable(ALERT_PARAM, alert)
            }
        }
    }

}