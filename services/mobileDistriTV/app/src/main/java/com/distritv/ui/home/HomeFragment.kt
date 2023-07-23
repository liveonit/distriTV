package com.distritv.ui.home


import android.app.AlertDialog
import android.content.Context
import android.content.DialogInterface
import android.content.res.ColorStateList
import android.graphics.Color
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import com.distritv.R
import com.distritv.databinding.FragmentHomeBinding
import com.distritv.ui.FullscreenManager
import com.distritv.utils.*
import org.koin.androidx.viewmodel.ext.android.viewModel
import java.util.concurrent.TimeUnit


class HomeFragment: Fragment() {

    private var _binding: FragmentHomeBinding? = null
    private val binding get() = _binding!!

    private var listener: OnFragmentInteractionListener? = null

    private val viewModel by viewModel<HomeViewModel>()

    var infoBtnVisible = false

    private val handler = Handler(Looper.getMainLooper())

    private lateinit var languages: Array<String>
    private lateinit var anticipationDaysOptions: Array<String>
    private lateinit var languageSpinnerAdapter: ArrayAdapter<String>
    private lateinit var anticipationDaysSpinnerAdapter: ArrayAdapter<String>

    private var anticipationDaysConfigEnabled = false

    private lateinit var externalStorageDialog: AlertDialog
    private var dialogTitle: String? = null
    private var dialogMessage: String? = null
    private var dialogAccept: String? = null
    private var dialogCancel: String? = null

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
        deviceInfoObserver()
        languageUpdatedObserver()
        setLanguageSpinnerSelection()
        setAnticipationDaysSpinnerSelection()

        viewModel.setLocale()

        switchButtonListener()

        setupInformationButton()

        binding.informationBtn.requestFocus()
    }

    override fun onAttach(context: Context) {
        super.onAttach(context)
        if (context is OnFragmentInteractionListener) {
            listener = context
        } else {
            throw ClassCastException("Must implement HomeFragment.OnFragmentInteractionListener")
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        handler.removeCallbacksAndMessages(null)
        if (::externalStorageDialog.isInitialized && externalStorageDialog.isShowing) {
            externalStorageDialog.cancel()
        }
    }

    private fun loadImage() {
        binding.imageContainer.setImageResource(R.drawable.home_wallpaper)
    }

    private fun deviceInfoObserver() {
        viewModel.deviceInfo.observe(this) { deviceInfoCard ->
            binding.versionValue.text = deviceInfoCard.currentVersionApp
            binding.tvCodeValue.text = deviceInfoCard.tvCode
            addLabels()
            addStatus(deviceInfoCard.connectionStatus)
            languageSpinner()
            anticipationDaysSpinner()
            setLanguageSpinnerSelection()
            setAnticipationDaysSpinnerSelection()
            setSwitchExternalStorageVisibility()
        }
    }

    private fun setupInformationButton() {
        infoBtnVisible = false
        binding.informationBtn.setOnClickListener {
            showOrHideInfoCard()
        }
    }

    private fun showOrHideInfoCard() {
        if (!infoBtnVisible) {
            showInformationAndSettings()
        } else {
            hideInformationAndSettings()
        }
    }

    private fun showInformationAndSettings() {
        viewModel.getDeviceInfo()
        binding.informationCard.visibility = View.VISIBLE
        binding.informationBtn.setImageDrawable(
            ContextCompat.getDrawable(requireContext(), R.drawable.close_100)
        )
        infoBtnVisible = true

        // Set timer to close information card
        handler.postDelayed({
            showOrHideInfoCard()
        }, TimeUnit.SECONDS.toMillis(30))
    }

    private fun hideInformationAndSettings() {
        binding.informationCard.visibility = View.GONE
        binding.informationBtn.setImageDrawable(
            ContextCompat.getDrawable(requireContext(), R.drawable.info_100)
        )
        infoBtnVisible = false

        // Remove timer to close information card
        handler.removeCallbacksAndMessages(null)
    }

    private fun addStatus(status: Boolean?) {
        binding.connectionStatusValue.removeAllViews()
        if (status == null) {
            val progressBar = ProgressBar(context)
            progressBar.layoutParams = LinearLayout.LayoutParams(CIRCLE_SIZE, CIRCLE_SIZE)
            progressBar.indeterminateTintList = ColorStateList.valueOf(Color.BLACK)

            binding.connectionStatusValue.addView(progressBar)
        } else {
            val imageView = ImageView(context)
            imageView.layoutParams = LinearLayout.LayoutParams(CIRCLE_SIZE, CIRCLE_SIZE)

            if (status) {
                imageView.background =
                    ContextCompat.getDrawable(requireContext(), R.drawable.circle_shape_green)
            } else {
                imageView.background =
                    ContextCompat.getDrawable(requireContext(), R.drawable.circle_shape_red)
            }

            binding.connectionStatusValue.addView(imageView)
        }
    }

    private fun addLabels() {
        val labelNameList = viewModel.getLabelNameList()
        if (labelNameList.isEmpty()) {
            binding.labelsContainer.visibility = View.GONE
        } else {
            binding.labelsContainer.visibility = View.VISIBLE
            // Two labels per line
            binding.labelsValue.text =
                labelNameList.chunked(2).joinToString("\n") { pair -> pair.joinToString(", ") }
        }
    }

    private fun languageUpdatedObserver() {
        viewModel.languageUpdated.observe(viewLifecycleOwner) { langUpdated ->
            if (!langUpdated) {
                return@observe
            }
            binding.versionKey.text = context?.applicationContext?.getString(R.string.info_card_version)
            binding.tvCodeKey.text = context?.applicationContext?.getString(R.string.info_card_tv_code)
            binding.labelsKey.text = context?.applicationContext?.getString(R.string.info_card_labels)
            binding.connectionStatusKey.text = context?.applicationContext?.getString(R.string.info_card_connection_status)
            binding.languageKey.text = context?.applicationContext?.getString(R.string.language)
            binding.languageSpinner.prompt = context?.applicationContext?.getString(R.string.language_select)
            binding.switchExternalStorage.text = context?.applicationContext?.getString(R.string.info_card_switch_external)
            binding.anticipationDaysKey.text = context?.applicationContext?.getString(R.string.info_card_anticipation_days)
            binding.anticipationDaysSpinner.prompt = context?.applicationContext?.getString(R.string.info_card_anticipation_spinner_title)
        }
    }

    private fun languageSpinner() {
        languages = viewModel.getLanguages()
        languageSpinnerAdapter = createSpinnerAdapter(languages)
        binding.languageSpinner.adapter = languageSpinnerAdapter
        languageSpinnerListener()
    }

    private fun anticipationDaysSpinner() {
        if (viewModel.getAnticipationDaysOptions() == null) {
            binding.anticipationDaysContainer.visibility = View.GONE
            anticipationDaysConfigEnabled = false
        } else {
            binding.anticipationDaysContainer.visibility = View.VISIBLE
            anticipationDaysConfigEnabled = true

            anticipationDaysOptions = viewModel.getAnticipationDaysOptions()!!
            anticipationDaysSpinnerAdapter = createSpinnerAdapter(anticipationDaysOptions)
            binding.anticipationDaysSpinner.adapter = anticipationDaysSpinnerAdapter
            anticipationDaysSpinnerListener()
        }
    }

    private fun createSpinnerAdapter(options: Array<String>): ArrayAdapter<String> {
        val spinnerAdapter = ArrayAdapter(context!!, R.layout.spinner_item, options)
        spinnerAdapter.setDropDownViewResource(android.R.layout.select_dialog_singlechoice)
        return spinnerAdapter
    }

    private fun languageSpinnerListener() {
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
                    viewModel.changeLocale(selectedLanguage)

                    updateSpinnerItems()
                }
            }
    }

    private fun anticipationDaysSpinnerListener() {
        binding.anticipationDaysSpinner.onItemSelectedListener =
            object : AdapterView.OnItemSelectedListener {
                override fun onNothingSelected(parent: AdapterView<*>?) {
                }

                override fun onItemSelected(
                    parent: AdapterView<*>?,
                    view: View?,
                    position: Int,
                    id: Long
                ) {
                    try {
                        val selectedItem = parent!!.getItemIdAtPosition(position)
                        val days = anticipationDaysOptions[selectedItem.toInt()].split(ANTICIPATION_DAYS_WHITESPACE)[0]
                        viewModel.setCurrentAnticipationDays(days.toInt())
                    } catch (e: Exception) {
                        Log.e(TAG, "[anticipationDaysSpinnerListener] -> ${e.javaClass}: ${e.message}")
                    }
                }
            }
    }

    private fun updateSpinnerItems() {
        var auxPosition = 0
        viewModel.getLanguages().forEach { lang ->
            languages[auxPosition] = lang
            auxPosition++
        }
        languageSpinnerAdapter.notifyDataSetChanged()

        if (anticipationDaysConfigEnabled) {
            auxPosition = 0
            viewModel.getAnticipationDaysOptions()?.forEach { option ->
                anticipationDaysOptions[auxPosition] = option
                auxPosition++
            }
            anticipationDaysSpinnerAdapter.notifyDataSetChanged()
        }
    }

    private fun setLanguageSpinnerSelection() {
        when (viewModel.getCurrentLocale()) {
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

    private fun setAnticipationDaysSpinnerSelection() {
        val options = viewModel.getAnticipationDaysOptions()
        if (options != null) {
            val current = viewModel.getCurrentAnticipationDays()
            val itemSelected = options.map { it.split(ANTICIPATION_DAYS_WHITESPACE)[0] }
                .indexOf(current.toString())
            binding.anticipationDaysSpinner.setSelection(itemSelected)
        }
    }

    private fun setSwitchExternalStorageVisibility() {
        if (viewModel.isExternalStorageEnabled()) {
            binding.switchExternalStorage.isChecked = viewModel.useExternalStorage()
            binding.switchExternalStorage.visibility = View.VISIBLE
        } else {
            binding.switchExternalStorage.visibility = View.GONE
        }
    }

    private fun switchButtonListener() {
        binding.switchExternalStorage.setOnClickListener {
            dialogAccept = context?.applicationContext?.getString(R.string.dialog_accept)
            dialogCancel = context?.applicationContext?.getString(R.string.dialog_cancel)
            if (binding.switchExternalStorage.isChecked) {
                dialogTitle = context?.applicationContext?.getString(R.string.dialog_title_to_external)
                dialogMessage = context?.applicationContext?.getString(R.string.dialog_message_home_to_external)
            } else {
                dialogTitle = context?.applicationContext?.getString(R.string.dialog_title_to_internal)
                dialogMessage = context?.applicationContext?.getString(R.string.dialog_message_home_to_internal)
            }

            if (binding.switchExternalStorage.isChecked) {
                showDialog(dialogConfirmExternalFun)
            } else {
                showDialog(dialogConfirmInternalFun)
            }
        }
    }

    private fun showDialog(dialogConfirmFun: (dialog: DialogInterface, _: Int) -> Unit) {
        val builder = AlertDialog.Builder(context)
        builder.setTitle(dialogTitle)
        builder.setMessage(dialogMessage)
        builder.setPositiveButton(dialogAccept, dialogConfirmFun)
        builder.setNegativeButton(dialogCancel, dialogCancelFun)
        externalStorageDialog = builder.create()
        externalStorageDialog.setCanceledOnTouchOutside(false)
        externalStorageDialog.show()
    }


    private val dialogConfirmExternalFun = { dialog: DialogInterface, _: Int ->
        listener?.onChangeStorage(true)
        hideInformationAndSettings()
        dialog.dismiss()
    }

    private val dialogConfirmInternalFun = { dialog: DialogInterface, _: Int ->
        listener?.onChangeStorage(false)
        hideInformationAndSettings()
        dialog.dismiss()
    }

    private val dialogCancelFun = { dialog: DialogInterface, _: Int ->
        binding.switchExternalStorage.isChecked = viewModel.useExternalStorage()
        dialog.cancel()
    }

    interface OnFragmentInteractionListener {
        fun onChangeStorage(useExternalStorage: Boolean)
    }

    companion object {
        const val TAG = "[HomeFragment]"
        private const val CIRCLE_SIZE = 40
    }

}