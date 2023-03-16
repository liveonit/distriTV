package com.distritv.ui.home

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.distritv.R
import com.distritv.data.model.Content

class ContentListAdapter(private val onClick: (Content) -> Unit):
    RecyclerView.Adapter<ContentListAdapter.ViewHolder>() {

    var contentList: List<Content> = emptyList()

    class ViewHolder(itemView: View, val onClick: (Content) -> Unit) :
        RecyclerView.ViewHolder(itemView) {

        fun bind(content: Content) {
            if (!content.name.isNullOrEmpty()) {
                itemView.findViewById<TextView>(R.id.item_name).text = content.name
            } else {
                itemView.findViewById<TextView>(R.id.item_name).text = content.url
            }

            itemView.setOnClickListener {
                onClick(content)
            }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        return ViewHolder(LayoutInflater.from(parent.context).inflate(R.layout.list_item_content, parent, false), onClick)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.bind(contentList[position])
    }

    override fun getItemCount() = contentList.size
}