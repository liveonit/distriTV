package com.distritv.ui.home


import android.content.res.ColorStateList
import android.graphics.Color
import android.graphics.Typeface
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.TextView
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import com.distritv.R
import com.distritv.databinding.FragmentHomeBinding
import com.distritv.ui.FullscreenManager
import org.koin.androidx.viewmodel.ext.android.viewModel
import java.util.concurrent.TimeUnit


class HomeFragment: Fragment() {

    private var _binding: FragmentHomeBinding? = null
    private val binding get() = _binding!!

    private val viewModel by viewModel<HomeViewModel>()

    var infoBtnVisible = false

    private val handler = Handler(Looper.getMainLooper())

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
            binding.cardContent.removeAllViews()
            addTextView(resources.getString(R.string.app_name), true)
            addTextView("$CARD_INFO_VERSION: ${deviceInfoCard.currentVersionApp}", false)
            addTextView("$CARD_INFO_TV_CODE: ${deviceInfoCard.tvCode}", false)
            addStatus(deviceInfoCard.connectionStatus)
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

    private fun addTextView(text: String, bold: Boolean) {
        val textView = TextView(context)
        textView.text = text
        textView.setTextColor(Color.BLACK)
        if (bold) {
            textView.typeface = Typeface.DEFAULT_BOLD
        }
        binding.cardContent.addView(textView)
    }

    private fun addStatus(status: Boolean?) {
        val linearLayout = LinearLayout(context)
        linearLayout.orientation = LinearLayout.HORIZONTAL
        linearLayout.layoutParams = LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        )

        val textView = TextView(context)
        textView.text = "$CARD_INFO_CONN_STATUS: "
        textView.setTextColor(Color.BLACK)
        linearLayout.addView(textView)

        if (status == null) {
            val progressBar = ProgressBar(context)
            progressBar.layoutParams = LinearLayout.LayoutParams(CIRCLE_SIZE, CIRCLE_SIZE)
            progressBar.indeterminateTintList = ColorStateList.valueOf(Color.BLACK)

            linearLayout.addView(progressBar)
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
            linearLayout.addView(imageView)
        }

        binding.cardContent.addView(linearLayout)
    }

    companion object {
        const val TAG = "[HomeFragment]"
        private const val CIRCLE_SIZE = 40
        private const val CARD_INFO_VERSION = "Versión"
        private const val CARD_INFO_TV_CODE = "Código de TV"
        private const val CARD_INFO_CONN_STATUS = "Estado de conexión"
    }

}