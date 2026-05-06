// ui.js
import { SESSION_TYPES, SESSION_MESSAGES, SESSION_DISPLAY_NAMES } from './constants.js';
import { formatTime } from './utils.js';

// DOM elements
let timerDisplay = null;
let statusMessage = null;
let sessionBadges = null;

export function initializeUI() {
    timerDisplay = document.getElementById("timerDisplay");
    statusMessage = document.getElementById("statusMessage");
    sessionBadges = document.querySelectorAll('.session-badge span');
}

export function updateTimerDisplay(time) {
    if (timerDisplay) {
        timerDisplay.textContent = formatTime(time);
    }
}

export function updateSessionUI(currentSession) {
    if (!sessionBadges) return;
    
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
}

export function setStatusMessage(msg, isError = false) {
    if (!statusMessage) return;
    
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

export function getStatusMessage(sessionType) {
    return SESSION_MESSAGES[sessionType] || "Ready to focus!";
}

export function getSessionDisplayName(sessionType) {
    return SESSION_DISPLAY_NAMES[sessionType];
}