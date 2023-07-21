package com.distritv.ui.player.content

import android.graphics.Color
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.distritv.BuildConfig
import com.distritv.data.helper.PlaybackHelper.setPausedContent
import com.distritv.data.model.Content
import com.distritv.data.model.PausedContent
import com.distritv.databinding.FragmentTextBinding
import com.distritv.ui.FullscreenManager
import com.distritv.utils.*
import org.koin.androidx.viewmodel.ext.android.viewModel
import java.time.LocalDateTime
import java.util.concurrent.TimeUnit

class TextFragment : Fragment() {

    private var _binding: FragmentTextBinding? = null
    private val binding get() = _binding!!

    private val viewModel by viewModel<ContentPlayerViewModel>()

    private val handler = Handler(Looper.getMainLooper())

    private var content: Content? = null
    private var playStartDate: Long = -1

    private var finish = false

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
            content = it.getParcelable(CONTENT_PARAM)
            if (content == null) {
                Log.e(TAG, "An error occurred while trying to play, back to home...")
                onAfterCompletionContent(TAG)
            }
            playStartDate = it.getLong(CONTENT_PLAY_START_DATE_PARAM)
        }

        removeAllCallbacksAndMessagesFromHandler()

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

    override fun onPause() {
        super.onPause()
        if (!finish) {
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
        removeAllCallbacksAndMessagesFromHandler()
    }

    private fun showText() {
        binding.textContainer.text = content?.text ?: ""
        setDecoration()

        Log.i(TAG, "Playback started. Content id: ${content?.id}")

        val currentTime = localDateTimeToMillis(LocalDateTime.now()) ?: 0L
        if (playStartDate <= 0) {
            playStartDate = currentTime
        }

        val durationInMillis = (playStartDate + TimeUnit.SECONDS.toMillis(content!!.durationInSeconds)) - currentTime

        handler.postDelayed({
            finish = true
            content?.let { viewModel.playOnceContentAlreadyStarted(it) }
            onAfterCompletionContent(TAG, content?.id)
        }, durationInMillis)
    }

    private fun setDecoration() {
        val textColor: String = BuildConfig.TEXT_CONTENT_COLOR
        val backgroundColor: String = BuildConfig.TEXT_CONTENT_BACKGROUND_COLOR
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

    /**
     * Remove all pending posts of callbacks and sent messages.
     */
    private fun removeAllCallbacksAndMessagesFromHandler() {
        handler.removeCallbacksAndMessages(null)
    }

    companion object {
        const val TAG = "[TextFragment]"

        @JvmStatic
        fun newInstance(content: Content, playStartDate: Long) = TextFragment().apply {
            arguments = Bundle().apply {
                putParcelable(CONTENT_PARAM, content)
                putLong(CONTENT_PLAY_START_DATE_PARAM, playStartDate)
            }
        }

    }

}