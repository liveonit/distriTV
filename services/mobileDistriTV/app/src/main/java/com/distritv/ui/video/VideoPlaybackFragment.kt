package com.distritv.ui.video

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.MediaController
import com.distritv.databinding.FragmentVideoPlaybackBinding
import com.distritv.ui.FullscreenManager
import com.distritv.utils.LOCAL_PATH_PARAM

class VideoPlaybackFragment : Fragment() {

    private var _binding: FragmentVideoPlaybackBinding? = null
    private val binding get() = _binding!!

    private var localPathParam = ""

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
        _binding = FragmentVideoPlaybackBinding.inflate(layoutInflater, container, false)

        arguments?.let {
            localPathParam = it.getString(LOCAL_PATH_PARAM, "")
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
    }

    companion object {
        const val TAG = "VideoPlaybackFragment"

        @JvmStatic
        fun newInstance(localPath: String) = VideoPlaybackFragment().apply {
            arguments = Bundle().apply {
                putString(LOCAL_PATH_PARAM, localPath)
            }
        }
    }

}