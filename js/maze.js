// ============================================
// MAZE ENGINE – Canvas-based maze gameplay
// ============================================

import { LEVELS } from './data/levels.js';
import { getMazeProgress, saveMazeReward, completeMaze } from './store.js';

let currentLevelId = null;
let levelData = null;
let playerPos = { row: 0, col: 0 };
let collectedRewards = [];
let exitUnlocked = false;
let onMazeComplete = null; // callback when player exits
let canvas, ctx;
let cellSize = 0;

// Colors
const COLORS = {
    wall: '#1a1a2e',
    wallBorder: '#2a2a40',
    path: '#0d0d18',
    player: '#f0a500',
    playerGlow: 'rgba(240, 165, 0, 0.3)',
    reward: '#00cc66',
    rewardGlow: 'rgba(0, 204, 102, 0.4)',
    rewardCollected: '#333344',
    exitLocked: '#cc3300',
    exitUnlocked: '#44cc44',
    exitGlow: 'rgba(68, 204, 68, 0.4)',
};

export function initMaze(navigateToFn, onCompleteFn) {
    onMazeComplete = onCompleteFn;
    canvas = document.getElementById('maze-canvas');
    ctx = canvas.getContext('2d');

    // Back button
    document.getElementById('btn-maze-back').addEventListener('click', () => {
        cleanupMaze();
        navigateToFn('level-map');
    });

    // On-screen controls
    document.querySelectorAll('.ctrl-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const dir = btn.dataset.dir;
            movePlayer(dir);
        });
    });

    // Keyboard controls
    document.addEventListener('keydown', handleKeyDown);

    // Popup close
    document.getElementById('popup-close').addEventListener('click', () => {
        document.getElementById('learning-popup').classList.add('hidden');
    });

    document.getElementById('exit-popup-close').addEventListener('click', () => {
        document.getElementById('exit-popup').classList.add('hidden');
    });
}

function handleKeyDown(e) {
    if (!currentLevelId) return;
    // Only handle if maze screen is active
    const mazeScreen = document.getElementById('screen-maze');
    if (!mazeScreen.classList.contains('active')) return;
    // Don't handle if popup is open
    if (!document.getElementById('learning-popup').classList.contains('hidden')) return;

    const keyMap = {
        'ArrowUp': 'up', 'ArrowDown': 'down',
        'ArrowLeft': 'left', 'ArrowRight': 'right',
        'w': 'up', 's': 'down', 'a': 'left', 'd': 'right',
    };
    const dir = keyMap[e.key];
    if (dir) {
        e.preventDefault();
        movePlayer(dir);
    }
}

export function startLevel(levelId) {
    currentLevelId = levelId;
    levelData = LEVELS[levelId];
    if (!levelData) return;

    // Load saved progress
    const saved = getMazeProgress(levelId);
    collectedRewards = [...saved.rewardsCollected];
    exitUnlocked = collectedRewards.length >= levelData.rewards.length;

    // Set player position
    playerPos = { ...levelData.startPos };

    // Update HUD
    document.getElementById('maze-level-title').textContent = `Level ${levelId} – ${levelData.name}`;
    updateRewardCount();

    // Size canvas
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initial draw
    draw();
}

function resizeCanvas() {
    if (!levelData) return;
    const area = document.querySelector('.maze-area');
    const maxW = area.clientWidth - 32;
    const maxH = area.clientHeight - 32;
    const maxCell = Math.min(
        Math.floor(maxW / levelData.gridCols),
        Math.floor(maxH / levelData.gridRows)
    );
    cellSize = Math.max(maxCell, 20); // minimum 20px per cell
    canvas.width = cellSize * levelData.gridCols;
    canvas.height = cellSize * levelData.gridRows;
    draw();
}

function getCell(row, col) {
    if (!levelData) return 1;
    if (row < 0 || row >= levelData.gridRows || col < 0 || col >= levelData.gridCols) return 1;
    return levelData.grid[row * levelData.gridCols + col];
}

function movePlayer(dir) {
    if (!levelData) return;

    const delta = { up: [-1, 0], down: [1, 0], left: [0, -1], right: [0, 1] };
    const [dr, dc] = delta[dir] || [0, 0];
    const newRow = playerPos.row + dr;
    const newCol = playerPos.col + dc;

    const cell = getCell(newRow, newCol);
    if (cell === 1) return; // wall

    playerPos.row = newRow;
    playerPos.col = newCol;

    // Check for reward
    checkRewardPickup();

    // Check for exit
    checkExit();

    draw();
}

function checkRewardPickup() {
    for (const reward of levelData.rewards) {
        if (reward.row === playerPos.row && reward.col === playerPos.col) {
            if (!collectedRewards.includes(reward.id)) {
                collectedRewards.push(reward.id);
                saveMazeReward(currentLevelId, reward.id);
                updateRewardCount();
                showLearningPopup(reward);

                // Check if all rewards collected
                if (collectedRewards.length >= levelData.rewards.length && !exitUnlocked) {
                    exitUnlocked = true;
                    // Show exit unlocked popup after learning popup is closed
                    const popupClose = document.getElementById('popup-close');
                    const handler = () => {
                        popupClose.removeEventListener('click', handler);
                        setTimeout(() => {
                            document.getElementById('exit-popup').classList.remove('hidden');
                        }, 300);
                    };
                    popupClose.addEventListener('click', handler);
                }
            }
        }
    }
}

function checkExit() {
    if (playerPos.row === levelData.exitPos.row && playerPos.col === levelData.exitPos.col) {
        if (exitUnlocked) {
            const levelId = currentLevelId; // save before cleanup nulls it
            completeMaze(levelId);
            cleanupMaze();
            if (onMazeComplete) {
                onMazeComplete(levelId);
            }
        }
    }
}

function showLearningPopup(reward) {
    document.getElementById('popup-title').textContent = reward.title;
    document.getElementById('popup-explanation').textContent = reward.explanation;
    document.getElementById('popup-example').textContent = reward.example;
    document.getElementById('learning-popup').classList.remove('hidden');
}

function updateRewardCount() {
    document.getElementById('maze-collected').textContent = collectedRewards.length;
    const totalEl = document.getElementById('maze-total');
    if (totalEl) totalEl.textContent = levelData ? levelData.rewards.length : 0;
}

function cleanupMaze() {
    window.removeEventListener('resize', resizeCanvas);
    currentLevelId = null;
    levelData = null;
}

// ============================================
// DRAWING
// ============================================

function draw() {
    if (!levelData || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    for (let r = 0; r < levelData.gridRows; r++) {
        for (let c = 0; c < levelData.gridCols; c++) {
            const cell = getCell(r, c);
            const x = c * cellSize;
            const y = r * cellSize;

            if (cell === 1) {
                // Wall
                ctx.fillStyle = COLORS.wall;
                ctx.fillRect(x, y, cellSize, cellSize);
                // Wall border effect
                ctx.strokeStyle = COLORS.wallBorder;
                ctx.lineWidth = 1;
                ctx.strokeRect(x + 0.5, y + 0.5, cellSize - 1, cellSize - 1);
            } else {
                // Path
                ctx.fillStyle = COLORS.path;
                ctx.fillRect(x, y, cellSize, cellSize);
            }
        }
    }

    // Draw rewards
    for (const reward of levelData.rewards) {
        const x = reward.col * cellSize + cellSize / 2;
        const y = reward.row * cellSize + cellSize / 2;
        const radius = cellSize * 0.3;

        if (collectedRewards.includes(reward.id)) {
            // Collected — dim marker
            ctx.fillStyle = COLORS.rewardCollected;
            ctx.beginPath();
            ctx.arc(x, y, radius * 0.5, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Active reward — glowing orb
            ctx.fillStyle = COLORS.rewardGlow;
            ctx.beginPath();
            ctx.arc(x, y, radius * 1.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = COLORS.reward;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();

            // Diamond icon
            ctx.fillStyle = '#fff';
            ctx.font = `${cellSize * 0.4}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('💎', x, y);
        }
    }

    // Draw exit door
    const ex = levelData.exitPos.col * cellSize;
    const ey = levelData.exitPos.row * cellSize;

    if (exitUnlocked) {
        // Glow
        ctx.fillStyle = COLORS.exitGlow;
        ctx.fillRect(ex - 4, ey - 4, cellSize + 8, cellSize + 8);
        ctx.fillStyle = COLORS.exitUnlocked;
    } else {
        ctx.fillStyle = COLORS.exitLocked;
    }
    ctx.fillRect(ex + 2, ey + 2, cellSize - 4, cellSize - 4);

    // Door icon
    ctx.fillStyle = '#fff';
    ctx.font = `${cellSize * 0.5}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(exitUnlocked ? '🚪' : '🔒', ex + cellSize / 2, ey + cellSize / 2);

    // Draw player
    const px = playerPos.col * cellSize + cellSize / 2;
    const py = playerPos.row * cellSize + cellSize / 2;
    const pRadius = cellSize * 0.35;

    // Player glow
    ctx.fillStyle = COLORS.playerGlow;
    ctx.beginPath();
    ctx.arc(px, py, pRadius * 2, 0, Math.PI * 2);
    ctx.fill();

    // Player body
    ctx.fillStyle = COLORS.player;
    ctx.beginPath();
    ctx.arc(px, py, pRadius, 0, Math.PI * 2);
    ctx.fill();

    // Player icon
    ctx.fillStyle = '#000';
    ctx.font = `${cellSize * 0.45}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🧙', px, py);
}
