package com.distritv.utils

import android.app.Activity
import android.content.Intent
import android.util.Log
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentManager
import com.distritv.DistriTVApp
import com.distritv.ui.home.HomeActivity

fun FragmentManager.addFragment(
    containerId: Int,
    fragment: Fragment,
    addToBackStack: Boolean = false,
    addToBackStackName: String? = null
) {
    beginTransaction().apply {
        add(containerId, fragment)
        if (addToBackStack)
            addToBackStack(addToBackStackName)
        commit()
    }
}

fun FragmentManager.replaceFragment(
    containerId: Int,
    fragment: Fragment,
    addToBackStack: Boolean = false,
    addToBackStackName: String? = null
) {
    beginTransaction().apply {
        replace(containerId, fragment)
        if (addToBackStack)
            addToBackStack(addToBackStackName)
        commit()
    }
}

fun FragmentManager.removeFragment(fragment: Fragment) {
    beginTransaction().apply {
        remove(fragment)
        commit()
    }
}

fun Fragment.onAfterCompletionContent(tag: String) {
    this.onAfterCompletionContent(tag, null)
}

fun Fragment.onAfterCompletionAlert(tag: String) {
    this.onAfterCompletionAlert(tag, null)
}

fun Fragment.onAfterCompletionContent(tag: String, contentId: Long?) {
    val application: DistriTVApp? =
        (context?.applicationContext as DistriTVApp?)

    // Notice that the content has finished playing:
    application?.setIfAnyContentIsCurrentlyPlaying(false)
    // Clear the identifier of the content that was playing:
    application?.setCurrentlyPlayingContentId(null)

    onAfterCompletion(tag, contentId, application)
}

fun Fragment.onAfterCompletionAlert(tag: String, contentId: Long?) {
    val application: DistriTVApp? =
        (context?.applicationContext as DistriTVApp?)

    // Notice that the content has finished playing:
    application?.setIfAnyAlertIsCurrentlyPlaying(false)
    // Clear the identifier of the content that was playing:
    application?.setCurrentlyPlayingAlertId(null)

    onAfterCompletion(tag, contentId, application)
}

private fun Fragment.onAfterCompletion(tag: String, contentId: Long?, application: DistriTVApp?) {

    val currentActivity: Activity? = application?.getCurrentActivity()
    if (currentActivity != null && currentActivity !is HomeActivity) {
        val intent = Intent(context, HomeActivity::class.java)
        context?.startActivity(intent)
        activity?.finish()
        Log.i(tag, "Playback finished, coming home... Content id: $contentId")
    } else {
        Log.i(tag, "Playback finished. Content id: $contentId")
    }
}

fun Fragment.backHomeOnResume() {
    // If the view is created: back home after end of the duration
    val isPlaying =
        (context?.applicationContext as DistriTVApp?)?.isContentCurrentlyPlaying() ?: false

    if (!isPlaying) {
        val intent = Intent(context, HomeActivity::class.java)
        context?.startActivity(intent)
        activity?.finish()
    }
}

fun Fragment.backHomeOnResumeAlert() {
    // If the view is created: back home after end of the duration
    val isPlaying =
        (context?.applicationContext as DistriTVApp?)?.isAlertCurrentlyPlaying() ?: false

    if (!isPlaying) {
        val intent = Intent(context, HomeActivity::class.java)
        context?.startActivity(intent)
        activity?.finish()
    }
}

fun Fragment.setAlertDurationLeft(durationLeft: Long) {
    val application: DistriTVApp? =
        (context?.applicationContext as DistriTVApp?)

    application?.setAlertDurationLeft(durationLeft)
}
