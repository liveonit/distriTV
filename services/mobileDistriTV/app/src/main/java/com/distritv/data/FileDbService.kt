package com.distritv.data

import android.content.ContentValues
import android.content.Context
import android.provider.BaseColumns
import com.distritv.model.FileDownload


class FileDbService(context: Context) {

    val dbWritable = FileDbHelper(context).writableDatabase
    val dbReadable = FileDbHelper(context).readableDatabase


    fun insert(fileDownload: FileDownload): Long {


        // Create a new map of values, where column names are the keys
        val values = ContentValues().apply {
            put(FileContract.FileEntry.COLUMN_FILE_NAME, fileDownload.name)
            put(FileContract.FileEntry.COLUMN_FILE_LOCAL_PATH, fileDownload.localPath)
            put(FileContract.FileEntry.COLUMN_FILE_URL, fileDownload.url)
            put(FileContract.FileEntry.COLUMN_FILE_CONTENT_TYPE, fileDownload.contentType)
        }

        // Insert the new row, returning the primary key value of the new row
        val newRowId = dbWritable?.insert(FileContract.FileEntry.TABLE_NAME, null, values)

        return newRowId ?: -1
    }


    fun getAllFileDownload(): MutableList<FileDownload> {
        // How you want the results sorted in the resulting Cursor
        val sortOrder = "${BaseColumns._ID} DESC"
        return selectAll(sortOrder)
    }

    fun getLastFileDownload(): FileDownload {
        // How you want the results sorted in the resulting Cursor
        val sortOrder = "${BaseColumns._ID} DESC LIMIT 1"
        return selectAll(sortOrder).first()
    }

    private fun selectAll(sortOrder: String): MutableList<FileDownload> {

        // Define a projection that specifies which columns from the database
        // you will actually use after this query.
        val projection = arrayOf(
            BaseColumns._ID,
            FileContract.FileEntry.COLUMN_FILE_NAME,
            FileContract.FileEntry.COLUMN_FILE_LOCAL_PATH,
            FileContract.FileEntry.COLUMN_FILE_URL,
            FileContract.FileEntry.COLUMN_FILE_CONTENT_TYPE
        )

        val cursor = dbReadable.query(
            FileContract.FileEntry.TABLE_NAME,   // The table to query
            projection,             // The array of columns to return (pass null to get all)
            null,              // The columns for the WHERE clause
            null,          // The values for the WHERE clause
            null,                   // don't group the rows
            null,                   // don't filter by row groups
            sortOrder               // The sort order
        )

        val items = mutableListOf<FileDownload>()
        with(cursor) {
            while (moveToNext()) {
                items.add(
                    FileDownload(
                        getLong(getColumnIndexOrThrow(BaseColumns._ID)),
                        getString(getColumnIndexOrThrow(FileContract.FileEntry.COLUMN_FILE_NAME)),
                        getString(getColumnIndexOrThrow(FileContract.FileEntry.COLUMN_FILE_LOCAL_PATH)),
                        getString(getColumnIndexOrThrow(FileContract.FileEntry.COLUMN_FILE_URL)),
                        getString(getColumnIndexOrThrow(FileContract.FileEntry.COLUMN_FILE_CONTENT_TYPE))
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
            FileContract.FileEntry.COLUMN_FILE_NAME,
            FileContract.FileEntry.COLUMN_FILE_LOCAL_PATH,
            FileContract.FileEntry.COLUMN_FILE_URL,
            FileContract.FileEntry.COLUMN_FILE_CONTENT_TYPE
        )

        // Filter results WHERE "_id" = 'id'
        val selection = "${BaseColumns._ID} = ?"
        val selectionArgs = arrayOf(id.toString())

        // How you want the results sorted in the resulting Cursor
        val sortOrder = "${FileContract.FileEntry.COLUMN_FILE_NAME} DESC"

        val cursor = dbReadable.query(
            FileContract.FileEntry.TABLE_NAME,   // The table to query
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

    fun update(id: Long, fileDownload: FileDownload) {
        // New value for one column
        val title = "MyNewTitle"
        val values = ContentValues().apply {
            put(FileContract.FileEntry.COLUMN_FILE_NAME, fileDownload.name)
            put(FileContract.FileEntry.COLUMN_FILE_LOCAL_PATH, fileDownload.localPath)
            put(FileContract.FileEntry.COLUMN_FILE_URL, fileDownload.url)
            put(FileContract.FileEntry.COLUMN_FILE_CONTENT_TYPE, fileDownload.contentType)
        }

        // Which row to update, based on the title
        val selection = "${BaseColumns._ID} = ?"
        val selectionArgs = arrayOf(id.toString())
        val count = dbWritable.update(
            FileContract.FileEntry.TABLE_NAME,
            values,
            selection,
            selectionArgs
        )
    }

}