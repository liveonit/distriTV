package com.distritv.ui.home


import android.content.res.ColorStateList
import android.graphics.Color
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import com.distritv.R
import com.distritv.databinding.FragmentHomeBinding
import com.distritv.ui.FullscreenManager
import com.distritv.ui.home.HomeViewModel.Companion.HOME
import com.distritv.utils.*
import org.koin.androidx.viewmodel.ext.android.viewModel
import java.util.concurrent.TimeUnit


class HomeFragment: Fragment() {

    private var _binding: FragmentHomeBinding? = null
    private val binding get() = _binding!!

    private val viewModel by viewModel<HomeViewModel>()

    var infoBtnVisible = false

    private val handler = Handler(Looper.getMainLooper())

    private lateinit var languages: Array<String>

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
        textsObserver()
        setSpinnerSelection()

        viewModel.setLocale()

        setupInformationButton()
    }

    override fun onDestroy() {
        super.onDestroy()
        handler.removeCallbacksAndMessages(null)
    }

    private fun loadImage() {
        binding.imageContainer.setImageResource(R.drawable.home_wallpaper)
    }

    private fun deviceInfoObserver() {
        viewModel.deviceInfo.observe(this) { deviceInfoCard ->
            binding.versionValue.text = deviceInfoCard.currentVersionApp
            binding.tvCodeValue.text = deviceInfoCard.tvCode
            addStatus(deviceInfoCard.connectionStatus)
            languageSpinner()
            setSpinnerSelection()
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

        } else {
            binding.informationCard.visibility = View.GONE
            binding.informationBtn.setImageDrawable(
                ContextCompat.getDrawable(requireContext(), R.drawable.info_100)
            )
            infoBtnVisible = false

            // Remove timer to close information card
            handler.removeCallbacksAndMessages(null)
        }
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

    private fun textsObserver() {
        viewModel.textInfoCardVersion.observe(viewLifecycleOwner) { text ->
            binding.versionKey.text = text
        }
        viewModel.textInfoCardTvCode.observe(viewLifecycleOwner) { text ->
            binding.tvCodeKey.text = text
        }
        viewModel.textInfoCardConnStatus.observe(viewLifecycleOwner) { text ->
            binding.connectionStatusKey.text = text
        }
        viewModel.textInfoCardLang.observe(viewLifecycleOwner) { text ->
            binding.languageKey.text = text
        }
    }

    private fun languageSpinner() {
        languages = viewModel.getLanguages()
        val spinnerAdapter = languageSpinnerAdapter()
        binding.languageSpinner.adapter = spinnerAdapter
        languageSpinnerListener(spinnerAdapter)
    }

    private fun languageSpinnerAdapter(): ArrayAdapter<String> {
        val spinnerAdapter = ArrayAdapter(context!!, R.layout.spinner_item, languages)
        spinnerAdapter.setDropDownViewResource(android.R.layout.select_dialog_singlechoice)
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
                    viewModel.changeLocale(HOME, selectedLanguage)

                    updateLanguageItems(spinnerAdapter)
                }
            }
    }

    private fun updateLanguageItems(spinnerAdapter: ArrayAdapter<String>) {
        var auxPosition = 0
        viewModel.getLanguages().forEach { lang ->
            languages[auxPosition] = lang
            auxPosition++
        }
        spinnerAdapter.notifyDataSetChanged()
    }

    private fun setSpinnerSelection() {
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

    companion object {
        const val TAG = "[HomeFragment]"
        private const val CIRCLE_SIZE = 40
    }

}