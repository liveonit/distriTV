package com.distritv.ui.video

import android.content.Context
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.MediaController
import com.distritv.databinding.FragmentVideoPlaybackBinding
import com.distritv.ui.FullscreenManager
import org.koin.androidx.viewmodel.ext.android.viewModel

/**
 * A simple [Fragment] subclass.
 * Use the [VideoPlaybackFragment.newInstance] factory method to
 * create an instance of this fragment.
 */
class VideoPlaybackFragment : Fragment() {


    private var _binding: FragmentVideoPlaybackBinding? = null
    private val binding get() = _binding!!

    private var listener: OnFragmentInteractionListener? = null

    private val viewModel by viewModel<VideoPlaybackViewModel>()

    private val fullscreenManager by lazy {
        activity?.let {
            FullscreenManager(it.window) {
                (binding.videoContainer)
            }
        }
    }


    var path = ""

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        _binding = FragmentVideoPlaybackBinding.inflate(layoutInflater, container, false)
        return binding.root
    }



    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        viewModel.videoPath.observe(viewLifecycleOwner) {
            path = it
        }

        viewModel.fetchVideoPath()

        //setupHelpButton()
        //setupStartButton()
    }

    override fun onResume() {
        super.onResume()

        fullscreenManager?.enterFullscreen()
        startVideo()
    }

    private fun startVideo() {
        //val path = "/mnt/sdcard/Movies/ejemplo.mp4"
        // path = "/mnt/sdcard/Movies/ejemplo.mp4"
        binding.videoContainer.setVideoPath(path)

        // val videoUri = "android.resource://" + packageName + "/" + R.raw.ejemplo
        //val uri = Uri.parse(videoUri)

        // videoView.setVideoURI(uri)

        val mediaC = MediaController(context)

        binding.videoContainer.setMediaController(mediaC)
        mediaC.setAnchorView(binding.videoContainer)

        binding.videoContainer.start()
    }

    override fun onAttach(context: Context) {
        super.onAttach(context)
        if (context is OnFragmentInteractionListener) {
            listener = context


        } else {
            throw ClassCastException("Must implement VideoPlaybackFragment.OnFragmentInteractionListener")
        }
    }

    /*
    private fun setupStartButton() {
        binding.startButton.setOnClickListener {
            listener?.onStartButtonPressed()
        }
    }

    private fun setupHelpButton() {
        binding.helpButton.setOnClickListener {
            listener?.onHelpButtonPressed(1)
        }
    }
    */


    override fun onDetach() {
        super.onDetach()
        listener = null
    }

    interface OnFragmentInteractionListener {
        fun onHelpButtonPressed(exampleParam: Int)
        fun onStartButtonPressed()
    }

    companion object {
        const val TAG = "VideoPlaybackFragment"
    }
}