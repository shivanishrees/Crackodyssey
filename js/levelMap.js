// ============================================
// LEVEL MAP – Candy Crush Style Progression
// ============================================

import { isLevelCompleted, isLevelUnlocked, getMazeProgress, getStarsForLevel } from './store.js';
import { LEVELS } from './data/levels.js';

const TOTAL_LEVELS = Object.keys(LEVELS).length;

// Zigzag alignment offsets (percentage from left)
const ZIGZAG_OFFSETS = ['20%', '55%', '75%', '40%'];

// Dungeon decorations placed along the path
const DECORATIONS = [
    { emoji: '🔥', style: 'left: 12%; top: 18%;' },
    { emoji: '🔥', style: 'right: 12%; top: 38%;' },
    { emoji: '💀', style: 'left: 8%; top: 55%;' },
    { emoji: '🔥', style: 'right: 8%; top: 72%;' },
    { emoji: '⛓️', style: 'left: 15%; top: 85%;' },
    { emoji: '🔥', style: 'right: 15%; top: 15%;' },
];

export function initLevelMap(navigateTo, startMaze) {
    document.getElementById('btn-map-back').addEventListener('click', () => {
        navigateTo('dashboard');
    });
}

export function renderLevelMap(startMaze) {
    const container = document.getElementById('level-map-container');
    container.innerHTML = '';

    // Background dungeon atmosphere particles
    const particles = document.createElement('div');
    particles.className = 'map-particles';
    for (let p = 0; p < 12; p++) {
        const dot = document.createElement('div');
        dot.className = 'map-particle';
        dot.style.left = `${Math.random() * 100}%`;
        dot.style.top = `${Math.random() * 100}%`;
        dot.style.animationDelay = `${Math.random() * 4}s`;
        dot.style.animationDuration = `${3 + Math.random() * 3}s`;
        particles.appendChild(dot);
    }
    container.appendChild(particles);

    // Path wrapper for the winding trail
    const pathWrap = document.createElement('div');
    pathWrap.className = 'map-path-wrap';

    for (let i = 1; i <= TOTAL_LEVELS; i++) {
        const level = LEVELS[i];
        const completed = isLevelCompleted(i);
        const unlocked = isLevelUnlocked(i);
        const progress = getMazeProgress(i);
        const rewardCount = progress.rewardsCollected.length;

        // Connector (except before first node)
        if (i > 1) {
            const connector = document.createElement('div');
            connector.className = 'map-connector';
            if (isLevelCompleted(i - 1) && (completed || unlocked)) {
                connector.classList.add('completed-path');
            } else {
                connector.classList.add('locked-path');
            }
            pathWrap.appendChild(connector);
        }

        // Level row
        const row = document.createElement('div');
        row.className = 'map-level-row';
        row.style.paddingLeft = ZIGZAG_OFFSETS[(i - 1) % ZIGZAG_OFFSETS.length];

        // Node wrapper (node + label beneath)
        const nodeWrap = document.createElement('div');
        nodeWrap.className = 'map-node-wrap';

        // The circular node
        const node = document.createElement('div');
        node.className = 'map-node';

        // Stars (show for completed levels — use actual earned stars)
        const earnedStars = getStarsForLevel(i);
        const starsHtml = completed
            ? `<div class="node-stars">${'⭐'.repeat(earnedStars)}${'☆'.repeat(3 - earnedStars)}</div>`
            : '';

        if (completed) {
            node.classList.add('completed');
            node.innerHTML = `<span class="node-icon">✓</span>`;
            node.addEventListener('click', () => startMaze(i));
        } else if (unlocked) {
            node.classList.add('current');
            node.innerHTML = `<span class="node-icon">${i}</span>`;
            node.addEventListener('click', () => startMaze(i));
        } else {
            node.classList.add('locked');
            node.innerHTML = `<span class="node-icon">🔒</span>`;
        }

        // Label below node
        const totalPossible = level.rewards.length;
        const progressHtml = (unlocked && totalPossible > 0) 
            ? `<span class="label-progress">💎 ${rewardCount}/${totalPossible}</span>` 
            : '';

        const label = document.createElement('div');
        label.className = 'map-node-label';
        label.innerHTML = `
            <span class="label-title">Level ${i}</span>
            <span class="label-name">${level.name}</span>
            ${completed ? starsHtml : progressHtml}
        `;

        nodeWrap.appendChild(node);
        nodeWrap.appendChild(label);
        row.appendChild(nodeWrap);
        pathWrap.appendChild(row);
    }

    container.appendChild(pathWrap);

    // Dungeon decorations
    DECORATIONS.forEach(d => {
        const el = document.createElement('div');
        el.className = 'map-decor';
        el.textContent = d.emoji;
        el.style.cssText = d.style;
        container.appendChild(el);
    });
}
