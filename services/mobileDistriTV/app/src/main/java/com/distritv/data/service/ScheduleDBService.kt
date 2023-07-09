package com.distritv.data.service

import android.content.ContentValues
import com.distritv.data.DBContract
import com.distritv.data.helper.DBHelper
import com.distritv.data.model.Schedule
import com.distritv.utils.*
import java.time.LocalDateTime


class ScheduleDBService(private val dbHelper: DBHelper) {

    fun insert(schedule: Schedule): Long {
        // Create a new map of values, where column names are the keys
        val values = ContentValues().apply {
            put(DBContract.ScheduleEntry.COLUMN_SCHEDULE_ID_FROM_SERVER, schedule.id)
            put(DBContract.ScheduleEntry.COLUMN_SCHEDULE_CONTENT_ID, schedule.contentId)
            put(DBContract.ScheduleEntry.COLUMN_SCHEDULE_START_DATE, schedule.startDate)
            put(DBContract.ScheduleEntry.COLUMN_SCHEDULE_END_DATE, schedule.endDate)
            put(DBContract.ScheduleEntry.COLUMN_SCHEDULE_CRON, schedule.cron)
        }

        // Insert the new row, returning the primary key value of the new row
        val newRowId = dbHelper.writableDatabase.insert(DBContract.ScheduleEntry.TABLE_NAME, null, values)

        return newRowId ?: -1
    }

    fun update(id: Long, schedule: Schedule): Int {
        val values = ContentValues().apply {
            put(DBContract.ScheduleEntry.COLUMN_SCHEDULE_ID_FROM_SERVER, schedule.id)
            put(DBContract.ScheduleEntry.COLUMN_SCHEDULE_CONTENT_ID, schedule.contentId)
            put(DBContract.ScheduleEntry.COLUMN_SCHEDULE_START_DATE, schedule.startDate)
            put(DBContract.ScheduleEntry.COLUMN_SCHEDULE_END_DATE, schedule.endDate)
            put(DBContract.ScheduleEntry.COLUMN_SCHEDULE_CRON, schedule.cron)
        }

        // Which row to update, based on the title
        val selection = "${DBContract.ScheduleEntry.COLUMN_SCHEDULE_ID_FROM_SERVER} = ?"
        val selectionArgs = arrayOf(id.toString())

        return dbHelper.writableDatabase.update(
            DBContract.ScheduleEntry.TABLE_NAME,
            values,
            selection,
            selectionArgs
        )
    }

    fun delete(id: Long): Int {
        val selection = "${DBContract.ScheduleEntry.COLUMN_SCHEDULE_ID_FROM_SERVER} = ?"
        val selectionArgs = arrayOf(id.toString())

        return dbHelper.writableDatabase.delete(
            DBContract.ScheduleEntry.TABLE_NAME,
            selection,
            selectionArgs
        )
    }

    fun findAllSchedules(): MutableList<Schedule> {
        // Define a projection that specifies which columns from the database
        // you will actually use after this query.
        val projection = getAllBaseDateColumns()

        val cursor = dbHelper.readableDatabase.query(
            DBContract.ScheduleEntry.TABLE_NAME,   // The table to query
            projection,             // The array of columns to return (pass null to get all)
            null,              // The columns for the WHERE clause
            null,          // The values for the WHERE clause
            null,                   // don't group the rows
            null,                   // don't filter by row groups
            null               // The sort order
        )

        val items = mutableListOf<Schedule>()
        with(cursor) {
            while (moveToNext()) {
                items.add(
                    Schedule(
                        getLong(getColumnIndexOrThrow(DBContract.ScheduleEntry.COLUMN_SCHEDULE_ID_FROM_SERVER)),
                        getLong(getColumnIndexOrThrow(DBContract.ScheduleEntry.COLUMN_SCHEDULE_CONTENT_ID)),
                        getLong(getColumnIndexOrThrow(DBContract.ScheduleEntry.COLUMN_SCHEDULE_START_DATE)),
                        getLong(getColumnIndexOrThrow(DBContract.ScheduleEntry.COLUMN_SCHEDULE_END_DATE)),
                        getString(getColumnIndexOrThrow(DBContract.ScheduleEntry.COLUMN_SCHEDULE_CRON)),
                        null
                    )
                )
            }
        }
        cursor.close()
        return items
    }

    fun findByScheduleId(id: Long): Schedule {
        // Define a projection that specifies which columns from the database
        // you will actually use after this query.
        val projection = getAllBaseDateColumns()

        // Filter results WHERE "_id" = 'id'
        val selection = "${DBContract.ScheduleEntry.COLUMN_SCHEDULE_ID_FROM_SERVER} = ?"
        val selectionArgs = arrayOf(id.toString())

        // How you want the results sorted in the resulting Cursor
        val sortOrder = "${DBContract.ScheduleEntry.COLUMN_SCHEDULE_START_DATE} ASC"

        val cursor = dbHelper.readableDatabase.query(
            DBContract.ScheduleEntry.TABLE_NAME,   // The table to query
            projection,             // The array of columns to return (pass null to get all)
            selection,              // The columns for the WHERE clause
            selectionArgs,          // The values for the WHERE clause
            null,                   // don't group the rows
            null,                   // don't filter by row groups
            sortOrder               // The sort order
        )

        val items = mutableListOf<Schedule>()
        with(cursor) {
            while (moveToNext()) {
                items.add(
                    Schedule(
                        getLong(getColumnIndexOrThrow(DBContract.ScheduleEntry.COLUMN_SCHEDULE_ID_FROM_SERVER)),
                        getLong(getColumnIndexOrThrow(DBContract.ScheduleEntry.COLUMN_SCHEDULE_CONTENT_ID)),
                        getLong(getColumnIndexOrThrow(DBContract.ScheduleEntry.COLUMN_SCHEDULE_START_DATE)),
                        getLong(getColumnIndexOrThrow(DBContract.ScheduleEntry.COLUMN_SCHEDULE_END_DATE)),
                        getString(getColumnIndexOrThrow(DBContract.ScheduleEntry.COLUMN_SCHEDULE_CRON)),
                        null
                    )
                )
            }
        }
        cursor.close()

        return items.first()
    }

    fun findCurrentSchedules(currentMillisecond: Long, intervalEndTimeInMillis: Long): List<Schedule> {

        // Define a projection that specifies which columns from the database
        // you will actually use after this query.
        val projection = getAllBaseDateColumns()

        val selection = "${DBContract.ScheduleEntry.COLUMN_SCHEDULE_START_DATE} <= ?" +
                " AND ${DBContract.ScheduleEntry.COLUMN_SCHEDULE_END_DATE} > ?"
        val selectionArgs = arrayOf(
            currentMillisecond.toString(),
            intervalEndTimeInMillis.toString()
        )

        // How you want the results sorted in the resulting Cursor
        val sortOrder = "${DBContract.ScheduleEntry.COLUMN_SCHEDULE_START_DATE} ASC"

        val cursor = dbHelper.readableDatabase.query(
            DBContract.ScheduleEntry.TABLE_NAME,   // The table to query
            projection,             // The array of columns to return (pass null to get all)
            selection,              // The columns for the WHERE clause
            selectionArgs,          // The values for the WHERE clause
            null,                   // don't group the rows
            null,                   // don't filter by row groups
            sortOrder               // The sort order
        )

        val items = mutableListOf<Schedule>()
        with(cursor) {
            while (moveToNext()) {
                items.add(
                    Schedule(
                        getLong(getColumnIndexOrThrow(DBContract.ScheduleEntry.COLUMN_SCHEDULE_ID_FROM_SERVER)),
                        getLong(getColumnIndexOrThrow(DBContract.ScheduleEntry.COLUMN_SCHEDULE_CONTENT_ID)),
                        getLong(getColumnIndexOrThrow(DBContract.ScheduleEntry.COLUMN_SCHEDULE_START_DATE)),
                        getLong(getColumnIndexOrThrow(DBContract.ScheduleEntry.COLUMN_SCHEDULE_END_DATE)),
                        getString(getColumnIndexOrThrow(DBContract.ScheduleEntry.COLUMN_SCHEDULE_CRON)),
                        null
                    )
                )
            }
        }
        cursor.close()

        return items
    }

    fun findExpiredSchedules(): List<Schedule> {

        val projection = getAllBaseDateColumns()

        val selection = "${DBContract.ScheduleEntry.COLUMN_SCHEDULE_END_DATE} < ?"
        val selectionArgs = arrayOf(localDateTimeToMillis(LocalDateTime.now()).toString())

        val cursor = dbHelper.readableDatabase.query(
            DBContract.ScheduleEntry.TABLE_NAME,   // The table to query
            projection,             // The array of columns to return (pass null to get all)
            selection,              // The columns for the WHERE clause
            selectionArgs,          // The values for the WHERE clause
            null,                   // don't group the rows
            null,                   // don't filter by row groups
            null               // The sort order
        )

        val items = mutableListOf<Schedule>()
        with(cursor) {
            while (moveToNext()) {
                items.add(
                    Schedule(
                        getLong(getColumnIndexOrThrow(DBContract.ScheduleEntry.COLUMN_SCHEDULE_ID_FROM_SERVER)),
                        getLong(getColumnIndexOrThrow(DBContract.ScheduleEntry.COLUMN_SCHEDULE_CONTENT_ID)),
                        getLong(getColumnIndexOrThrow(DBContract.ScheduleEntry.COLUMN_SCHEDULE_START_DATE)),
                        getLong(getColumnIndexOrThrow(DBContract.ScheduleEntry.COLUMN_SCHEDULE_END_DATE)),
                        getString(getColumnIndexOrThrow(DBContract.ScheduleEntry.COLUMN_SCHEDULE_CRON)),
                        null
                    )
                )
            }
        }
        cursor.close()

        return items
    }

    fun existsScheduleWithContentId(id: Long): Boolean {
        val projection = getAllBaseDateColumns()

        val selection = "${DBContract.ScheduleEntry.COLUMN_SCHEDULE_CONTENT_ID} = ?"
        val selectionArgs = arrayOf(id.toString())
        val limit = "1"

        val cursor = dbHelper.readableDatabase.query(
            DBContract.ScheduleEntry.TABLE_NAME,   // The table to query
            projection,             // The array of columns to return (pass null to get all)
            selection,              // The columns for the WHERE clause
            selectionArgs,          // The values for the WHERE clause
            null,           // don't group the rows
            null,            // don't filter by row groups
            null,           // The sort order
            limit                   // Limit
        )

        if(cursor.count <= 0) {
            cursor.close()
            return false
        }

        cursor.close()
        return true
    }

    private fun getAllBaseDateColumns(): Array<String> {
        return arrayOf(
            DBContract.ScheduleEntry.COLUMN_SCHEDULE_ID_FROM_SERVER,
            DBContract.ScheduleEntry.COLUMN_SCHEDULE_CONTENT_ID,
            DBContract.ScheduleEntry.COLUMN_SCHEDULE_START_DATE,
            DBContract.ScheduleEntry.COLUMN_SCHEDULE_END_DATE,
            DBContract.ScheduleEntry.COLUMN_SCHEDULE_CRON
        )
    }

    companion object {
        const val TAG = "[ScheduleDBService]"
    }

}
