package com.distritv.ui

import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import com.distritv.DistriTVApp
import com.distritv.R
import com.distritv.databinding.FragmentImageBinding
import com.distritv.utils.CONTENT_DURATION_PARAM
import com.distritv.utils.CONTENT_PARAM
import com.distritv.utils.replaceFragment
import org.koin.androidx.viewmodel.ext.android.viewModel
import java.util.concurrent.TimeUnit


class ImageFragment : Fragment() {

    private var _binding: FragmentImageBinding? = null
    private val binding get() = _binding!!

    private val viewModel by viewModel<ImageViewModel>()

    private var localPathParam = ""
    private var contentDuration = -1L

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
            localPathParam = it.getString(CONTENT_PARAM, "")
            contentDuration = it.getLong(CONTENT_DURATION_PARAM, -1L)
        }

        loadImageObserver()

        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        fullscreenManager?.enterFullscreen()

        if (localPathParam.isNotBlank()) {
            viewModel.fetchImage(localPathParam)
        } else {
            binding.imageContainer.setImageResource(R.drawable.home_wallpaper)
        }
    }

    private fun loadImageObserver() {
        viewModel.image.observe(viewLifecycleOwner) {
            if (it != null) {
                binding.imageContainer.setImageBitmap(it)

                // Back home after end of the duration
                Handler(Looper.getMainLooper()).postDelayed({
                    (context?.applicationContext as DistriTVApp).setContentCurrentlyPlaying(false)
                    activity?.supportFragmentManager?.replaceFragment(
                        R.id.home_fragment_container,
                        ImageFragment(),
                        false,
                        ImageFragment.TAG
                    )
                    Log.i(TAG, "Playback finished, coming home...")
                }, TimeUnit.SECONDS.toMillis(contentDuration))
            } else {
                Log.e(TAG, "No image available.")
                Toast.makeText(activity, "There is no content available.", Toast.LENGTH_SHORT).show()
            }
        }
    }

    companion object {
        const val TAG = "[ImageFragment]"

        @JvmStatic
        fun newInstance(localPath: String, duration: Long) = ImageFragment().apply {
            arguments = Bundle().apply {
                putString(CONTENT_PARAM, localPath)
                putLong(CONTENT_DURATION_PARAM, duration)
            }
        }
    }

}