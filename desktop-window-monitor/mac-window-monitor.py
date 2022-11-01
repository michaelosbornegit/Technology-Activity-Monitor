import os
import sys
import time
import requests
import pynput
import datetime
from dotenv import load_dotenv

load_dotenv()

if sys.platform == "darwin":
    from AppKit import NSWorkspace
    from Quartz import (
        CGWindowListCopyWindowInfo,
        kCGWindowListOptionOnScreenOnly,
        kCGNullWindowID
    )

global pressed
pressed = False


def on_press(key):
    global pressed
    pressed = True


def on_scroll(x, y, dx, dy):
    global pressed
    pressed = True


def on_move(x, y):
    global pressed
    pressed = True

def getActiveWindowInfo():
    if sys.platform == "darwin":
        all_apps = NSWorkspace.sharedWorkspace().runningApplications()
        curr_pid = NSWorkspace.sharedWorkspace().activeApplication()[
            'NSApplicationProcessIdentifier']
        options = kCGWindowListOptionOnScreenOnly
        windowList = CGWindowListCopyWindowInfo(options, kCGNullWindowID)
        for x in windowList:
            if x['kCGWindowOwnerPID'] == curr_pid:
                return x['kCGWindowOwnerName']
            else:
                x = None
    # print(openWindow['kCGWindowOwnerName'])
    # for window in windowList:
    #     # print(window)
    #     pid = window['kCGWindowOwnerPID']
    #     windowNumber = window['kCGWindowNumber']
    #     ownerName = window['kCGWindowOwnerName']
    #     geometry = window['kCGWindowBounds']
    #     windowTitle = window.get('kCGWindowName', u'Unknown')
    #     if curr_pid == pid:
    #         print(window['kCGWindowOwnerName'])
    #         # print("%s - %s (PID: %d, WID: %d): %s" % (ownerName, windowTitle.encode('ascii','ignore'), pid, windowNumber, geometry))
    elif sys.platform == "win32":
        (active_app_name, windowTitle) = _getActiveInfo_Win32()


counter = 0
activityCounter = 0
activeWindows = {}
startDate = datetime.datetime.utcnow().isoformat()

# Collect events until released
with pynput.keyboard.Listener(on_press=on_press) as keyboardListener, pynput.mouse.Listener(on_scroll=on_scroll, on_move=on_move) as mouseListener:
    # keyboardListener.join()
    # mouseListener.join()
    while(1):
        counter += 1
        activityCounter += 1
        if pressed:
            activityCounter = 0
        currentActiveWindow = getActiveWindowInfo()
        currentWindowValue = activeWindows.setdefault(currentActiveWindow, 0)
        if activityCounter <= 10:
            activeWindows[currentActiveWindow] += 1

        if counter >= 120:
            sessions = []
            for window in activeWindows:
                if activeWindows[window] and window:
                    sessions.append({
                        'hostMachine': 'MAC',
                        'application': window,
                        'startCollectionDate': startDate,
                        'endCollectionDate': datetime.datetime.utcnow().isoformat(),
                        'openTimeSeconds': activeWindows[window]
                })
            print({'sessions': sessions})
            apiHost = os.getenv('API_HOST')
            apiPort = os.getenv('API_PORT')
            if not apiHost or not apiPort:
                raise Exception("env file not valid or not provided")
            try:
                r = requests.post(f'{apiHost}:{apiPort}/session/desktop', json={'sessions': sessions})
            except requests.exceptions.RequestException as e:
                print(e)
            startDate = datetime.datetime.utcnow().isoformat()
            activeWindows.clear()
            counter = 0
        pressed = False
        time.sleep(1)