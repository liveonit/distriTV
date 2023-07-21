package com.distritv.ui.player.content

import android.net.Uri
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import com.distritv.R
import com.distritv.data.helper.PlaybackHelper.setPausedContent
import com.distritv.data.helper.StorageHelper.getCurrentDirectory
import com.distritv.data.model.Content
import com.distritv.data.model.PausedContent
import com.distritv.databinding.FragmentVideoBinding
import com.distritv.ui.FullscreenManager
import com.distritv.utils.*
import com.google.android.exoplayer2.*
import com.google.android.exoplayer2.extractor.DefaultExtractorsFactory
import com.google.android.exoplayer2.extractor.ExtractorsFactory
import com.google.android.exoplayer2.source.ExtractorMediaSource
import com.google.android.exoplayer2.source.MediaSource
import com.google.android.exoplayer2.source.TrackGroupArray
import com.google.android.exoplayer2.trackselection.AdaptiveTrackSelection
import com.google.android.exoplayer2.trackselection.DefaultTrackSelector
import com.google.android.exoplayer2.trackselection.TrackSelectionArray
import com.google.android.exoplayer2.trackselection.TrackSelector
import com.google.android.exoplayer2.upstream.BandwidthMeter
import com.google.android.exoplayer2.upstream.DefaultBandwidthMeter
import com.google.android.exoplayer2.upstream.DefaultDataSourceFactory
import com.google.android.exoplayer2.util.Util
import org.koin.androidx.viewmodel.ext.android.viewModel
import java.io.File
import java.time.LocalDateTime

class VideoFragment : Fragment() {

    private var _binding: FragmentVideoBinding? = null
    private val binding get() = _binding!!

    private val viewModel by viewModel<ContentPlayerViewModel>()

    private val handler = Handler(Looper.getMainLooper())

    private var content: Content? = null
    private var playStartDate: Long = -1

    private var videoFinished = false

    var exoPlayer: SimpleExoPlayer? = null

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
                onAfterCompletionContent(TAG)
            }
            playStartDate = it.getLong(CONTENT_PLAY_START_DATE_PARAM)
        }

        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        fullscreenManager?.enterFullscreen()
    }

    override fun onResume() {
        super.onResume()

        if (videoFinished) {
            backHomeOnResume()
        } else {
            removeAllCallbacksAndMessagesFromHandler()
            startVideo()
        }
    }

    override fun onPause() {
        super.onPause()
        exoPlayer?.release()
        if (!videoFinished) {
            setPausedContent(
                PausedContent(
                    content!!,
                    playStartDate
                )
            )
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        exoPlayer?.release()
        removeAllCallbacksAndMessagesFromHandler()
    }

    private fun startVideo() {
        val file = File(context?.getCurrentDirectory() ?: "", content?.fileName ?: "")

        if (!file.exists()) {
            Log.e(TAG, "An error occurred while trying to play. Check storage. Back to home...")
            Toast.makeText(context, getString(R.string.msg_unavailable_content), Toast.LENGTH_LONG)
                .show()
            onAfterCompletionContent(TAG, content?.id)
            return
        }

        val initTime = getInitTime()

        setExoPlayer(file, initTime)

        Log.i(TAG, "Playback started. Content id: ${content?.id}")
    }

    private fun getInitTime(): Long {
        val currentTime = localDateTimeToMillis(LocalDateTime.now()) ?: 0L
        if (playStartDate <= 0) {
            playStartDate = currentTime
        }

        return currentTime - playStartDate
    }

    private fun setExoPlayer(file: File, initTime: Long) {
        try {
            val bandwidthMeter: BandwidthMeter = DefaultBandwidthMeter()

            val trackSelector: TrackSelector =
                DefaultTrackSelector(AdaptiveTrackSelection.Factory(bandwidthMeter))

            exoPlayer =
                ExoPlayerFactory.newSimpleInstance(activity!!.applicationContext, trackSelector)

            val videoUri = Uri.parse(file.toURI().toString())

            val dataSourceFactory = DefaultDataSourceFactory(
                activity!!.applicationContext,
                Util.getUserAgent(activity!!.applicationContext, "DistriTV")
            )

            val extractorsFactory: ExtractorsFactory = DefaultExtractorsFactory()

            val mediaSource: MediaSource =
                ExtractorMediaSource(videoUri, dataSourceFactory, extractorsFactory, null, null)

            binding.videoContainer.player = exoPlayer

            if (initTime > 0) {
                exoPlayer!!.seekTo(initTime)
            }

            exoPlayer!!.prepare(mediaSource)

            addPlayerListener()

            exoPlayer!!.playWhenReady = true

        } catch (e: Exception) {
            Log.e(TAG, "Error : $e")
        }
    }

    private fun addPlayerListener() {
        exoPlayer?.addListener(object : ExoPlayer.EventListener {
            override fun onPlayerStateChanged(playWhenReady: Boolean, playbackState: Int) {
                when (playbackState) {
                    ExoPlayer.STATE_ENDED -> {
                        videoFinished = true
                        content?.let { viewModel.playOnceContentAlreadyStarted(it) }
                        onAfterCompletionContent(TAG, content?.id)
                    }
                    ExoPlayer.STATE_READY -> {
                        content?.durationInSeconds =
                            java.util.concurrent.TimeUnit.MILLISECONDS.toSeconds(exoPlayer!!.duration)
                        handler.postDelayed({
                            content?.let { viewModel.playOnceContentAlreadyStarted(it) }
                            onAfterCompletionContent(TAG, content?.id)
                        }, (localDateTimeToMillis(LocalDateTime.now()) ?: 0L)
                                    - playStartDate + exoPlayer!!.duration)
                    }
                    else -> {}
                }
            }

            override fun onTracksChanged(
                trackGroups: TrackGroupArray?,
                trackSelections: TrackSelectionArray?
            ) {
            }

            override fun onTimelineChanged(timeline: Timeline?, manifest: Any?) {}
            override fun onLoadingChanged(isLoading: Boolean) {}
            override fun onPlayerError(error: ExoPlaybackException?) {}
            override fun onPositionDiscontinuity() {}
            override fun onPlaybackParametersChanged(playbackParameters: PlaybackParameters?) {}
        })
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
        fun newInstance(content: Content, playStartDate: Long) = VideoFragment().apply {
            arguments = Bundle().apply {
                putParcelable(CONTENT_PARAM, content)
                putLong(CONTENT_PLAY_START_DATE_PARAM, playStartDate)
            }
        }
    }

}