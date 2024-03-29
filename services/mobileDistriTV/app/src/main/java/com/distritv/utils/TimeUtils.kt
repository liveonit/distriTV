package com.distritv.utils

import com.google.gson.*
import java.lang.reflect.Type
import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneId
import java.time.ZoneOffset
import java.time.format.DateTimeFormatter
import java.util.*

const val DATE_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"

/**
 * Conversion from LocalDateTime to milliseconds
 */
fun localDateTimeToMillis(localDateTime: LocalDateTime?, offset: ZoneOffset = ZoneOffset.UTC): Long? {
    if (localDateTime != null) {
        return localDateTime.atZone(
            offset
        )?.toInstant()?.toEpochMilli()
    }
    return null
}

/**
 * Conversion from milliseconds to DateTime
 */
fun millisToLocalDateTime(milliseconds: Long): LocalDateTime? {
    return LocalDateTime.ofInstant(
        milliseconds?.let { Instant.ofEpochMilli(it) },
        ZoneOffset.UTC
    )
}

/**
 * Conversion from LocalDateTime to Date
 */
fun localDateTimeToDate(localDateTime: LocalDateTime): Date {
    return Date.from(localDateTime.atZone(ZoneId.systemDefault()).toInstant())
}

/**
 * Conversion from Date to LocalDateTime
 */
fun dateToLocalDateTime(date: Date): LocalDateTime {
    return LocalDateTime.ofInstant(date.toInstant(), ZoneId.systemDefault())
}

/**
 * Conversion from milliseconds to Date
 */
fun millisToDate(milliseconds: Long): Date? {
    val localDateTime = millisToLocalDateTime(milliseconds)
    return localDateTime?.let { localDateTimeToDate(it) }
}

/**
 * Conversion from Date to milliseconds
 */
fun dateToMillis(date: Date): Long? {
    val localDateTime = dateToLocalDateTime(date)
    return localDateTimeToMillis(localDateTime)
}

fun getCurrentTime(): String {
    val formatter = DateTimeFormatter.ofPattern(DATE_FORMAT)
    return LocalDateTime.now().format(formatter)
}

class LocalDateTimeDeserializer : JsonDeserializer<LocalDateTime> {
    override fun deserialize(
        json: JsonElement?,
        typeOfT: Type?,
        context: JsonDeserializationContext?
    ): LocalDateTime {
        val formatter = DateTimeFormatter.ofPattern(DATE_FORMAT)
        val dateString = json?.asString
        return LocalDateTime.parse(dateString, formatter)
    }
}