package com.distritv.data.service

import android.content.ContentValues
import com.distritv.data.DBContract
import com.distritv.data.helper.DBHelper
import com.distritv.data.model.Label

class LabelDBService(private val dbHelper: DBHelper) {

    fun insert(label: Label): Long {
        val values = ContentValues().apply {
            put(DBContract.LabelEntry.COLUMN_LABEL_ID, label.id)
            put(DBContract.LabelEntry.COLUMN_LABEL_NAME, label.name)
            put(DBContract.LabelEntry.COLUMN_LABEL_DESCRIPTION, label.description)
        }

        val newRowId = dbHelper.writableDatabase.insert(DBContract.LabelEntry.TABLE_NAME, null, values)

        return newRowId ?: -1
    }

    fun update(id: Long, label: Label): Int {
        val values = ContentValues().apply {
            put(DBContract.LabelEntry.COLUMN_LABEL_ID, label.id)
            put(DBContract.LabelEntry.COLUMN_LABEL_NAME, label.name)
            put(DBContract.LabelEntry.COLUMN_LABEL_DESCRIPTION, label.description)
        }

        val selection = "${DBContract.LabelEntry.COLUMN_LABEL_ID} = ?"
        val selectionArgs = arrayOf(id.toString())

        return dbHelper.writableDatabase.update(
            DBContract.LabelEntry.TABLE_NAME,
            values,
            selection,
            selectionArgs
        )
    }

    fun delete(id: Long): Int {
        val selection = "${DBContract.LabelEntry.COLUMN_LABEL_ID} = ?"
        val selectionArgs = arrayOf(id.toString())

        return dbHelper.writableDatabase.delete(
            DBContract.LabelEntry.TABLE_NAME,
            selection,
            selectionArgs
        )
    }

    fun findAllLabels(): MutableList<Label> {
        val projection = getAllBaseDateColumns()

        val cursor = dbHelper.readableDatabase.query(
            DBContract.LabelEntry.TABLE_NAME,
            projection,
            null,
            null,
            null,
            null,
            null
        )

        val items = mutableListOf<Label>()
        with(cursor) {
            while (moveToNext()) {
                items.add(
                    Label(
                        getLong(getColumnIndexOrThrow(DBContract.LabelEntry.COLUMN_LABEL_ID)),
                        getString(getColumnIndexOrThrow(DBContract.LabelEntry.COLUMN_LABEL_NAME)),
                        getString(getColumnIndexOrThrow(DBContract.LabelEntry.COLUMN_LABEL_DESCRIPTION))
                    )
                )
            }
        }
        cursor.close()
        return items
    }

    private fun getAllBaseDateColumns(): Array<String> {
        return arrayOf(
            DBContract.LabelEntry.COLUMN_LABEL_ID,
            DBContract.LabelEntry.COLUMN_LABEL_NAME,
            DBContract.LabelEntry.COLUMN_LABEL_DESCRIPTION
        )
    }

    companion object {
        const val TAG = "[LabelDBService]"
    }
}