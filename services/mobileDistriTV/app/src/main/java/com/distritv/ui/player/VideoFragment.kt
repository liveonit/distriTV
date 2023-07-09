package com.distritv.ui.player

import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.MediaController
import android.widget.Toast
import androidx.fragment.app.Fragment
import com.distritv.DistriTVApp
import com.distritv.R
import com.distritv.data.model.Content
import com.distritv.databinding.FragmentVideoBinding
import com.distritv.ui.FullscreenManager
import com.distritv.ui.player.CustomVideoView.PlayPauseListener
import com.distritv.utils.*
import com.distritv.data.helper.StorageHelper.getDirectory
import java.io.File
import java.time.LocalDateTime
import java.util.concurrent.TimeUnit

class VideoFragment : Fragment() {

    private var _binding: FragmentVideoBinding? = null
    private val binding get() = _binding!!

    private val handler = Handler(Looper.getMainLooper())

    private var content: Content? = null

    private var videoDuration: Int = 0
    private var pausePosition: Long = 0L
    private var pauseTime: Long = 0L

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
            content = it.getParcelable(CONTENT_PARAM)
            if (content == null) {
                Log.e(TAG, "An error occurred while trying to play, back to home...")
                onAfterCompletion(TAG)
            }
        }

        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        fullscreenManager?.enterFullscreen()
        startVideo()
    }

    override fun onResume() {
        super.onResume()

        removeAllCallbacksAndMessagesFromHandler()

        val currentTime = localDateTimeToMillis(LocalDateTime.now()) ?: 0L
        val resumePosition = pausePosition.plus(currentTime.minus(pauseTime))

        // After fragment pause
        if (pausePosition > 0 && pauseTime > 0 && videoDuration > 0) {
            if (resumePosition < videoDuration) {
                binding.videoContainer.seekTo(resumePosition.toInt())
                binding.videoContainer.start()
            } else {
                backHomeOnResume()
            }
        }
    }

    override fun onPause() {
        super.onPause()

        val isPlaying =
            (context?.applicationContext as DistriTVApp?)?.isContentCurrentlyPlaying() ?: false

        if (isPlaying) {
            removeAllCallbacksAndMessagesFromHandler()
            binding.videoContainer.pause()
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        removeAllCallbacksAndMessagesFromHandler()
    }

    private fun startVideo() {
        val file = File(content?.fileName ?: "")

        if (!file.exists()) {
            Log.e(TAG, "An error occurred while trying to play. Check storage. Back to home...")
            Toast.makeText(context, getString(R.string.msg_unavailable_content), Toast.LENGTH_LONG)
                .show()
            onAfterCompletion(TAG, content?.id)
        }

        val path = File(context?.getDirectory() ?: "", content?.fileName ?: "").toURI().toString()
        binding.videoContainer.setVideoPath(path)

        val mediaC = MediaController(context)
        binding.videoContainer.setMediaController(mediaC)
        mediaC.setAnchorView(binding.videoContainer)

        binding.videoContainer.setOnCompletionListener {
            handler.postDelayed({
                onAfterCompletion(TAG, content?.id)
            }, TimeUnit.SECONDS.toMillis(content?.durationInSeconds ?: 0))
        }

        binding.videoContainer.setPlayPauseListener(object : PlayPauseListener {
            override fun onPlay() {
                Log.i(TAG, "Play!")
                removeAllCallbacksAndMessagesFromHandler()
            }

            override fun onPause() {
                Log.i(TAG, "Pause!")
                removeAllCallbacksAndMessagesFromHandler()
                addPostHandlerWhenVideoIsPaused(
                    binding.videoContainer.duration,
                    binding.videoContainer.currentPosition
                )
            }
        })

        binding.videoContainer.start()

        Log.i(TAG, "Playback started. Content id: ${content?.id}")
    }

    private fun addPostHandlerWhenVideoIsPaused(duration: Int, currentPosition: Int) {
        videoDuration = duration
        pausePosition = currentPosition.toLong()
        pauseTime = localDateTimeToMillis(LocalDateTime.now()) ?: 0L

        val remainingTime = duration - currentPosition

        handler.postDelayed({
            Log.i(TAG, "Ending video while paused")
            onAfterCompletion(TAG, content?.id)
        }, remainingTime.toLong())
    }

    /**
     * Remove all pending posts of callbacks and sent messages.
     */
    private fun removeAllCallbacksAndMessagesFromHandler() {
        handler.removeCallbacksAndMessages(null)
    }

    companion object {
        const val TAG = "[VideoFragment]"

        @JvmStatic
        fun newInstance(content: Content) = VideoFragment().apply {
            arguments = Bundle().apply {
                putParcelable(CONTENT_PARAM, content)
            }
        }
    }

}