package com.distritv.ui.home

import android.content.Context
import android.content.Intent
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.distritv.databinding.FragmentContentListBinding
import com.distritv.data.model.Content
import com.distritv.ui.image.ImageActivity
import com.distritv.ui.text.TextActivity
import com.distritv.ui.video.VideoPlaybackActivity
import com.distritv.utils.IMAGE_TYPES
import com.distritv.utils.LOCAL_PATH_PARAM
import com.distritv.utils.TEXT_PARAM
import com.distritv.utils.VIDEO_TYPES
import org.koin.androidx.viewmodel.ext.android.viewModel


class ContentListFragment : Fragment() {

    private var _binding: FragmentContentListBinding? = null
    private val binding get() = _binding!!

    private var listener: OnFragmentInteractionListener? = null

    private val viewModel by viewModel<ContentListViewModel>()

    private lateinit var recyclerView: RecyclerView
    private val adapter = ContentListAdapter() { adapterOnClick(it) }


    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {

        _binding = FragmentContentListBinding.inflate(layoutInflater, container, false)

        recyclerView = binding.listItems
        recyclerView.layoutManager = LinearLayoutManager(context)
        recyclerView.adapter = adapter

        loadingObserver()
        contentListObserver()
        contentDownloadedObserver()

        return binding.root
    }

    private fun loadingObserver() {
        viewModel.loading.observe(viewLifecycleOwner) { visible ->
            binding.progressBar.visibility = if (visible) View.VISIBLE else View.GONE
        }
    }

    private fun contentListObserver() {
        viewModel.contentList.observe(viewLifecycleOwner) { fileList ->
            adapter.contentList = fileList
            adapter.notifyDataSetChanged()
        }
    }

    private fun contentDownloadedObserver() {
        viewModel.contentDownloaded.observe(viewLifecycleOwner) {
            if (it != null) {
                Toast.makeText(activity, "Se descargó con éxito.", Toast.LENGTH_SHORT).show()
                if (VIDEO_TYPES.contains(it.type)) {
                    it.localPath?.let { it1 -> redirectView(it1, VideoPlaybackActivity()::class.java) }
                } else if (IMAGE_TYPES.contains(it.type)) {
                    it.localPath?.let { it1 -> redirectView(it1, ImageActivity()::class.java) }
                } else if (!it.text.isNullOrEmpty()){
                    redirectViewText(it.text, TextActivity()::class.java)
                }
            } else {
                Toast.makeText(activity, "No se pudo realizar la descarga.", Toast.LENGTH_SHORT)
                    .show()
            }
        }
    }

    private fun redirectView(contentLocalPath: String, cls: Class<out Any>) {
        val intent = Intent(context, cls)
        intent.putExtra(LOCAL_PATH_PARAM, contentLocalPath)
        startActivity(intent)
    }

    private fun redirectViewText(text: String, cls: Class<out Any>) {
        val intent = Intent(context, cls)
        intent.putExtra(TEXT_PARAM, text)
        startActivity(intent)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        setupBackButton()
    }


    override fun onAttach(context: Context) {
        super.onAttach(context)

        if (context is OnFragmentInteractionListener) {
            listener = context
        } else {
            throw ClassCastException("Must implement DownloadListFragment.OnFragmentInteractionListener")
        }
    }

    private fun setupBackButton() {
        binding.back.setOnClickListener {
            listener?.onBackButtonPressed()
        }
    }

    override fun onDetach() {
        super.onDetach()
        listener = null
    }

    interface OnFragmentInteractionListener {
        fun onBackButtonPressed()
    }

    companion object {
        const val TAG = "DownloadListFragment"
    }

    override fun onResume() {
        super.onResume()
        viewModel.getContentList()
    }

    private fun adapterOnClick(content: Content) {
        viewModel.downloadContent(content)
    }


}