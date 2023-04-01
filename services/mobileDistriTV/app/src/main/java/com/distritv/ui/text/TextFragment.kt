package com.distritv.ui.text

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.distritv.databinding.FragmentTextBinding
import com.distritv.ui.FullscreenManager
import com.distritv.utils.LOCAL_PATH_PARAM
import com.distritv.utils.TEXT_PARAM

class TextFragment:Fragment() {

    private var _binding: FragmentTextBinding? = null
    private val binding get() = _binding!!

    private var textParam = ""

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
            textParam = it.getString(TEXT_PARAM, "")
        }
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        fullscreenManager?.enterFullscreen()
        showText()
    }

    private fun showText() {
        binding.textContainer.text = textParam
    }

    companion object {
        const val TAG = "TextFragment"

        @JvmStatic
        fun newInstance(text: String) = TextFragment().apply {
            arguments = Bundle().apply {
                putString(TEXT_PARAM, text)
            }
        }
    }

}