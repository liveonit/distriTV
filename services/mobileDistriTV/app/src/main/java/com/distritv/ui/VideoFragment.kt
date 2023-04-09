package com.distritv.ui

import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.MediaController
import androidx.fragment.app.Fragment
import com.distritv.DistriTVApp
import com.distritv.R
import com.distritv.databinding.FragmentVideoBinding
import com.distritv.utils.CONTENT_DURATION_PARAM
import com.distritv.utils.CONTENT_PARAM
import com.distritv.utils.replaceFragment
import java.util.concurrent.TimeUnit

class VideoFragment : Fragment() {

    private var _binding: FragmentVideoBinding? = null
    private val binding get() = _binding!!

    private var localPathParam = ""
    private var durationAfterCompletion = 10L

    private val fullscreenManager by lazy {
        activity?.let {
            FullscreenManager(it.window) {
                (binding.videoContainer)
            }
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        _binding = FragmentVideoBinding.inflate(layoutInflater, container, false)

        arguments?.let {
            localPathParam = it.getString(CONTENT_PARAM, "")
            durationAfterCompletion = it.getLong(CONTENT_DURATION_PARAM, 10L)
        }
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        fullscreenManager?.enterFullscreen()
        startVideo()
    }

    private fun startVideo() {
        binding.videoContainer.setVideoPath(localPathParam)
        val mediaC = MediaController(context)
        binding.videoContainer.setMediaController(mediaC)
        mediaC.setAnchorView(binding.videoContainer)

        binding.videoContainer.start()

        binding.videoContainer.setOnCompletionListener {
            // Video is complete, after 10 seconds come back home
            Handler(Looper.getMainLooper()).postDelayed({
                (context?.applicationContext as DistriTVApp).setContentCurrentlyPlaying(false)
                activity?.supportFragmentManager?.replaceFragment(
                    R.id.home_fragment_container,
                    ImageFragment(),
                    false,
                    ImageFragment.TAG
                )
                Log.i(TAG, "Playback finished, coming home...")
            }, TimeUnit.SECONDS.toMillis(durationAfterCompletion))
        }
    }

    companion object {
        const val TAG = "[VideoFragment]"

        @JvmStatic
        fun newInstance(localPath: String, durationAfterCompletion: Long) = VideoFragment().apply {
            arguments = Bundle().apply {
                putString(CONTENT_PARAM, localPath)
                putLong(CONTENT_DURATION_PARAM, durationAfterCompletion)
            }
        }
    }

}