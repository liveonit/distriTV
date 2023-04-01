package com.distritv.data

import android.provider.BaseColumns

object ContentContract {
    object ContentEntry : BaseColumns {
        const val TABLE_NAME = "content"
        const val COLUMN_CONTENT_ID_FROM_SERVER = "id_from_server"
        const val COLUMN_CONTENT_NAME = "name"
        const val COLUMN_CONTENT_LOCAL_PATH = "local_path"
        const val COLUMN_CONTENT_URL = "url"
        const val COLUMN_CONTENT_TYPE = "type"
    }
}