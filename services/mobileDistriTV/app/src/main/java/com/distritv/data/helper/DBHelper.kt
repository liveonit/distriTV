package com.distritv.data.helper

import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper
import com.distritv.data.DBContract

private const val SQL_CREATE_CONTENT_ENTRIES =
    "CREATE TABLE ${DBContract.ContentEntry.TABLE_NAME} (" +
            "${DBContract.ContentEntry.COLUMN_CONTENT_ID_FROM_SERVER} LONG UNIQUE," +
            "${DBContract.ContentEntry.COLUMN_CONTENT_NAME} TEXT," +
            "${DBContract.ContentEntry.COLUMN_CONTENT_FILE_NAME} TEXT," +
            "${DBContract.ContentEntry.COLUMN_CONTENT_URL} TEXT," +
            "${DBContract.ContentEntry.COLUMN_CONTENT_TYPE} TEXT," +
            "${DBContract.ContentEntry.COLUMN_CONTENT_TEXT} TEXT," +
            "${DBContract.ContentEntry.COLUMN_CONTENT_DURATION} LONG)"

private const val SQL_CREATE_SCHEDULE_ENTRIES =
    "CREATE TABLE ${DBContract.ScheduleEntry.TABLE_NAME} (" +
            "${DBContract.ScheduleEntry.COLUMN_SCHEDULE_ID_FROM_SERVER} LONG UNIQUE," +
            "${DBContract.ScheduleEntry.COLUMN_SCHEDULE_CONTENT_ID} LONG," +
            "${DBContract.ScheduleEntry.COLUMN_SCHEDULE_START_DATE} LONG," +
            "${DBContract.ScheduleEntry.COLUMN_SCHEDULE_END_DATE} LONG," +
            "${DBContract.ScheduleEntry.COLUMN_SCHEDULE_CRON} TEXT)"

private const val SQL_DELETE_CONTENT_ENTRIES = "DROP TABLE IF EXISTS ${DBContract.ContentEntry.TABLE_NAME}"
private const val SQL_DELETE_SCHEDULE_ENTRIES = "DROP TABLE IF EXISTS ${DBContract.ScheduleEntry.TABLE_NAME}"

class DBHelper(context: Context) :
    SQLiteOpenHelper(context, DATABASE_NAME, null, DATABASE_VERSION) {

    override fun onCreate(db: SQLiteDatabase) {
        db.execSQL(SQL_CREATE_CONTENT_ENTRIES)
        db.execSQL(SQL_CREATE_SCHEDULE_ENTRIES)
    }

    override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
        // This database is only a cache for online data, so its upgrade policy is
        // to simply to discard the data and start over
        db.execSQL(SQL_DELETE_CONTENT_ENTRIES)
        db.execSQL(SQL_DELETE_SCHEDULE_ENTRIES)
        onCreate(db)
    }

    override fun onDowngrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
        onUpgrade(db, oldVersion, newVersion)
    }

    companion object {
        // If you change the database schema, you must increment the database version.
        const val DATABASE_VERSION = 1
        const val DATABASE_NAME = "DistriTV.db"
    }

}