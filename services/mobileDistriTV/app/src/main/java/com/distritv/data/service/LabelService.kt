package com.distritv.data.service

import com.distritv.data.model.Label

class LabelService(private val labelDBService: LabelDBService) {

    fun saveLabels(labelList: List<Label>?) {
        println(labelList)
        val labelsSaved = getLabels()
        println(labelsSaved)
println("aaa")
        if (labelList == null) {
            println("bbb")
            if (labelsSaved.isNotEmpty()) {
                println("ccc")
                deleteAllLabels()
            }
            return
        }

        labelsSaved.forEach { savedLabel ->
            println("oooo $savedLabel")
            // if label was remove from server, delete from DB
            if (labelList.firstOrNull { it.id == savedLabel.id } == null) {
                println("wwww ")
                delete(savedLabel.id)
            }
        }

        println("ddd")
        labelList.forEach { label ->
            println("ffff")
            val savedLabel = labelsSaved.firstOrNull { it.id == label.id }
            println(savedLabel)
            // if label found by id, update it if different
            // save new label if not found
            println("tttt")
            println(savedLabel != null && savedLabel != label)
            if (savedLabel != null && savedLabel != label) {
                println("uuuu")
                update(label)
            } else if (savedLabel == null) {
                println("eeee")
                save(label)
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