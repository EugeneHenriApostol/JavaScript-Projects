// script.js
import { SESSION_TYPES } from './modules/constants.js';
import { 
    getCurrentTime, getCurrentSession, getWorkSessionCount,
    setCurrentTime, setCurrentSession, setWorkSessionCount,
    getTimeForSession, stopTimer, startTimer, determineNextSession,
    resetToCurrentSession, switchSession, setTimerCallbacks, isTimerRunning
} from './modules/timer.js';
import { 
    initializeUI, updateTimerDisplay, updateSessionUI, 
    setStatusMessage, getStatusMessage, getSessionDisplayName 
} from './modules/ui.js';
import { shouldConfirmSwitch, getConfirmationMessage } from './modules/session.js';
import { formatTime, hasProgress } from './modules/utils.js';

// DOM elements
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const skipBtn = document.getElementById('skipBtn');
const sessionBadges = document.querySelectorAll('.session-badge span');

// Timer callbacks
function onTimerUpdate() {
    updateTimerDisplay(getCurrentTime());
}

function onSessionComplete() {
    stopTimer();
    
    const completedType = getCurrentSession() === SESSION_TYPES.WORK ? "WORK" : "BREAK";
    setStatusMessage(`✅ ${completedType} session completed! Switching mode.`, false);
    
    const nextSession = determineNextSession();
    setCurrentSession(nextSession);
    setCurrentTime(getTimeForSession(nextSession));
    
    updateTimerDisplay(getCurrentTime());
    updateSessionUI(getCurrentSession());
    
    startTimer();
}

// Set up timer callbacks
setTimerCallbacks(onTimerUpdate, onSessionComplete);

// Event handlers
function handleStart() {
    startTimer();
}

function handlePause() {
    stopTimer();
}

function handleReset() {
    stopTimer();
    resetToCurrentSession();
    setStatusMessage(getStatusMessage(getCurrentSession()), false);
}

function handleSkip() {
    stopTimer();
    onSessionComplete();
}

function handleManualSwitch(sessionType) {
    const currentSession = getCurrentSession();
    const currentTime = getCurrentTime();
    const fullTime = getTimeForSession(currentSession);
    
    if (shouldConfirmSwitch(currentSession, sessionType, currentTime, fullTime)) {
        const message = getConfirmationMessage(sessionType, currentTime, getSessionDisplayName);
        if (!confirm(message)) return;
    }
    
    if (isTimerRunning) 
        stopTimer();
    
    switchSession(sessionType);
    updateSessionUI(getCurrentSession());
    
    const hasProgressMade = hasProgress(currentTime, fullTime);
    if (hasProgressMade) {
        setStatusMessage(`Switched to ${getSessionDisplayName(sessionType)}`, false);
    } else {
        setStatusMessage(`Ready for ${getSessionDisplayName(sessionType)}`, false);
    }
}

function updateStatusMessageForSession(sessionType, action = 'ready') {
    const baseMessage = getStatusMessage(sessionType);
    
    if (action === 'switched') {
        setStatusMessage(`✨ Switched to ${getSessionDisplayName(sessionType)}. ${baseMessage}`, false);
    } else {
        setStatusMessage(baseMessage, false);
    }
}
// Event listeners
startBtn.addEventListener('click', handleStart);
pauseBtn.addEventListener('click', handlePause);
resetBtn.addEventListener('click', handleReset);
skipBtn.addEventListener('click', handleSkip);

sessionBadges.forEach((badge, index) => {
    badge.addEventListener('click', () => {
        let sessionType;
        if (index === 0) sessionType = SESSION_TYPES.WORK;
        else if (index === 1) sessionType = SESSION_TYPES.SHORT_BREAK;
        else sessionType = SESSION_TYPES.LONG_BREAK;
        
        handleManualSwitch(sessionType);
    });
});

// Initialize
initializeUI();
updateTimerDisplay(getCurrentTime());
updateSessionUI(getCurrentSession());
setStatusMessage(getStatusMessage(getCurrentSession()), false);