package com.distritv.data.model

data class Television(
    val schedules: List<Schedule>,
    val alert: Alert?,
    val label: List<Label>?
)
