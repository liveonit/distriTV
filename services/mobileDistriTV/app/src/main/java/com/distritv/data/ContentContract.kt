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
        const val COLUMN_CONTENT_ACTIVE = "active"
        const val COLUMN_CONTENT_START_DATE = "start_date_in_millis"
        const val COLUMN_CONTENT_END_DATE = "end_date_in_millis"
        const val COLUMN_CONTENT_CRON = "cron"
        const val COLUMN_CONTENT_DURATION = "duration_in_seconds"
    }
}