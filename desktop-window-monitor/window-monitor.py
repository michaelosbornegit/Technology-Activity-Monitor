import os
import sys
import time
import requests
import pynput
import datetime
from dotenv import load_dotenv

load_dotenv()

hostMachine = "Unsupported"

if sys.platform == "darwin":
    hostMachine = "MAC"
    from AppKit import NSWorkspace
    from Quartz import (
        CGWindowListCopyWindowInfo,
        kCGWindowListOptionOnScreenOnly,
        kCGNullWindowID
    )
elif sys.platform == "win32":
    hostMachine = "WINDOWS"
    import psutil
    import win32process, win32gui

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
    elif sys.platform == "win32":
        window = win32gui.GetForegroundWindow()
        _,pid = win32process.GetWindowThreadProcessId(window)
        process = psutil.Process(pid)
        process_name = process.name().removesuffix(".exe")
        process_name = process_name[0].upper() + process_name[1:]
        # Code for more specific window titles, keep in case I want more detailed info
        # windowName = win32gui.GetWindowText(window)
        # print(windowName)
        # windowName = win32gui.GetWindowText(window).split(' - ').pop().strip()
        # if (windowName == ''):
        #     windowName = 'System'
        return process_name


counter = 0
activityCounter = 0
activeWindows = {}
startDate = datetime.datetime.utcnow().isoformat()

# Collect events until released
with pynput.keyboard.Listener(on_press=on_press) as keyboardListener, pynput.mouse.Listener(on_scroll=on_scroll, on_move=on_move) as mouseListener:
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
            endCollectionDate = datetime.datetime.utcnow().isoformat()
            for window in activeWindows:
                if activeWindows[window] and window:
                    sessions.append({
                        'hostMachine': hostMachine,
                        'application': window,
                        'startCollectionDate': startDate,
                        'endCollectionDate': endCollectionDate, 
                        'openTimeSeconds': activeWindows[window]
                })
            print({'sessions': sessions})
            apiHost = os.getenv('API_HOST')
            if not apiHost:
                raise Exception("env file not valid or not provided")
            try:
                r = requests.post(f'{apiHost}/session/desktop', json={'sessions': sessions})
            except requests.exceptions.RequestException as e:
                print(e)
            # If there is a second api host specified, upload there too for local testing
            apiHost2 = os.getenv('API_HOST2')
            if apiHost2:
                try:
                    r = requests.post(f'{apiHost2}/session/desktop', json={'sessions': sessions})
                except requests.exceptions.RequestException as e:
                    print(e)
            startDate = datetime.datetime.utcnow().isoformat()
            activeWindows.clear()
            counter = 0
        pressed = False
        time.sleep(1)