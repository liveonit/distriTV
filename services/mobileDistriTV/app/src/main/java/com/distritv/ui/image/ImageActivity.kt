package com.distritv.ui.image

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.distritv.R
import com.distritv.databinding.ActivityImageBinding
import com.distritv.utils.LOCAL_PATH_PARAM
import com.distritv.utils.addFragment


class ImageActivity : AppCompatActivity() {

    private lateinit var binding: ActivityImageBinding
    lateinit var contentLocalPath: String

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityImageBinding.inflate(layoutInflater)
        setContentView(binding.root)

        contentLocalPath = intent.extras?.getString(LOCAL_PATH_PARAM).toString()

        supportFragmentManager.addFragment(
            R.id.image_fragment_container,
            ImageFragment.newInstance(contentLocalPath),
            false,
            ImageFragment.TAG
        )
    }

}