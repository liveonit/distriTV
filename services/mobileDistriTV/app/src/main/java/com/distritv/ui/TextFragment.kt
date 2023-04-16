package com.distritv.ui

import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.distritv.databinding.FragmentTextBinding
import com.distritv.utils.*
import java.util.concurrent.TimeUnit

class TextFragment : Fragment() {

    private var _binding: FragmentTextBinding? = null
    private val binding get() = _binding!!

    private var textParam = ""
    private var contentDuration = 0L

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
            textParam = it.getString(CONTENT_PARAM, "")
            contentDuration = it.getLong(CONTENT_DURATION_PARAM, 0L)
        }
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        fullscreenManager?.enterFullscreen()
        showText()
    }

    override fun onResume() {
        super.onResume()
        backHomeOnResume()
    }

    private fun showText() {
        binding.textContainer.text = textParam
        Log.i(TAG, "Playback started.")

        Handler(Looper.getMainLooper()).postDelayed({
            onAfterCompletion(TAG)
        }, TimeUnit.SECONDS.toMillis(contentDuration))
    }

    companion object {
        const val TAG = "[TextFragment]"

        @JvmStatic
        fun newInstance(text: String, duration: Long) = TextFragment().apply {
            arguments = Bundle().apply {
                putString(CONTENT_PARAM, text)
                putLong(CONTENT_DURATION_PARAM, duration)
            }
        }
    }

}