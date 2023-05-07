package com.distritv.ui.home

import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.inputmethod.InputMethodManager
import androidx.core.widget.doOnTextChanged
import androidx.fragment.app.Fragment
import com.distritv.databinding.FragmentDeviceInfoBinding


class DeviceInfoFragment : Fragment() {
    private var _binding: FragmentDeviceInfoBinding? = null
    private val binding get() = _binding!!
    private var listener: OnFragmentInteractionListener? = null

    private lateinit var homeActivityViewModel: HomeViewModel

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        _binding = FragmentDeviceInfoBinding.inflate(layoutInflater, container, false)

        binding.tvCode.onFocusChangeListener = View.OnFocusChangeListener { view, hasFocus ->
            if (!hasFocus) {
                val inputMethodManager = context?.getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
                inputMethodManager.hideSoftInputFromWindow(view.windowToken, 0)
            }
        }

        homeActivityViewModel = (requireActivity() as HomeActivity).viewModel

        setEventToClearError()

        progressBarObserver()
        tvCodeValidationObserver()

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
            listener?.onRegisterButtonPressed(binding.tvCode.text.toString())
            binding.tvCode.clearFocus()
        }
    }

    private fun setEventToClearError() {
        binding.tvCode.doOnTextChanged { _, _, _, _ ->
            binding.tvCodeLayoutContainer.error = null
        }
    }

    private fun progressBarObserver() {
        homeActivityViewModel.loading.observe(viewLifecycleOwner) { visible ->
            binding.progressBar.visibility = if (visible) View.VISIBLE else View.GONE
        }
    }

    private fun tvCodeValidationObserver() {
        homeActivityViewModel.isValid.observe(this) { isValid ->
            if (!isValid) {
                binding.tvCodeLayoutContainer.error = MSG_TV_CODE_INVALID
            }
        }
    }

    override fun onDetach() {
        super.onDetach()
        listener = null
    }

    interface OnFragmentInteractionListener {
        fun onRegisterButtonPressed(code: String)
    }

    companion object {
        const val TAG = "[DeviceInfoFragment]"
        private const val MSG_TV_CODE_INVALID = "El código ingresado no es válido"
    }


}