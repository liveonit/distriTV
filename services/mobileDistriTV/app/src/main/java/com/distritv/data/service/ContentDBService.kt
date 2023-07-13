package com.distritv.data.service

import android.content.ContentValues
import com.distritv.data.DBContract
import com.distritv.data.helper.DBHelper
import com.distritv.data.model.Content


class ContentDBService(private val dbHelper: DBHelper) {

    fun insert(content: Content): Long {
        // Create a new map of values, where column names are the keys
        val values = ContentValues().apply {
            put(DBContract.ContentEntry.COLUMN_CONTENT_ID_FROM_SERVER, content.id)
            put(DBContract.ContentEntry.COLUMN_CONTENT_NAME, content.name)
            put(DBContract.ContentEntry.COLUMN_CONTENT_FILE_NAME, content.fileName)
            put(DBContract.ContentEntry.COLUMN_CONTENT_URL, content.url)
            put(DBContract.ContentEntry.COLUMN_CONTENT_TYPE, content.type)
            put(DBContract.ContentEntry.COLUMN_CONTENT_TEXT, content.text)
            put(DBContract.ContentEntry.COLUMN_CONTENT_DURATION, content.durationInSeconds)
        }

        // Insert the new row, returning the primary key value of the new row
        val newRowId = dbHelper.writableDatabase.insert(DBContract.ContentEntry.TABLE_NAME, null, values)

        return newRowId ?: -1
    }

    fun update(id: Long, content: Content): Int {
        val values = ContentValues().apply {
            put(DBContract.ContentEntry.COLUMN_CONTENT_ID_FROM_SERVER, content.id)
            put(DBContract.ContentEntry.COLUMN_CONTENT_NAME, content.name)
            put(DBContract.ContentEntry.COLUMN_CONTENT_FILE_NAME, content.fileName)
            put(DBContract.ContentEntry.COLUMN_CONTENT_URL, content.url)
            put(DBContract.ContentEntry.COLUMN_CONTENT_TYPE, content.type)
            put(DBContract.ContentEntry.COLUMN_CONTENT_TEXT, content.text)
            put(DBContract.ContentEntry.COLUMN_CONTENT_DURATION, content.durationInSeconds)
        }

        // Which row to update, based on the title
        val selection = "${DBContract.ContentEntry.COLUMN_CONTENT_ID_FROM_SERVER} = ?"
        val selectionArgs = arrayOf(id.toString())

        return dbHelper.writableDatabase.update(
            DBContract.ContentEntry.TABLE_NAME,
            values,
            selection,
            selectionArgs
        )
    }

    fun delete(id: Long): Int {
        val selection = "${DBContract.ContentEntry.COLUMN_CONTENT_ID_FROM_SERVER} = ?"
        val selectionArgs = arrayOf(id.toString())

        return dbHelper.writableDatabase.delete(
            DBContract.ContentEntry.TABLE_NAME,
            selection,
            selectionArgs
        )
    }

    fun findAllContents(): MutableList<Content> {

        // Define a projection that specifies which columns from the database
        // you will actually use after this query.
        val projection = getAllBaseDateColumns()

        val cursor = dbHelper.readableDatabase.query(
            DBContract.ContentEntry.TABLE_NAME,   // The table to query
            projection,             // The array of columns to return (pass null to get all)
            null,              // The columns for the WHERE clause
            null,          // The values for the WHERE clause
            null,                   // don't group the rows
            null,                   // don't filter by row groups
            null               // The sort order
        )

        val items = mutableListOf<Content>()
        with(cursor) {
            while (moveToNext()) {
                items.add(
                    Content(
                        getLong(getColumnIndexOrThrow(DBContract.ContentEntry.COLUMN_CONTENT_ID_FROM_SERVER)),
                        getString(getColumnIndexOrThrow(DBContract.ContentEntry.COLUMN_CONTENT_NAME)),
                        getString(getColumnIndexOrThrow(DBContract.ContentEntry.COLUMN_CONTENT_FILE_NAME)),
                        getString(getColumnIndexOrThrow(DBContract.ContentEntry.COLUMN_CONTENT_URL)),
                        getString(getColumnIndexOrThrow(DBContract.ContentEntry.COLUMN_CONTENT_TYPE)),
                        getString(getColumnIndexOrThrow(DBContract.ContentEntry.COLUMN_CONTENT_TEXT)),
                        getLong(getColumnIndexOrThrow(DBContract.ContentEntry.COLUMN_CONTENT_DURATION)),
                        SCHEDULE_NULL
                    )
                )
            }
        }
        cursor.close()
        return items
    }

    fun findByContentId(id: Long): Content? {

        // Define a projection that specifies which columns from the database
        // you will actually use after this query.
        val projection = getAllBaseDateColumns()

        // Filter results WHERE "_id" = 'id'
        val selection = "${DBContract.ContentEntry.COLUMN_CONTENT_ID_FROM_SERVER} = ?"
        val selectionArgs = arrayOf(id.toString())

        //val cursor = dbReadable.query(
        val cursor = dbHelper.readableDatabase.query(
            DBContract.ContentEntry.TABLE_NAME,   // The table to query
            projection,             // The array of columns to return (pass null to get all)
            selection,              // The columns for the WHERE clause
            selectionArgs,          // The values for the WHERE clause
            null,                   // don't group the rows
            null,                   // don't filter by row groups
            null               // The sort order
        )

        val items = mutableListOf<Content>()
        with(cursor) {
            while (moveToNext()) {
                items.add(
                    Content(
                        getLong(getColumnIndexOrThrow(DBContract.ContentEntry.COLUMN_CONTENT_ID_FROM_SERVER)),
                        getString(getColumnIndexOrThrow(DBContract.ContentEntry.COLUMN_CONTENT_NAME)),
                        getString(getColumnIndexOrThrow(DBContract.ContentEntry.COLUMN_CONTENT_FILE_NAME)),
                        getString(getColumnIndexOrThrow(DBContract.ContentEntry.COLUMN_CONTENT_URL)),
                        getString(getColumnIndexOrThrow(DBContract.ContentEntry.COLUMN_CONTENT_TYPE)),
                        getString(getColumnIndexOrThrow(DBContract.ContentEntry.COLUMN_CONTENT_TEXT)),
                        getLong(getColumnIndexOrThrow(DBContract.ContentEntry.COLUMN_CONTENT_DURATION)),
                        SCHEDULE_NULL
                    )
                )
            }
        }
        cursor.close()

        return if (items.isNotEmpty()) {
            items.first()
        } else {
            null
        }
    }

    fun findFileNameContents(): List<String> {

        val projection = arrayOf(
            DBContract.ContentEntry.COLUMN_CONTENT_FILE_NAME
        )

        val cursor = dbHelper.readableDatabase.query(
            DBContract.ContentEntry.TABLE_NAME,   // The table to query
            projection,             // The array of columns to return (pass null to get all)
            null,              // The columns for the WHERE clause
            null,          // The values for the WHERE clause
            null,                   // don't group the rows
            null,                   // don't filter by row groups
            null               // The sort order
        )

        val items = mutableListOf<String>()
        with(cursor) {
            while (moveToNext()) {
                items.add(getString(getColumnIndexOrThrow(DBContract.ContentEntry.COLUMN_CONTENT_FILE_NAME)))
            }
        }
        cursor.close()

        return items
    }

    private fun getAllBaseDateColumns(): Array<String> {
        return arrayOf(
            DBContract.ContentEntry.COLUMN_CONTENT_ID_FROM_SERVER,
            DBContract.ContentEntry.COLUMN_CONTENT_NAME,
            DBContract.ContentEntry.COLUMN_CONTENT_FILE_NAME,
            DBContract.ContentEntry.COLUMN_CONTENT_URL,
            DBContract.ContentEntry.COLUMN_CONTENT_TYPE,
            DBContract.ContentEntry.COLUMN_CONTENT_TEXT,
            DBContract.ContentEntry.COLUMN_CONTENT_DURATION
        )
    }

    companion object {
        const val TAG = "[ContentDBService]"
        private val SCHEDULE_NULL = null
    }

}
