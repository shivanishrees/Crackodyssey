// ============================================
// DASHBOARD – Profile & Progress Display
// ============================================

import {
    getProfile, getRank, getCompletedLevelsCount,
    getOverallMazePercent, logoutUser
} from './store.js';

export function initDashboard(navigateTo) {
    // Continue Adventure
    document.getElementById('btn-continue-adventure').addEventListener('click', () => {
        navigateTo('level-map');
    });

    // Open Map
    document.getElementById('btn-open-map').addEventListener('click', () => {
        navigateTo('level-map');
    });

    // Settings
    document.getElementById('btn-settings').addEventListener('click', () => {
        document.getElementById('settings-modal').classList.remove('hidden');
    });

    document.getElementById('btn-settings-close').addEventListener('click', () => {
        document.getElementById('settings-modal').classList.add('hidden');
    });

    // Logout
    document.getElementById('btn-logout').addEventListener('click', () => {
        logoutUser();
        document.getElementById('settings-modal').classList.add('hidden');
        navigateTo('start-gate');
    });
}

export function refreshDashboard() {
    const profile = getProfile();
    if (!profile) return;

    // Top bar
    document.getElementById('dash-username').textContent = profile.username;
    document.getElementById('dash-coins').textContent = profile.coins;
    document.getElementById('dash-xp').textContent = profile.xp;

    // Profile card
    document.getElementById('dash-player-name').textContent = profile.username;
    document.getElementById('dash-level').textContent = profile.level;
    document.getElementById('dash-total-xp').textContent = profile.xp;
    document.getElementById('dash-rank').textContent = getRank();

    // Progress
    const completed = getCompletedLevelsCount();
    document.getElementById('dash-levels-done').textContent = `${completed} / 6`;

    const mazePercent = getOverallMazePercent();
    document.getElementById('dash-maze-progress').style.width = `${mazePercent}%`;

    // Count achievements (levels completed + rewards collected)
    const achievements = completed;
    document.getElementById('dash-achievements').textContent = achievements;
}
