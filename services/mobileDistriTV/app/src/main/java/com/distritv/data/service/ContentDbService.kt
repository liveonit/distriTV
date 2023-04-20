package com.distritv.data.service

import android.content.ContentValues
import android.provider.BaseColumns
import com.distritv.data.ContentContract
import com.distritv.data.model.Content
import com.distritv.utils.*
import java.time.LocalDateTime


class ContentDbService(private val contentDbHelper: ContentDbHelper) {

    fun insert(content: Content): Long {
        // Create a new map of values, where column names are the keys
        val values = ContentValues().apply {
            put(ContentContract.ContentEntry.COLUMN_CONTENT_ID_FROM_SERVER, content.id)
            put(ContentContract.ContentEntry.COLUMN_CONTENT_NAME, content.name)
            put(ContentContract.ContentEntry.COLUMN_CONTENT_LOCAL_PATH, content.localPath)
            put(ContentContract.ContentEntry.COLUMN_CONTENT_URL, content.url)
            put(ContentContract.ContentEntry.COLUMN_CONTENT_TYPE, content.type)
            put(ContentContract.ContentEntry.COLUMN_CONTENT_TEXT, content.text)
            put(ContentContract.ContentEntry.COLUMN_CONTENT_START_DATE, content.startDate)
            put(ContentContract.ContentEntry.COLUMN_CONTENT_END_DATE, content.endDate)
            put(ContentContract.ContentEntry.COLUMN_CONTENT_CRON, content.cron)
            put(ContentContract.ContentEntry.COLUMN_CONTENT_DURATION, content.durationInSeconds)
            put(ContentContract.ContentEntry.COLUMN_CONTENT_ACTIVE, content.active)
        }

        // Insert the new row, returning the primary key value of the new row
        val newRowId = contentDbHelper.writableDatabase.insert(ContentContract.ContentEntry.TABLE_NAME, null, values)

        return newRowId ?: -1
    }

    fun update(id: Long, content: Content): Int {
        val values = ContentValues().apply {
            put(ContentContract.ContentEntry.COLUMN_CONTENT_ID_FROM_SERVER, content.id)
            put(ContentContract.ContentEntry.COLUMN_CONTENT_NAME, content.name)
            put(ContentContract.ContentEntry.COLUMN_CONTENT_LOCAL_PATH, content.localPath)
            put(ContentContract.ContentEntry.COLUMN_CONTENT_URL, content.url)
            put(ContentContract.ContentEntry.COLUMN_CONTENT_TYPE, content.type)
            put(ContentContract.ContentEntry.COLUMN_CONTENT_TEXT, content.text)
            put(ContentContract.ContentEntry.COLUMN_CONTENT_START_DATE, content.startDate)
            put(ContentContract.ContentEntry.COLUMN_CONTENT_END_DATE, content.endDate)
            put(ContentContract.ContentEntry.COLUMN_CONTENT_CRON, content.cron)
            put(ContentContract.ContentEntry.COLUMN_CONTENT_DURATION, content.durationInSeconds)
            put(ContentContract.ContentEntry.COLUMN_CONTENT_ACTIVE, content.active)
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

        return count
    }

    fun findAllContents(): MutableList<Content> {

        // Define a projection that specifies which columns from the database
        // you will actually use after this query.
        val projection = getAllBaseDateColumns()

        val sortOrder = "${BaseColumns._ID} DESC"

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
                        getLong(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_ID_FROM_SERVER)),
                        getString(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_NAME)),
                        getString(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_LOCAL_PATH)),
                        getString(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_URL)),
                        getString(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_TYPE)),
                        getString(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_TEXT)),
                        getLong(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_START_DATE)),
                        getLong(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_END_DATE)),
                        getString(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_CRON)),
                        getLong(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_DURATION)),
                        getInt(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_ACTIVE))
                    )
                )
            }
        }
        cursor.close()
        return items
    }

    fun selectByIdDB(id: Long): Content {

        // Define a projection that specifies which columns from the database
        // you will actually use after this query.
        val projection = getAllBaseDateColumns()

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
                        getLong(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_ID_FROM_SERVER)),
                        getString(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_NAME)),
                        getString(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_LOCAL_PATH)),
                        getString(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_URL)),
                        getString(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_TYPE)),
                        getString(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_TEXT)),
                        getLong(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_START_DATE)),
                        getLong(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_END_DATE)),
                        getString(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_CRON)),
                        getLong(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_DURATION)),
                        getInt(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_ACTIVE))
                    )
                )
            }
        }
        cursor.close()

        return items.first()
    }

    fun findByContentId(id: Long): Content {

        // Define a projection that specifies which columns from the database
        // you will actually use after this query.
        val projection = getAllBaseDateColumns()

        // Filter results WHERE "_id" = 'id'
        val selection = "${ContentContract.ContentEntry.COLUMN_CONTENT_ID_FROM_SERVER} = ?"
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
                        getLong(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_ID_FROM_SERVER)),
                        getString(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_NAME)),
                        getString(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_LOCAL_PATH)),
                        getString(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_URL)),
                        getString(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_TYPE)),
                        getString(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_TEXT)),
                        getLong(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_START_DATE)),
                        getLong(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_END_DATE)),
                        getString(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_CRON)),
                        getLong(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_DURATION)),
                        getInt(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_ACTIVE))
                    )
                )
            }
        }
        cursor.close()

        return items.first()
    }

    fun findCurrentContents(currentMillisecond: Long, intervalEndTimeInMillis: Long): List<Content> {

        // Define a projection that specifies which columns from the database
        // you will actually use after this query.
        val projection = getAllBaseDateColumns()

        val selection = "${ContentContract.ContentEntry.COLUMN_CONTENT_ACTIVE} = ?" +
                " AND ${ContentContract.ContentEntry.COLUMN_CONTENT_START_DATE} <= ?" +
                " AND ${ContentContract.ContentEntry.COLUMN_CONTENT_END_DATE} > ?"
        val selectionArgs = arrayOf(
            ACTIVE_YES.toString(),
            currentMillisecond.toString(),
            intervalEndTimeInMillis.toString()
        )

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
                        getLong(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_ID_FROM_SERVER)),
                        getString(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_NAME)),
                        getString(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_LOCAL_PATH)),
                        getString(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_URL)),
                        getString(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_TYPE)),
                        getString(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_TEXT)),
                        getLong(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_START_DATE)),
                        getLong(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_END_DATE)),
                        getString(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_CRON)),
                        getLong(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_DURATION)),
                        getInt(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_ACTIVE))
                    )
                )
            }
        }
        cursor.close()

        return items
    }

    fun findLocalPathActiveContents(): List<String> {

        val projection = arrayOf(
            ContentContract.ContentEntry.COLUMN_CONTENT_LOCAL_PATH
        )

        val selection = "${ContentContract.ContentEntry.COLUMN_CONTENT_ACTIVE} = ?"
        val selectionArgs = arrayOf(ACTIVE_YES.toString())

        val cursor = contentDbHelper.readableDatabase.query(
            ContentContract.ContentEntry.TABLE_NAME,   // The table to query
            projection,             // The array of columns to return (pass null to get all)
            selection,              // The columns for the WHERE clause
            selectionArgs,          // The values for the WHERE clause
            null,                   // don't group the rows
            null,                   // don't filter by row groups
            null               // The sort order
        )

        val items = mutableListOf<String>()
        with(cursor) {
            while (moveToNext()) {
                items.add(getString(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_LOCAL_PATH)))
            }
        }
        cursor.close()

        return items
    }

    fun findExpiredContents(): List<Content> {

        val projection = getAllBaseDateColumns()

        val selection = "${ContentContract.ContentEntry.COLUMN_CONTENT_ACTIVE} = ?" +
                "AND ${ContentContract.ContentEntry.COLUMN_CONTENT_END_DATE} < ?"
        val selectionArgs = arrayOf(ACTIVE_YES.toString(),
            localDateTimeToMillis(LocalDateTime.now()).toString())

        val cursor = contentDbHelper.readableDatabase.query(
            ContentContract.ContentEntry.TABLE_NAME,   // The table to query
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
                        getLong(getColumnIndexOrThrow(BaseColumns._ID)),
                        getLong(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_ID_FROM_SERVER)),
                        getString(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_NAME)),
                        getString(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_LOCAL_PATH)),
                        getString(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_URL)),
                        getString(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_TYPE)),
                        getString(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_TEXT)),
                        getLong(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_START_DATE)),
                        getLong(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_END_DATE)),
                        getString(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_CRON)),
                        getLong(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_DURATION)),
                        getInt(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_ACTIVE))
                    )
                )
            }
        }
        cursor.close()

        return items
    }

    fun findInactiveContents(): List<Content> {

        val projection = getAllBaseDateColumns()

        val selection = "${ContentContract.ContentEntry.COLUMN_CONTENT_ACTIVE} = ?"
        val selectionArgs = arrayOf(ACTIVE_NO.toString())

        val cursor = contentDbHelper.readableDatabase.query(
            ContentContract.ContentEntry.TABLE_NAME,   // The table to query
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
                        getLong(getColumnIndexOrThrow(BaseColumns._ID)),
                        getLong(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_ID_FROM_SERVER)),
                        getString(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_NAME)),
                        getString(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_LOCAL_PATH)),
                        getString(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_URL)),
                        getString(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_TYPE)),
                        getString(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_TEXT)),
                        getLong(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_START_DATE)),
                        getLong(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_END_DATE)),
                        getString(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_CRON)),
                        getLong(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_DURATION)),
                        getInt(getColumnIndexOrThrow(ContentContract.ContentEntry.COLUMN_CONTENT_ACTIVE))
                    )
                )
            }
        }
        cursor.close()

        return items
    }

    private fun getAllBaseDateColumns(): Array<String> {
        return arrayOf(
            BaseColumns._ID,
            ContentContract.ContentEntry.COLUMN_CONTENT_ID_FROM_SERVER,
            ContentContract.ContentEntry.COLUMN_CONTENT_NAME,
            ContentContract.ContentEntry.COLUMN_CONTENT_LOCAL_PATH,
            ContentContract.ContentEntry.COLUMN_CONTENT_URL,
            ContentContract.ContentEntry.COLUMN_CONTENT_TYPE,
            ContentContract.ContentEntry.COLUMN_CONTENT_TEXT,
            ContentContract.ContentEntry.COLUMN_CONTENT_START_DATE,
            ContentContract.ContentEntry.COLUMN_CONTENT_END_DATE,
            ContentContract.ContentEntry.COLUMN_CONTENT_CRON,
            ContentContract.ContentEntry.COLUMN_CONTENT_DURATION,
            ContentContract.ContentEntry.COLUMN_CONTENT_ACTIVE
        )
    }

    companion object {
        const val TAG = "[ContentDbService]"
    }

}
