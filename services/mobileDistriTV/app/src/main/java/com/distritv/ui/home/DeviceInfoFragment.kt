package com.distritv.ui.home

import android.app.AlertDialog
import android.content.Context
import android.content.DialogInterface
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.inputmethod.InputMethodManager
import android.widget.AdapterView
import android.widget.ArrayAdapter
import androidx.core.widget.doOnTextChanged
import androidx.fragment.app.Fragment
import com.distritv.BuildConfig
import com.distritv.R
import com.distritv.databinding.FragmentDeviceInfoBinding
import com.distritv.ui.home.HomeViewModel.Companion.DEVICE_INFO
import com.distritv.utils.*


class DeviceInfoFragment : Fragment() {
    private var _binding: FragmentDeviceInfoBinding? = null
    private val binding get() = _binding!!
    private var listener: OnFragmentInteractionListener? = null

    private val externalStorageEnabled: Boolean = BuildConfig.EXTERNAL_STORAGE_ENABLED

    private var dialogTitle = ""
    private var dialogMessage = ""
    private var dialogAccept = ""
    private var dialogCancel = ""

    private lateinit var homeActivityViewModel: HomeViewModel

    private lateinit var languages: Array<String>

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

        localeObserver()
        languageUpdatedObserver()
        setEventToClearError()
        progressBarObserver()
        tvCodeValidationObserver()
        languageSpinner()

        switchButtonListener()

        homeActivityViewModel.setLocale()

        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setSwitchExternalStorageVisibility()
        setupRegisterButton()
    }

    override fun onAttach(context: Context) {
        super.onAttach(context)
        if (context is OnFragmentInteractionListener) {
            listener = context
        } else {
            throw ClassCastException("Must implement DeviceInfoFragment.OnFragmentInteractionListener")
        }
    }

    override fun onDetach() {
        super.onDetach()
        listener = null
    }

    private fun setupRegisterButton() {
        binding.registerButton.setOnClickListener {
            listener?.onRegisterButtonPressed(binding.tvCode.text.toString(), binding.switchExternalStorage.isChecked)
            binding.tvCode.clearFocus()
        }
    }

    private fun setEventToClearError() {
        binding.tvCode.doOnTextChanged { _, _, _, _ ->
            binding.tvCodeLayoutContainer.error = null
        }
    }

    private fun languageSpinner() {
        languages = homeActivityViewModel.getLanguages()
        val spinnerAdapter = languageSpinnerAdapter()
        binding.languageSpinner.adapter = spinnerAdapter
        languageSpinnerListener(spinnerAdapter)
    }

    private fun languageSpinnerAdapter(): ArrayAdapter<String> {
        val spinnerAdapter = ArrayAdapter(context!!, android.R.layout.simple_spinner_item, languages)
        spinnerAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        return spinnerAdapter
    }

    private fun languageSpinnerListener(spinnerAdapter: ArrayAdapter<String>) {
        binding.languageSpinner.onItemSelectedListener =
            object : AdapterView.OnItemSelectedListener {
                override fun onNothingSelected(parent: AdapterView<*>?) {
                }

                override fun onItemSelected(
                    parent: AdapterView<*>?,
                    view: View?,
                    position: Int,
                    id: Long
                ) {
                    // Change locale
                    val selectedLanguage = parent!!.getItemIdAtPosition(position)
                    homeActivityViewModel.changeLocale(DEVICE_INFO, selectedLanguage)

                    updateErrorMessageLanguage()
                    updateLanguageItems(spinnerAdapter)
                }
            }
    }

    /**
     * If an error message is being displayed: update the language
     */
    private fun updateErrorMessageLanguage() {
        if (binding.tvCodeLayoutContainer.error != null) {
            binding.tvCodeLayoutContainer.error =
                homeActivityViewModel.getErrorMessage()
        }
    }

    private fun updateLanguageItems(spinnerAdapter: ArrayAdapter<String>) {
        var auxPosition = 0
        homeActivityViewModel.getLanguages().forEach { lang ->
            languages[auxPosition] = lang
            auxPosition++
        }
        spinnerAdapter.notifyDataSetChanged()
    }

    private fun localeObserver() {
        homeActivityViewModel.locale.observe(viewLifecycleOwner) { locale ->
            when (locale) {
                EN_LANG -> {
                    binding.languageSpinner.setSelection(ENGLISH_POS)
                }
                ES_LANG -> {
                    binding.languageSpinner.setSelection(SPANISH_POS)
                }
                else -> {
                    binding.languageSpinner.setSelection(AUTOMATIC_POS)
                }
            }
        }
    }

    private fun languageUpdatedObserver() {
        homeActivityViewModel.languageUpdated.observe(viewLifecycleOwner) { langUpdated ->
            if (!langUpdated) {
                return@observe
            }
            binding.title.text = context?.applicationContext?.getString(R.string.device_info_title)
            binding.registerButton.text = context?.applicationContext?.getString(R.string.device_info_register_button)
            binding.switchExternalStorage.text = context?.applicationContext?.getString(R.string.device_info_switch_external)
            dialogTitle = context?.applicationContext?.getString(R.string.dialog_title_to_external)
                ?: getString(R.string.dialog_title_to_external)
            dialogMessage = context?.applicationContext?.getString(R.string.dialog_message_to_external)
                ?: getString(R.string.dialog_message_to_external)
            dialogAccept = context?.applicationContext?.getString(R.string.dialog_accept)
                ?: getString(R.string.dialog_accept)
            dialogCancel = context?.applicationContext?.getString(R.string.dialog_cancel)
                ?: getString(R.string.dialog_cancel)
        }
    }

    private fun progressBarObserver() {
        homeActivityViewModel.loading.observe(viewLifecycleOwner) { visible ->
            binding.progressBar.visibility = if (visible) View.VISIBLE else View.GONE
            binding.registerButton.isEnabled = !visible
            binding.tvCode.isEnabled = !visible
            binding.languageSpinner.isEnabled = !visible
            binding.switchExternalStorage.isEnabled = !visible
        }
    }

    private fun tvCodeValidationObserver() {
        homeActivityViewModel.isValid.observe(this) { isValid ->
            if (!isValid) {
                binding.tvCodeLayoutContainer.error = homeActivityViewModel.errorMessage.value
            }
        }
    }

    private fun setSwitchExternalStorageVisibility() {
        if (externalStorageEnabled) {
            binding.switchExternalStorage.visibility = View.VISIBLE
        } else {
            binding.switchExternalStorage.visibility = View.INVISIBLE
        }
    }

    private fun switchButtonListener() {
        binding.switchExternalStorage.setOnCheckedChangeListener { _, isChecked ->
            if (isChecked) {
                showDialog()
            } else {
                homeActivityViewModel.setExternalStorage(false)
            }
        }
    }

    private fun showDialog() {
        val builder = AlertDialog.Builder(context)
        builder.setTitle(dialogTitle)
        builder.setMessage(dialogMessage)
        builder.setPositiveButton(dialogAccept, dialogConfirmFun)
        builder.setNegativeButton(dialogCancel, dialogCancelFun)
        val externalStorageDialog = builder.create()
        externalStorageDialog.setCanceledOnTouchOutside(false)
        externalStorageDialog.show()
    }

    private val dialogConfirmFun = { dialog: DialogInterface, _: Int ->
        dialog.dismiss()
    }

    private val dialogCancelFun = { dialog: DialogInterface, _: Int ->
        binding.switchExternalStorage.isChecked = false
        dialog.cancel()
    }

    interface OnFragmentInteractionListener {
        fun onRegisterButtonPressed(code: String, useExternalStorage: Boolean)
    }

    companion object {
        const val TAG = "[DeviceInfoFragment]"
    }


}