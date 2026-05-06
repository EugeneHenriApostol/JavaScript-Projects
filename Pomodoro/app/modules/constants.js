// constants.js
export const WORK_MIN = 25;
export const SHORT_BREAK_MIN = 5;
export const LONG_BREAK_MIN = 15;

export const WORK_TIME = WORK_MIN * 60;
export const SHORT_BREAK_TIME = SHORT_BREAK_MIN * 60;
export const LONG_BREAK_TIME = LONG_BREAK_MIN * 60;

export const SESSION_TYPES = {
    WORK: 'work',
    SHORT_BREAK: 'shortBreak',
    LONG_BREAK: 'longBreak'
};

export const SESSION_DISPLAY_NAMES = {
    [SESSION_TYPES.WORK]: 'Work Session',
    [SESSION_TYPES.SHORT_BREAK]: 'Short Break',
    [SESSION_TYPES.LONG_BREAK]: 'Long Break'
};

export const SESSION_MESSAGES = {
    [SESSION_TYPES.WORK]: "🍅 Work session! Time to focus. Press Start.",
    [SESSION_TYPES.SHORT_BREAK]: "☕ Short break! Take 5 minutes to relax. Press Start.",
    [SESSION_TYPES.LONG_BREAK]: "🍃 Long break! Take 15 minutes to recharge. Press Start."
};