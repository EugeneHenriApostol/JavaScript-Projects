
// constants
const WORK_MIN = 25;
const SHORT_BREAK_MIN = 5;
const LONG_BREAK_MIN = 15;
const WORK_TIME = WORK_MIN * 60;
const SHORT_BREAK_TIME = SHORT_BREAK_MIN * 60;
const LONG_BREAK_TIME = LONG_BREAK_MIN * 60;

// session types
const SESSION_TYPES = {
    WORK: 'work',
    SHORT_BREAK: 'shortBreak',
    LONG_BREAK: 'longBreak'
};

// DOM elements
const timerDisplay = document.getElementById("timerDisplay");
const sessionLabel = document.getElementById("sessionTypeLabel");
const statusMessage = document.getElementById("statusMessage");
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const skipBtn = document.getElementById('skipBtn');
const sessionBadges = document.querySelectorAll('.session-badge span');

// state variables
let currentTime = WORK_TIME;
let currentSession = SESSION_TYPES.WORK; // track current session type
let isWorkSession = true;
let timerId = null;
let workSessionCount = 0; // count completed work sessions for long break

// helper functions
// Format seconds to mm:ss (with leading zeros)
function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) 
        seconds = 0;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// update timer display based on currentTime
function updateTimerUI() {
    timerDisplay.textContent = formatTime(currentTime);
}

function getTimeForSession(sessionType) {
    switch(sessionType) {
        case SESSION_TYPES.WORK:
            return WORK_TIME;
        case SESSION_TYPES.SHORT_BREAK:
            return SHORT_BREAK_TIME;
        case SESSION_TYPES.LONG_BREAK:
            return LONG_BREAK_TIME;
        default:
            WORK_TIME;
    }
}

function getStatusMessage(sessionType) {
    switch(sessionType) {
        case SESSION_TYPES.WORK:
            return "🍅 Work session! Time to focus. Press Start.";
        case SESSION_TYPES.SHORT_BREAK:
            return "☕ Short break! Take 5 minutes to relax. Press Start.";
        case SESSION_TYPES.LONG_BREAK:
            return "🍃 Long break! Take 15 minutes to recharge. Press Start.";
        default:
            return "Ready to focus!";
    }
}

// update session label and dynamic status helper
function updateSessionUI() {
    sessionBadges.forEach(badge => {
        badge.classList.remove('active');
        const badgeText = badge.textContent.toLowerCase();

        if (currentSession === SESSION_TYPES.WORK && badgeText.includes('pomodoro')) {
            badge.classList.add('active');
        } else if (currentSession === SESSION_TYPES.SHORT_BREAK && badgeText.includes('short')) {
            badge.classList.add('active');
        } else if (currentSession === SESSION_TYPES.LONG_BREAK && badgeText.includes('long')) {
            badge.classList.add('active');
        }
    });

    setStatusMessage(getStatusMessage(currentSession), false);
}

function setStatusMessage(msg, isError = false) {
    statusMessage.textContent = msg;
    statusMessage.style.opacity = '1';
    if (isError) {
        statusMessage.style.color = "#e74c3c";
        setTimeout(() => {
            if (statusMessage.textContent === msg) 
                statusMessage.style.color = "#7f8c8d";
        }, 1800);
    } else {
        statusMessage.style.color = "#7f8c8d";
    }
}

function stopTimer() {
    if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
    }
}

function startTimer() {
    if (timerId !== null)
        return;

    timerId = setInterval(() => {
        if (currentTime <= 0) {
            handleSessionComplete();
        } else {
            currentTime--;
            updateTimerUI();
        }
    }, 1000);
}

function determineNextSession() {
    if (currentSession === SESSION_TYPES.WORK) {
        workSessionCount++;

        // after 4 work sessions, take a long break 
        if(workSessionCount % 4 === 0) {
            return SESSION_TYPES.LONG_BREAK;
        } else {
            return SESSION_TYPES.SHORT_BREAK;
        }
    } else {
        // return to work after any break
        return SESSION_TYPES.WORK;
    }
}

function handleSessionComplete() {
    // stop interval first
    stopTimer();

    const completedType = isWorkSession ? "WORK" : "BREAK";
    setStatusMessage(`✅ ${completedType} session completed! Switching mode.`, false);

    // determine next session
    const nextSession = determineNextSession();

    // switch to next session
    currentSession = nextSession;
    currentTime = getTimeForSession(currentSession);


    // refresh timer and session label
    updateTimerUI();
    updateSessionUI();

    startTimer();
}

function resetTimer() {
    stopTimer();
    currentTime = getTimeForSession(currentSession);
    updateTimerUI();
    setStatusMessage(getStatusMessage(currentSession), false);
}

function skipToNextSession() {
    stopTimer();
    handleSessionComplete();
}

function switchSessionManually(sessionType) {
    if (timerId !== null) {
        const confirmSwitch = confirm(`Timer is running. Switch to ${sessionType}? Current progress will be lost.`);
        if (!confirmSwitch)
            return;
        stopTimer();
    }

    // if timer is paused, switch without confirmation
    currentSession = sessionType;
    currentTime = getTimeForSession(currentSession);
    updateTimerUI();
    updateSessionUI();
    setStatusMessage(`Switched to ${getSessionDisplayName(sessionType)}`, false);
}

function getSessionDisplayName(sessionType) {
    switch(sessionType) {
        case SESSION_TYPES.WORK: return "Work Session";
        case SESSION_TYPES.SHORT_BREAK: return "Short Break";
        case SESSION_TYPES.LONG_BREAK: return "Long Break";
    }
}

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);
skipBtn.addEventListener('click', skipToNextSession);

// click handlers for session badges
sessionBadges.forEach((badge, index) => {
    badge.addEventListener('click', () => {
        let sessionType;
        if (index === 0) 
            sessionType = SESSION_TYPES.WORK;
        else if (index === 1) 
            sessionType = SESSION_TYPES.SHORT_BREAK;
        else 
            sessionType = SESSION_TYPES.LONG_BREAK;

        switchSessionManually(sessionType);
    });
});

updateTimerUI();
updateSessionUI();