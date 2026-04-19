// ============================================
// APP – Main entry point & SPA Router
// ============================================

import { isLoggedIn } from './store.js';
import { initAuth } from './auth.js';
import { initDashboard, refreshDashboard } from './dashboard.js';
import { initLevelMap, renderLevelMap } from './levelMap.js';
import { initMaze, startLevel } from './maze.js';
import { initQuiz, startQuiz } from './quiz.js';
import { initLevel3, startLevel3 } from './level3.js';
import { initLevel4, startLevel4 } from './level4.js';
import { initLevel5, startLevel5 } from './level5.js';

// Screen IDs
const SCREENS = {
    'start-gate': 'screen-start-gate',
    'dashboard':  'screen-dashboard',
    'level-map':  'screen-level-map',
    'maze':       'screen-maze',
    'quiz':       'screen-quiz',
    'level3':     'screen-level3',
    'level4':     'screen-level4',
    'level5':     'screen-level5',
};

let currentScreen = 'start-gate';

// ---- Navigation ----

function navigateTo(screenName) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

    // Show target screen
    const targetId = SCREENS[screenName];
    if (targetId) {
        document.getElementById(targetId).classList.add('active');
        currentScreen = screenName;
    }

    // Run screen-specific refresh logic
    if (screenName === 'dashboard') {
        refreshDashboard();
    } else if (screenName === 'level-map') {
        renderLevelMap(handleStartMaze);
    }
}

// ---- Game Flow Callbacks ----

function handleStartMaze(levelId) {
    if (levelId === 3) {
        navigateTo('level3');
        startLevel3();
    } else if (levelId === 4) {
        navigateTo('level4');
        startLevel4();
    } else if (levelId === 5) {
        navigateTo('level5');
        startLevel5();
    } else {
        navigateTo('maze');
        startLevel(levelId);
    }
}

function handleLevel3Complete(levelId) {
    navigateTo('quiz');
    startQuiz(levelId);
}

function handleLevel4Complete(levelId) {
    navigateTo('quiz');
    startQuiz(levelId);
}

function handleLevel5Complete(levelId) {
    navigateTo('quiz');
    startQuiz(levelId);
}

function handleMazeComplete(levelId) {
    // Maze done → go to quiz
    navigateTo('quiz');
    startQuiz(levelId);
}

function handleQuizComplete(levelId) {
    // Quiz done → back to dashboard
    navigateTo('dashboard');
}

// ---- Init ----

function init() {
    // Initialize all modules
    initAuth(navigateTo);
    initDashboard(navigateTo);
    initLevelMap(navigateTo, handleStartMaze);
    initMaze(navigateTo, handleMazeComplete);
    initQuiz(handleQuizComplete);
    initLevel3(navigateTo, handleLevel3Complete);
    initLevel4(navigateTo, handleLevel4Complete);
    initLevel5(navigateTo, handleLevel5Complete);

    // Check if already logged in
    if (isLoggedIn()) {
        navigateTo('dashboard');
    } else {
        navigateTo('start-gate');
    }
}

// Start when DOM is ready
document.addEventListener('DOMContentLoaded', init);
