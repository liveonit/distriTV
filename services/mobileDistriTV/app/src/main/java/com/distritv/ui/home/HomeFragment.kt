package com.distritv.ui.home

import android.annotation.SuppressLint
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.distritv.R
import com.distritv.databinding.FragmentHomeBinding
import com.distritv.ui.FullscreenManager
import org.koin.androidx.viewmodel.ext.android.viewModel

class HomeFragment: Fragment() {

    private var _binding: FragmentHomeBinding? = null
    private val binding get() = _binding!!

    private val viewModel by viewModel<HomeViewModel>()

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
        _binding = FragmentHomeBinding.inflate(layoutInflater, container, false)

        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        fullscreenManager?.enterFullscreen()
        loadImage()
        tvCodeDisplayObserver()
        getTvCode()
    }

    private fun loadImage() {
        binding.imageContainer.setImageResource(R.drawable.home_wallpaper)
    }

    @SuppressLint("SetTextI18n")
    private fun tvCodeDisplayObserver() {
        viewModel.tvCode.observe(this) { tvCode ->
            binding.idInformationDisplay.text = "Id: $tvCode"
        }
    }

    private fun getTvCode() {
        viewModel.getTvCode()
    }

    companion object {
        const val TAG = "[HomeFragment]"
    }

}