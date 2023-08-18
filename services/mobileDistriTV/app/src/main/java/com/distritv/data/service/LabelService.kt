package com.distritv.data.service

import com.distritv.data.model.Label

class LabelService(private val labelDBService: LabelDBService) {

    fun saveLabels(labelList: List<Label>?) {
        val labelsSaved = getLabels().toMutableList()

        if (labelList == null) {
            if (labelsSaved.isNotEmpty()) {
                deleteAllLabels()
            }
            return
        }

        labelsSaved.forEach { savedLabel ->
            // if label was remove from server, delete from DB
            if (labelList.firstOrNull { it.id == savedLabel.id } == null) {
                delete(savedLabel.id)
            }
        }

        labelList.forEach { label ->
            val savedLabel = labelsSaved.firstOrNull { it.id == label.id }
            // if label found by id, update it if different
            // save new label if not found
            if (savedLabel != null && savedLabel != label) {
                update(label)
            } else if (savedLabel == null) {
                save(label)
                labelsSaved.add(label)
            }
        }
    }

    fun save(label: Label) {
        labelDBService.insert(label)
    }

    fun update(label: Label) {
        labelDBService.update(label.id, label)
    }

    fun delete(labelId: Long) {
        labelDBService.delete(labelId)
    }

    fun deleteAllLabels() {
        getLabels().forEach { label ->
            delete(label.id)
        }
    }

    fun getLabels(): List<Label> {
        return labelDBService.findAllLabels()
    }

    companion object {
        const val TAG = "[LabelService]"
    }
}