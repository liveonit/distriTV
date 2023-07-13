package com.distritv.data

import android.provider.BaseColumns

object DBContract {
    object ContentEntry : BaseColumns {
        const val TABLE_NAME = "content"
        const val COLUMN_CONTENT_ID_FROM_SERVER = "id_from_server"
        const val COLUMN_CONTENT_NAME = "name"
        const val COLUMN_CONTENT_FILE_NAME = "file_name"
        const val COLUMN_CONTENT_URL = "url"
        const val COLUMN_CONTENT_TYPE = "type"
        const val COLUMN_CONTENT_TEXT = "text"
        const val COLUMN_CONTENT_DURATION = "duration_in_seconds"
    }

    object ScheduleEntry : BaseColumns {
        const val TABLE_NAME = "schedule"
        const val COLUMN_SCHEDULE_ID_FROM_SERVER = "id_from_server"
        const val COLUMN_SCHEDULE_CONTENT_ID = "contend_id"
        const val COLUMN_SCHEDULE_START_DATE = "start_date_in_millis"
        const val COLUMN_SCHEDULE_END_DATE = "end_date_in_millis"
        const val COLUMN_SCHEDULE_CRON = "cron"
        const val COLUMN_SCHEDULE_PLAY_ONCE = "play_once"
    }
}