package com.distritv.ui

import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.distritv.databinding.FragmentDeviceInfoBinding
import com.distritv.databinding.FragmentTextBinding
import com.distritv.utils.CONTENT_DURATION_PARAM
import com.distritv.utils.CONTENT_PARAM


class DeviceInfoFragment : Fragment() {
    private var _binding: FragmentDeviceInfoBinding? = null
    private val binding get() = _binding!!
    private var listener: OnFragmentInteractionListener? = null

    /*
    private val fullscreenManager by lazy {
        activity?.let {
            FullscreenManager(it.window) {
                (binding.textContainer)
            }
        }
    }*/

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        _binding = FragmentDeviceInfoBinding.inflate(layoutInflater, container, false)

        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        //fullscreenManager?.enterFullscreen()
        setupStartButton()

    }

    override fun onAttach(context: Context) {
        super.onAttach(context)
        if (context is OnFragmentInteractionListener) {
            listener = context
        } else {
            throw ClassCastException("Must implement HomeFragment.OnFragmentInteractionListener")
        }
    }

    private fun setupStartButton() {
        binding.buttonId.setOnClickListener {
            listener?.onStartButtonPressed(binding.deviceId.text.toString())
        }
    }

    override fun onDetach() {
        super.onDetach()
        listener = null
    }
    interface OnFragmentInteractionListener {
        fun onStartButtonPressed(id: String)
    }

    companion object {
        const val TAG = "DeviceInfoFragment"
    }


}