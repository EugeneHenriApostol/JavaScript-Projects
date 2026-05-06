// session.js
import { SESSION_TYPES } from './constants.js';
import { hasProgress, formatTime } from './utils.js';

export function shouldConfirmSwitch(currentSession, targetSession, currentTime, fullTime) {
    if (currentSession === targetSession) return false;
    
    const progressExists = hasProgress(currentTime, fullTime);
    return progressExists;
}

export function getConfirmationMessage(targetSession, currentTime, getSessionDisplayName) {
    return `Switch to ${getSessionDisplayName(targetSession)}?\n\n` +
           `Current progress (${formatTime(currentTime)}) will be lost.`;
}