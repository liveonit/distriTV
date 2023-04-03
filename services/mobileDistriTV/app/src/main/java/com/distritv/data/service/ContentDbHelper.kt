package com.distritv.data.service

import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper
import android.provider.BaseColumns
import com.distritv.data.ContentContract

private const val SQL_CREATE_ENTRIES =
    "CREATE TABLE ${ContentContract.ContentEntry.TABLE_NAME} (" +
            "${BaseColumns._ID} INTEGER PRIMARY KEY AUTOINCREMENT," +
            "${ContentContract.ContentEntry.COLUMN_CONTENT_NAME} TEXT," +
            "${ContentContract.ContentEntry.COLUMN_CONTENT_LOCAL_PATH} TEXT," +
            "${ContentContract.ContentEntry.COLUMN_CONTENT_URL} TEXT," +
            "${ContentContract.ContentEntry.COLUMN_CONTENT_TYPE} TEXT," +
            "${ContentContract.ContentEntry.COLUMN_CONTENT_TEXT} TEXT)"

private const val SQL_DELETE_ENTRIES = "DROP TABLE IF EXISTS ${ContentContract.ContentEntry.TABLE_NAME}"

class ContentDbHelper(context: Context) :
    SQLiteOpenHelper(context, DATABASE_NAME, null, DATABASE_VERSION) {

    override fun onCreate(db: SQLiteDatabase) {
        db.execSQL(SQL_CREATE_ENTRIES)
    }

    override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
        // This database is only a cache for online data, so its upgrade policy is
        // to simply to discard the data and start over
        db.execSQL(SQL_DELETE_ENTRIES)
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