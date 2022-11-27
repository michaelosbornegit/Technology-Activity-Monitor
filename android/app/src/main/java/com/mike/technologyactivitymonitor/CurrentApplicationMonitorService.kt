package com.mike.technologyactivitymonitor

import android.accessibilityservice.AccessibilityService
import android.accessibilityservice.AccessibilityServiceInfo
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import android.util.Log
import android.view.accessibility.AccessibilityEvent
import com.android.volley.Request
import com.android.volley.Response
import com.android.volley.toolbox.JsonObjectRequest
import com.android.volley.toolbox.StringRequest
import com.android.volley.toolbox.Volley
import org.json.JSONArray
import org.json.JSONObject
import java.nio.charset.Charset
import java.time.Instant
import kotlin.concurrent.thread
import kotlin.math.log


class CurrentApplicationMonitorService : AccessibilityService() {
    val notificationInterval = 120
    val sleepTimer = 1
    var currentApplicationName = ""
    var screenLocked = false
    var recordingPaused = false


    override fun onServiceConnected() {
        super.onServiceConnected()

        val info = AccessibilityServiceInfo()
        info.apply {
            eventTypes = AccessibilityEvent.TYPES_ALL_MASK
            notificationTimeout = 100
        }

        this.serviceInfo = info

        var counter = 0
        var awayCounter = 0
        val activeApplications = LinkedHashMap<String, Int>()
        var startDate = Instant.now().toString()
        thread {
            while (true) {
                try {
                if (recordingPaused == false) {
//                    Log.d("CURRENTACTIVITY", currentApplicationName)
//                    Log.d("CURRENTACTIVITY", counter.toString())
//                    Log.d("CURRENTACTIVITY", awayCounter.toString())
//                    Log.d("CURRENTACTIVITY", activeApplications.toString())
                    counter++
                    if (screenLocked) {
                        awayCounter++
                        // Ensure activity before the lock screen was pressed is recorded
                        // by waiting longer than the notification interval
                        if (awayCounter > notificationInterval) {
                            counter = 0
                            awayCounter = 0
                            activeApplications.clear()
                            recordingPaused = true
                            continue
                        }
                    } else {
                        // If any app other than system ui is open, screen must be unlocked
                        recordingPaused = false
                        awayCounter = 0
                    }

                    if (!screenLocked) {
                        activeApplications[currentApplicationName] =
                            activeApplications.getOrDefault(currentApplicationName, 0) + sleepTimer
                    }
                    if (counter >= notificationInterval) {
                        postSessionActivity(activeApplications, startDate)
                        startDate = Instant.now().toString()
                        activeApplications.clear()
                        counter = 0
                    }
                }
                    } catch (e: Exception) {
                                        Log.e("CURRENTACTIVITY", e.toString())
                    }
                Thread.sleep((sleepTimer * 1000).toLong())
            }
        }
    }

    override fun onAccessibilityEvent(accessibilityEvent: AccessibilityEvent) {
        if (accessibilityEvent.eventType == AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) {
            val packageManager = applicationContext.packageManager
            val applicationInfo: ApplicationInfo? = try {
                packageManager.getApplicationInfo(
                    accessibilityEvent.packageName.toString(),
                    PackageManager.GET_META_DATA
                )
            } catch (e: PackageManager.NameNotFoundException) {
                null
            }
            val applicationName =
                (if (applicationInfo != null) packageManager.getApplicationLabel(applicationInfo) else "(unknown)") as String

            if ((accessibilityEvent.contentDescription != null
                        && accessibilityEvent.contentDescription.toString() == "Fingerprint sensor")
                || accessibilityEvent.text.toString().startsWith("[Lock screen.")
            ) {
                screenLocked = true
            } else {
                screenLocked = false
                recordingPaused = false
            }


            if (applicationName != "Gboard" && applicationName != "" && applicationName != "System UI") {
//                Log.d("CURRENTACTIVITY", applicationName)
//                Log.d("CurrentActivity", "$accessibilityEvent")
                currentApplicationName = applicationName
            }

        }
    }

    private fun postSessionActivity(activityMap: LinkedHashMap<String, Int>, startDate: String) {
        // TODO add failure recovery
        val endDate = Instant.now().toString()
        var sessions = JSONArray()

        for (app in activityMap.keys) {
            val jsonBody = JSONObject()
            jsonBody.put("hostMachine", "ANDROID")
            jsonBody.put("application", app)
            jsonBody.put("startCollectionDate", startDate)
            jsonBody.put("endCollectionDate", endDate)
            jsonBody.put("openTimeSeconds", activityMap.get(app))
            sessions.put(jsonBody)
        }

        val finalJsonBody = JSONObject().put("sessions", sessions)

        Log.d("CURRENTACTIVITY", finalJsonBody.toString())

        val requestBody = finalJsonBody.toString()
        val queue = Volley.newRequestQueue(this)
        val url = "https://tam-server.michaelosborne.dev/session/desktop"

        val jsonRequest: JsonObjectRequest =
            object : JsonObjectRequest(
                Method.POST, url, finalJsonBody,
                Response.Listener { response ->
                    // response
                    val strResponse = response.toString()
                    Log.d("API", strResponse)
                },
                Response.ErrorListener { error ->
                    Log.d("API", "error => $error")
                }
            ) {
                override fun getBody(): ByteArray {
                    return requestBody.toByteArray(Charset.defaultCharset())
                }
            }
        queue.add(jsonRequest)
    }

    override fun onInterrupt() {
        TODO("Not yet implemented")
    }
}