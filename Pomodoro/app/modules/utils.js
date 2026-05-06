// utils.js
export function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) 
        seconds = 0;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function hasProgress(currentTime, fullTime) {
    const isComplete = currentTime === 0;
    const isFresh = currentTime === fullTime;
    return !isFresh && !isComplete;
}