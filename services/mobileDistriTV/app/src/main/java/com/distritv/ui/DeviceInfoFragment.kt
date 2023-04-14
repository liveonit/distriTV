package com.distritv.ui

import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.inputmethod.InputMethodManager
import androidx.fragment.app.Fragment
import com.distritv.databinding.FragmentDeviceInfoBinding


class DeviceInfoFragment : Fragment() {
    private var _binding: FragmentDeviceInfoBinding? = null
    private val binding get() = _binding!!
    private var listener: OnFragmentInteractionListener? = null

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        _binding = FragmentDeviceInfoBinding.inflate(layoutInflater, container, false)

        binding.deviceId.onFocusChangeListener = View.OnFocusChangeListener { view, hasFocus ->
            if (!hasFocus) {
                val inputMethodManager = context?.getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
                inputMethodManager.hideSoftInputFromWindow(view.windowToken, 0)
            }
        }

        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setupRegisterButton()
    }

    override fun onAttach(context: Context) {
        super.onAttach(context)
        if (context is OnFragmentInteractionListener) {
            listener = context
        } else {
            throw ClassCastException("Must implement HomeFragment.OnFragmentInteractionListener")
        }
    }

    private fun setupRegisterButton() {
        binding.registerButton.setOnClickListener {
            listener?.onRegisterButtonPressed(binding.deviceId.text.toString())
            binding.deviceId.clearFocus()
        }
    }

    override fun onDetach() {
        super.onDetach()
        listener = null
    }
    interface OnFragmentInteractionListener {
        fun onRegisterButtonPressed(id: String)
    }

    companion object {
        const val TAG = "[DeviceInfoFragment]"
    }


}