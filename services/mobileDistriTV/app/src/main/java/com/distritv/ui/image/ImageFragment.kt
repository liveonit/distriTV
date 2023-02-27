package com.distritv.ui.image

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import com.distritv.databinding.FragmentImageBinding
import com.distritv.ui.FullscreenManager
import com.distritv.utils.LOCAL_PATH_PARAM
import org.koin.androidx.viewmodel.ext.android.viewModel


class ImageFragment : Fragment() {

    private var _binding: FragmentImageBinding? = null
    private val binding get() = _binding!!

    private val viewModel by viewModel<ImageViewModel>()

    private var localPathParam = ""

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
            localPathParam = it.getString(LOCAL_PATH_PARAM, "")
        }

        loadImageObserver()

        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        fullscreenManager?.enterFullscreen()
        viewModel.fetchImage(localPathParam)
    }

    private fun loadImageObserver() {
        viewModel.image.observe(viewLifecycleOwner) {
            if (it != null) {
                binding.imageContainer.setImageBitmap(it)
            } else {
                Toast.makeText(activity, "There is no content available.", Toast.LENGTH_SHORT).show()
            }
        }
    }

    companion object {
        const val TAG = "ImageFragment"

        @JvmStatic
        fun newInstance(localPath: String) = ImageFragment().apply {
            arguments = Bundle().apply {
                putString(LOCAL_PATH_PARAM, localPath)
            }
        }
    }

}