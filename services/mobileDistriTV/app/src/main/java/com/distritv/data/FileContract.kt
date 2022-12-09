package com.distritv.data

import android.provider.BaseColumns

object FileContract {
    object FileEntry : BaseColumns {
        const val TABLE_NAME = "file"
        const val COLUMN_FILE_NAME = "file_name"
        const val COLUMN_FILE_LOCAL_PATH = "local_path"
        const val COLUMN_FILE_URL = "file_url"
        const val COLUMN_FILE_CONTENT_TYPE = "content_type" //V = Video, I = Image, T = Text
    }
}