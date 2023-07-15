package com.distritv.ui.player.alert

import android.os.Bundle
import android.os.CountDownTimer
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
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
        println("fragm onCreateView")
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
        println("fragm viewcreated")
        showText()
    }

    override fun onResume() {
        super.onResume()
        println("fragm onResume")
       // backHomeOnResumeAlert()
    }

    override fun onPause() {
        super.onPause()
        println("textFrag onPause")
        this.cancelPlay()
        timer.cancel()
      //  activity?.finish()
    }

    override fun onDestroy() {
        super.onDestroy()
        println("textFrag onDestroy")
       // timer.cancel()
    }

    private fun showText() {
        binding.textContainer.text = alert?.text ?: ""

        Log.i(TAG, "Alert with id [${alert?.id}] has started!")

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
        const val TAG = "[AlertTextFragment]"

        @JvmStatic
        fun newInstance(alert: Alert) = AlertTextFragment().apply {
            arguments = Bundle().apply {
                putParcelable(ALERT_PARAM, alert)
            }
        }

    }

}