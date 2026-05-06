// timer.js
import { WORK_TIME, SHORT_BREAK_TIME, LONG_BREAK_TIME, SESSION_TYPES } from './constants.js';

// Timer state
let currentTime = WORK_TIME;
let currentSession = SESSION_TYPES.WORK;
let timerId = null;
let workSessionCount = 0;

// Callbacks for UI updates (injected to avoid circular dependencies)
let onTimerUpdate = null;
let onSessionComplete = null;

export function setTimerCallbacks(updateCallback, completeCallback) {
    onTimerUpdate = updateCallback;
    onSessionComplete = completeCallback;
}

export function getCurrentTime() {
    return currentTime;
}

export function isTimerRunning() {
    return timerId !== null;
}

export function getCurrentSession() {
    return currentSession;
}

export function getWorkSessionCount() {
    return workSessionCount;
}

export function setCurrentTime(time) {
    currentTime = time;
    if (onTimerUpdate) onTimerUpdate();
}

export function setCurrentSession(session) {
    currentSession = session;
}

export function setWorkSessionCount(count) {
    workSessionCount = count;
}

export function getTimeForSession(sessionType) {
    switch(sessionType) {
        case SESSION_TYPES.WORK:
            return WORK_TIME;
        case SESSION_TYPES.SHORT_BREAK:
            return SHORT_BREAK_TIME;
        case SESSION_TYPES.LONG_BREAK:
            return LONG_BREAK_TIME;
        default:
            return WORK_TIME;
    }
}

export function stopTimer() {
    if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
    }
}

export function startTimer() {
    if (timerId !== null) return;
    
    timerId = setInterval(() => {
        if (currentTime <= 0) {
            if (onSessionComplete) onSessionComplete();
        } else {
            currentTime--;
            if (onTimerUpdate) onTimerUpdate();
        }
    }, 1000);
}

export function determineNextSession() {
    if (currentSession === SESSION_TYPES.WORK) {
        workSessionCount++;
        
        if (workSessionCount % 4 === 0) {
            return SESSION_TYPES.LONG_BREAK;
        } else {
            return SESSION_TYPES.SHORT_BREAK;
        }
    } else {
        return SESSION_TYPES.WORK;
    }
}

export function resetToCurrentSession() {
    stopTimer();
    currentTime = getTimeForSession(currentSession);
    if (onTimerUpdate) onTimerUpdate();
}

export function switchSession(sessionType) {
    currentSession = sessionType;
    currentTime = getTimeForSession(currentSession);
    if (onTimerUpdate) onTimerUpdate();
}