package com.distritv.data.service

import android.content.ContentValues
import android.provider.BaseColumns
import com.distritv.data.ContentContract
import com.distritv.data.model.Content


class ContentDbService(private val contentDbHelper: ContentDbHelper) {


    fun insert(content: Content): Long {

        // Create a new map of values, where column names are the keys
        val values = ContentValues().apply {
            put(ContentContract.ContentEntry.COLUMN_CONTENT_NAME, content.name)
            put(ContentContract.ContentEntry.COLUMN_CONTENT_LOCAL_PATH, content.localPath)
            put(ContentContract.ContentEntry.COLUMN_CONTENT_URL, content.url)
            put(ContentContract.ContentEntry.COLUMN_CONTENT_TYPE, content.type)
            put(ContentContract.ContentEntry.COLUMN_CONTENT_TEXT, content.text)
        }

        // Insert the new row, returning the primary key value of the new row
        val newRowId = contentDbHelper.writableDatabase.insert(ContentContract.ContentEntry.TABLE_NAME, null, values)

        return newRowId ?: -1
    }


    fun getAllFileDownload(): MutableList<Content> {
        // How you want the results sorted in the resulting Cursor
        val sortOrder = "${BaseColumns._ID} DESC"
        return selectAll(sortOrder)
    }

    fun getLastFileDownload(): Content {
        // How you want the results sorted in the resulting Cursor
        val sortOrder = "${BaseColumns._ID} DESC LIMIT 1"
        return selectAll(sortOrder).first()
    }

    private fun selectAll(sortOrder: String): MutableList<Content> {

        // Define a projection that specifies which columns from the database
        // you will actually use after this query.
        val projection = arrayOf(
            BaseColumns._ID,
            ContentContract.ContentEntry.COLUMN_CONTENT_NAME,
            ContentContract.ContentEntry.COLUMN_CONTENT_LOCAL_PATH,
            ContentContract.ContentEntry.COLUMN_CONTENT_URL,
            ContentContract.ContentEntry.COLUMN_CONTENT_TYPE,
            ContentContract.ContentEntry.COLUMN_CONTENT_TEXT
        )

        val cursor = contentDbHelper.readableDatabase.query(
            ContentContract.ContentEntry.TABLE_NAME,   // The table to query
            projection,             // The array of columns to return (pass null to get all)
            null,              // The columns for the WHERE clause
            null,          // The values for the WHERE clause
            null,                   // don't group the rows
            null,                   // don't filter by row groups
            sortOrder               // The sort order
        )

        val items = mutableListOf<Content>()
        with(cursor) {
            while (moveToNext()) {
                items.add(
                    Content(
                        getLong(getColumnIndexOrThrow(BaseColumns._ID)),
                        getString(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_NAME)),
                        getString(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_LOCAL_PATH)),
                        getString(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_URL)),
                        getString(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_TYPE)),
                        getString(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_TEXT))
                    )
                )
            }
        }
        cursor.close()
        return items
    }

    fun selectById(id: Long) {

        // Define a projection that specifies which columns from the database
        // you will actually use after this query.
        val projection = arrayOf(
            BaseColumns._ID,
            ContentContract.ContentEntry.COLUMN_CONTENT_NAME,
            ContentContract.ContentEntry.COLUMN_CONTENT_LOCAL_PATH,
            ContentContract.ContentEntry.COLUMN_CONTENT_URL,
            ContentContract.ContentEntry.COLUMN_CONTENT_TYPE,
            ContentContract.ContentEntry.COLUMN_CONTENT_TEXT
        )

        // Filter results WHERE "_id" = 'id'
        val selection = "${BaseColumns._ID} = ?"
        val selectionArgs = arrayOf(id.toString())

        // How you want the results sorted in the resulting Cursor
        val sortOrder = "${ContentContract.ContentEntry.COLUMN_CONTENT_NAME} DESC"

        //val cursor = dbReadable.query(
        val cursor = contentDbHelper.readableDatabase.query(
            ContentContract.ContentEntry.TABLE_NAME,   // The table to query
            projection,             // The array of columns to return (pass null to get all)
            selection,              // The columns for the WHERE clause
            selectionArgs,          // The values for the WHERE clause
            null,                   // don't group the rows
            null,                   // don't filter by row groups
            sortOrder               // The sort order
        )

        val itemIds = mutableListOf<Long>()
        with(cursor) {
            while (moveToNext()) {
                val itemId = getLong(getColumnIndexOrThrow(BaseColumns._ID))
                itemIds.add(itemId)
            }
        }
        cursor.close()


    }

    fun findFileById(id: Long): Content {

        // Define a projection that specifies which columns from the database
        // you will actually use after this query.
        val projection = arrayOf(
            BaseColumns._ID,
            ContentContract.ContentEntry.COLUMN_CONTENT_NAME,
            ContentContract.ContentEntry.COLUMN_CONTENT_LOCAL_PATH,
            ContentContract.ContentEntry.COLUMN_CONTENT_URL,
            ContentContract.ContentEntry.COLUMN_CONTENT_TYPE,
            ContentContract.ContentEntry.COLUMN_CONTENT_TEXT
        )

        // Filter results WHERE "_id" = 'id'
        val selection = "${BaseColumns._ID} = ?"
        val selectionArgs = arrayOf(id.toString())

        // How you want the results sorted in the resulting Cursor
        val sortOrder = "${ContentContract.ContentEntry.COLUMN_CONTENT_NAME} DESC"

        //val cursor = dbReadable.query(
        val cursor = contentDbHelper.readableDatabase.query(
            ContentContract.ContentEntry.TABLE_NAME,   // The table to query
            projection,             // The array of columns to return (pass null to get all)
            selection,              // The columns for the WHERE clause
            selectionArgs,          // The values for the WHERE clause
            null,                   // don't group the rows
            null,                   // don't filter by row groups
            sortOrder               // The sort order
        )

        val items = mutableListOf<Content>()
        with(cursor) {
            while (moveToNext()) {
                items.add(
                    Content(
                        getLong(getColumnIndexOrThrow(BaseColumns._ID)),
                        getString(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_NAME)),
                        getString(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_LOCAL_PATH)),
                        getString(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_URL)),
                        getString(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_TYPE)),
                        getString(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_TEXT))
                    )
                )
            }
        }
        cursor.close()

        return items.first()
    }

    fun update(id: Long, content: Content) {
        val values = ContentValues().apply {
            put(ContentContract.ContentEntry.COLUMN_CONTENT_NAME, content.name)
            put(ContentContract.ContentEntry.COLUMN_CONTENT_LOCAL_PATH, content.localPath)
            put(ContentContract.ContentEntry.COLUMN_CONTENT_URL, content.url)
            put(ContentContract.ContentEntry.COLUMN_CONTENT_TYPE, content.type)
            put(ContentContract.ContentEntry.COLUMN_CONTENT_TEXT, content.text)
        }

        // Which row to update, based on the title
        val selection = "${BaseColumns._ID} = ?"
        val selectionArgs = arrayOf(id.toString())
        val count = contentDbHelper.writableDatabase.update(
            ContentContract.ContentEntry.TABLE_NAME,
            values,
            selection,
            selectionArgs
        )
    }

}