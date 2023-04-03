package com.distritv.ui.text

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.distritv.R
import com.distritv.databinding.ActivityImageBinding
import com.distritv.databinding.ActivityTextBinding
import com.distritv.ui.image.ImageFragment
import com.distritv.utils.LOCAL_PATH_PARAM
import com.distritv.utils.TEXT_PARAM
import com.distritv.utils.addFragment

class TextActivity: AppCompatActivity() {

    private lateinit var binding: ActivityTextBinding
    lateinit var contentLocalPath: String

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityTextBinding.inflate(layoutInflater)
        setContentView(binding.root)

        contentLocalPath = intent.extras?.getString(TEXT_PARAM).toString()

        supportFragmentManager.addFragment(
            R.id.text_fragment_container,
            TextFragment.newInstance(contentLocalPath),
            false,
            TextFragment.TAG
        )
    }
}