package com.distritv.ui.home

import android.content.ContentValues.TAG
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.distritv.R
import com.distritv.model.FileDownload

class ContentListAdapter(private val onClick: (FileDownload) -> Unit):
    RecyclerView.Adapter<ContentListAdapter.ViewHolder>() {

    var fileDownloadList: List<FileDownload> = emptyList()

    class ViewHolder(itemView: View, val onClick: (FileDownload) -> Unit): RecyclerView.ViewHolder(itemView) {

        fun bind(fileDownload: FileDownload) {
            Log.v(TAG, "aca tamo adentro - ${fileDownload.name}, ${fileDownload.url}, ${fileDownload.id}, ${fileDownload.type}")

            if(!fileDownload.name.isNullOrEmpty()) {
                itemView.findViewById<TextView>(R.id.item_name).text = fileDownload.name
            } else {
                itemView.findViewById<TextView>(R.id.item_name).text = fileDownload.url
            }


            itemView.setOnClickListener {
                onClick(fileDownload)
            }

        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        return ViewHolder(LayoutInflater.from(parent.context).inflate(R.layout.list_item_content, parent, false), onClick)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        Log.v(TAG, "sizeeee - ${fileDownloadList.size}")
        holder.bind(fileDownloadList[position])
    }

    override fun getItemCount() = fileDownloadList.size
}