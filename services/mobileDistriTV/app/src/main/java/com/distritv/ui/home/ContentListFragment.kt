package com.distritv.ui.home

import android.content.ContentValues
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.distritv.databinding.FragmentContentListBinding
import com.distritv.model.FileDownload
import com.distritv.ui.image.ImageActivity
import com.distritv.ui.video.VideoPlaybackActivity
import org.koin.androidx.viewmodel.ext.android.viewModel



/**
 * A simple [Fragment] subclass.
 * Use the [ContentListFragment.newInstance] factory method to
 * create an instance of this fragment.
 */
class ContentListFragment : Fragment() {
    private var _binding: FragmentContentListBinding? = null
    private val binding get() = _binding!!

    private var listener: OnFragmentInteractionListener? = null

    private val viewModel by viewModel<ContentListViewModel>()

    var prueba = 0

    private lateinit var recyclerView: RecyclerView
    private val adapter = ContentListAdapter() { adapterOnClick(it) }


    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        _binding = FragmentContentListBinding.inflate(layoutInflater, container, false)


        recyclerView = binding.listItems
        recyclerView.layoutManager = LinearLayoutManager(context)
        recyclerView.adapter = adapter

        viewModel.loading.observe(viewLifecycleOwner) { visible ->
            binding.progressBar.visibility = if (visible) View.VISIBLE else View.GONE
        }

        viewModel.downloadFileList.observe(viewLifecycleOwner) { fileList ->
            adapter.fileDownloadList = fileList
            prueba = fileList.size
            Log.v(ContentValues.TAG, "adentro 000004 - ${fileList.size}")
            adapter.notifyDataSetChanged()
        }
        downloadFileObserver()

        Log.v(ContentValues.TAG, "000002")


        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        setupBackButton()

        Log.v(ContentValues.TAG, "000003")

    }


    override fun onAttach(context: Context) {
        super.onAttach(context)

        Log.v(ContentValues.TAG, "000001")

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

        viewModel.fetchFileDownloadList()

        Log.v(ContentValues.TAG, "000004")

    }

    private fun adapterOnClick(fileDownload: FileDownload) {
        viewModel.downloadFile(fileDownload)
    }

    private fun downloadFileObserver() {
        viewModel.fileDownloaded.observe(viewLifecycleOwner) {
            if (it != null) {
                Toast.makeText(activity, "Se descargó con éxito.", Toast.LENGTH_SHORT).show()

                if(it.type.equals("video/mp4")) {
                    val intent = Intent(context, VideoPlaybackActivity()::class.java)
                    intent.putExtra("localPath", it.localPath)
                    startActivity(intent)
                } else if (it.type.equals("image/jpeg") || it.type.equals("image/jpg") || it.type.equals("image/png")) {
                    val intent = Intent(context, ImageActivity()::class.java)
                    intent.putExtra("localPath", it.localPath)
                    startActivity(intent)
                }
            } else {
                Toast.makeText(activity, "No se pudo realizar la descarga.", Toast.LENGTH_SHORT).show()
            }
        }
    }
}