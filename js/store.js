// ============================================
// STORE – localStorage Persistence Layer
// ============================================
import { LEVELS } from './data/levels.js';

const USERS_KEY = 'crack_odyssey_users';
const CURRENT_USER_KEY = 'crack_odyssey_current_user';

// Rank thresholds
const RANKS = [
    { name: 'Novice', minXP: 0 },
    { name: 'Apprentice', minXP: 100 },
    { name: 'Scholar', minXP: 300 },
    { name: 'Wizard', minXP: 600 },
    { name: 'Archmage', minXP: 1000 },
];

function getUsers() {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : {};
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Create a new default user profile
function createDefaultProfile(username) {
    return {
        username,
        coins: 0,
        xp: 0,
        level: 1,
        levelsCompleted: [],
        // Per-level maze progress: { [levelId]: { rewardsCollected: [...], completed: bool } }
        mazeProgress: {},
        // Per-level quiz scores: { [levelId]: { score, stars } }
        quizScores: {},
        achievements: [],
        currentLevel: 1,
    };
}

// ---- Auth ----

export function registerUser(username, password) {
    const users = getUsers();
    if (users[username]) {
        return { success: false, error: 'Username already exists' };
    }
    if (!username || username.length < 2) {
        return { success: false, error: 'Username must be at least 2 characters' };
    }
    if (!password || password.length < 3) {
        return { success: false, error: 'Password must be at least 3 characters' };
    }
    users[username] = {
        password, // Note: plain text for demo only
        profile: createDefaultProfile(username),
    };
    saveUsers(users);
    localStorage.setItem(CURRENT_USER_KEY, username);
    return { success: true };
}

export function loginUser(username, password) {
    const users = getUsers();
    if (!users[username]) {
        return { success: false, error: 'User not found' };
    }
    if (users[username].password !== password) {
        return { success: false, error: 'Incorrect password' };
    }
    localStorage.setItem(CURRENT_USER_KEY, username);
    return { success: true };
}

export function logoutUser() {
    localStorage.removeItem(CURRENT_USER_KEY);
}

export function getCurrentUser() {
    return localStorage.getItem(CURRENT_USER_KEY);
}

export function isLoggedIn() {
    return !!getCurrentUser();
}

// ---- Profile ----

export function getProfile() {
    const username = getCurrentUser();
    if (!username) return null;
    const users = getUsers();
    return users[username]?.profile || null;
}

function saveProfile(profile) {
    const username = getCurrentUser();
    if (!username) return;
    const users = getUsers();
    if (users[username]) {
        users[username].profile = profile;
        saveUsers(users);
    }
}

// ---- Progress ----

export function addXP(amount) {
    const profile = getProfile();
    if (!profile) return;
    profile.xp += amount;
    profile.level = Math.floor(profile.xp / 100) + 1;
    saveProfile(profile);
}

export function addCoins(amount) {
    const profile = getProfile();
    if (!profile) return;
    profile.coins += amount;
    saveProfile(profile);
}

export function getRank() {
    const profile = getProfile();
    if (!profile) return RANKS[0].name;
    let rank = RANKS[0].name;
    for (const r of RANKS) {
        if (profile.xp >= r.minXP) rank = r.name;
    }
    return rank;
}

export function getMazeProgress(levelId) {
    const profile = getProfile();
    if (!profile) return { rewardsCollected: [], completed: false };
    return profile.mazeProgress[levelId] || { rewardsCollected: [], completed: false };
}

export function saveMazeReward(levelId, rewardId) {
    const profile = getProfile();
    if (!profile) return;
    if (!profile.mazeProgress[levelId]) {
        profile.mazeProgress[levelId] = { rewardsCollected: [], completed: false };
    }
    if (!profile.mazeProgress[levelId].rewardsCollected.includes(rewardId)) {
        profile.mazeProgress[levelId].rewardsCollected.push(rewardId);
    }
    saveProfile(profile);
}

export function completeMaze(levelId) {
    const profile = getProfile();
    if (!profile) return;
    if (!profile.mazeProgress[levelId]) {
        profile.mazeProgress[levelId] = { rewardsCollected: [], completed: false };
    }
    profile.mazeProgress[levelId].completed = true;
    saveProfile(profile);
}

export function completeLevel(levelId) {
    const profile = getProfile();
    if (!profile) return;
    if (!profile.levelsCompleted.includes(levelId)) {
        profile.levelsCompleted.push(levelId);
    }
    // Unlock next level
    profile.currentLevel = Math.max(profile.currentLevel, levelId + 1);
    saveProfile(profile);
}

export function saveQuizScore(levelId, score, stars) {
    const profile = getProfile();
    if (!profile) return;
    if (!profile.quizScores) profile.quizScores = {};
    // Keep the best score
    const existing = profile.quizScores[levelId];
    if (!existing || score > existing.score) {
        profile.quizScores[levelId] = { score, stars };
    }
    saveProfile(profile);
}

export function getStarsForLevel(levelId) {
    const profile = getProfile();
    if (!profile) return 0;
    if (!profile.quizScores) profile.quizScores = {};
    const saved = profile.quizScores[levelId];
    if (!saved) {
        // Backward compat: level was completed before star tracking; give 1 star
        return profile.levelsCompleted.includes(levelId) ? 1 : 0;
    }
    return saved.stars;
}

export function isLevelCompleted(levelId) {
    const profile = getProfile();
    if (!profile) return false;
    return profile.levelsCompleted.includes(levelId);
}

export function isLevelUnlocked(levelId) {
    const profile = getProfile();
    if (!profile) return levelId === 1;
    return levelId <= profile.currentLevel;
}

export function getCompletedLevelsCount() {
    const profile = getProfile();
    if (!profile) return 0;
    return profile.levelsCompleted.length;
}

export function getOverallMazePercent() {
    const profile = getProfile();
    if (!profile) return 0;
    
    // Calculate total possible rewards across all levels
    let totalPossible = 0;
    for (const id in LEVELS) {
        totalPossible += LEVELS[id].rewards.length;
    }
    
    if (totalPossible === 0) return 100;

    let collected = 0;
    for (const key in profile.mazeProgress) {
        collected += profile.mazeProgress[key].rewardsCollected.length;
    }
    return Math.round((collected / totalPossible) * 100);
}
