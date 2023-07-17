package com.distritv.ui.player.content

import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.distritv.data.model.Content
import com.distritv.databinding.FragmentTextBinding
import com.distritv.ui.FullscreenManager
import com.distritv.utils.*
import org.koin.androidx.viewmodel.ext.android.viewModel
import java.util.concurrent.TimeUnit

class TextFragment : Fragment() {

    private var _binding: FragmentTextBinding? = null
    private val binding get() = _binding!!

    private val viewModel by viewModel<ContentPlayerViewModel>()

    private val handler = Handler(Looper.getMainLooper())

    private var content: Content? = null

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

    override fun onDestroy() {
        super.onDestroy()
        removeAllCallbacksAndMessagesFromHandler()
    }

    private fun showText() {
        binding.textContainer.text = content?.text ?: ""
        content?.let { viewModel.playOnceContentAlreadyStarted(it) }
        Log.i(TAG, "Playback started. Content id: ${content?.id}")
        handler.postDelayed({
            onAfterCompletionContent(TAG, content?.id)
        }, TimeUnit.SECONDS.toMillis(content?.durationInSeconds ?: 0))
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
        fun newInstance(content: Content) = TextFragment().apply {
            arguments = Bundle().apply {
                putParcelable(CONTENT_PARAM, content)
            }
        }

    }

}