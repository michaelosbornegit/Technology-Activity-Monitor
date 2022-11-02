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


class CurrentApplicationMonitorService : AccessibilityService() {

//    override fun onServiceConnected() {
//        super.onServiceConnected()
//
//        //Configure these here for compatibility with API 13 and below.
//        val config = AccessibilityServiceInfo()
//        config.eventTypes = AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED
//        config.feedbackType = AccessibilityServiceInfo.FEEDBACK_GENERIC
//        if (Build.VERSION.SDK_INT >= 16) //Just in case this helps
//            config.flags = AccessibilityServiceInfo.FLAG_INCLUDE_NOT_IMPORTANT_VIEWS
//        serviceInfo = config
//    }
    val notificationInterval = 120
    val sleepTimer = 1
    var currentApplicationName = ""
    var screenLocked = false

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
            while(true) {
                if (screenLocked == false || currentApplicationName != "System UI") {
//                    Log.d("CURRENTACTIVITY", currentApplicationName)
//                    Log.d("CURRENTACTIVITY", counter.toString())
//                    Log.d("CURRENTACTIVITY", awayCounter.toString())
//                    Log.d("CURRENTACTIVITY", activeApplications.toString())
                    counter++
                    if (currentApplicationName == "System UI") {
                        awayCounter++
                        // System UI was open for longer than a notification cycle
                        // Wait for another app to be switched to (the phone unlocked)
                        if (awayCounter >= notificationInterval) {
                            counter = 0
                            awayCounter = 0
                            activeApplications.clear()
                            screenLocked = true
                        }
                    } else {
                        // If any app other than system ui is open, screen must be unlocked
                        screenLocked = false
                        awayCounter = 0
                    }

                    if (currentApplicationName != "System UI") {
                        activeApplications[currentApplicationName] = activeApplications.getOrDefault(currentApplicationName, 0) + sleepTimer;
                    }
                    if (counter >= notificationInterval) {
                        postSessionActivity(activeApplications, startDate)
                        startDate = Instant.now().toString()
                        activeApplications.clear()
                        counter = 0
                    }
                }
                Thread.sleep((sleepTimer * 1000).toLong());
            }
        }
    }

    override fun onAccessibilityEvent(accessibilityEvent: AccessibilityEvent) {
        if (accessibilityEvent.eventType == AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) {
            val packageManager = applicationContext.packageManager
            val applicationInfo: ApplicationInfo? = try {
                packageManager.getApplicationInfo(accessibilityEvent.packageName.toString(), PackageManager.GET_META_DATA)
            } catch (e: PackageManager.NameNotFoundException) {
                null
            }
            val applicationName =
                (if (applicationInfo != null) packageManager.getApplicationLabel(applicationInfo) else "(unknown)") as String

            if (applicationName != "Gboard" && applicationName != "") {
//                Log.i("CurrentActivity", applicationName)
//                Log.i("CurrentActivity", "$accessibilityEvent")
                currentApplicationName = applicationName
            }

        }
    }

    private fun postSessionActivity(activityMap: LinkedHashMap<String, Int>, startDate: String) {
        val endDate = Instant.now().toString()
        var sessions = JSONArray();

        for (app in activityMap.keys) {
            val jsonBody = JSONObject();
            jsonBody.put("hostMachine", "ANDROID")
            jsonBody.put("application", app)
            jsonBody.put("startCollectionDate", startDate)
            jsonBody.put("endCollectionDate", endDate)
            jsonBody.put("openTimeSeconds", activityMap.get(app))
            sessions.put(jsonBody)
        }

        val finalJsonBody = JSONObject().put("sessions", sessions);

        Log.d("CURRENTACTIVITY", finalJsonBody.toString())

        val requestBody = finalJsonBody.toString()
        val queue = Volley.newRequestQueue(this)
        val url = "https://tam-server.michaelosborne.dev/session/desktop"

        val jsonRequest : JsonObjectRequest =
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
            ){
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