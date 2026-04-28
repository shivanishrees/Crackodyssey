// ============================================
// LEVEL 6 – Code Ninja: Logic Flow
// Linear track runner
// ============================================

import { addXP, addCoins, completeLevel, saveMazeReward } from './store.js';
import { LEVELS } from './data/levels.js';

let navigateToFn = null;
let onLevel6Complete = null;
let canvas, ctx;
const CELL_WIDTH = 60;
const CELL_HEIGHT = 100;

// Engine State
let track = [];
let ninjaPos = 0;
let isSimulating = false;
let simulationTimer = null;
let levelData = null;
let tutorialStage = 0; // 0 = Basics, 1 = Jump, 2 = Hide

// ---- Initialization ----

export function initLevel6(navigateTo, onCompleteFn) {
    navigateToFn = navigateTo;
    onLevel6Complete = onCompleteFn;
    
    canvas = document.getElementById('l6-canvas');
    // Ensure canvas fits inside the container
    canvas.width = 800;
    canvas.height = 200;
    ctx = canvas.getContext('2d');

    document.getElementById('btn-level6-back').addEventListener('click', stopSimulation);
    // document.getElementById('btn-l6-start').addEventListener('click', () => { ... }); (Removed)
    
    document.getElementById('btn-l6-run-bot').addEventListener('click', startSimulation);
    document.getElementById('btn-l6-reset').addEventListener('click', resetLevel);
    document.getElementById('btn-l6-retry').addEventListener('click', () => {
        document.getElementById('l6-defeat').classList.add('hidden');
        resetLevel();
    });
    document.getElementById('btn-l6-victory').addEventListener('click', () => {
        document.getElementById('l6-victory').classList.add('hidden');
        if (onLevel6Complete) onLevel6Complete(6);
    });
}

export function startLevel6() {
    levelData = LEVELS[6];
    document.getElementById('l6-victory').classList.add('hidden');
    document.getElementById('l6-defeat').classList.add('hidden');
    
    // Reset Tutorial state
    tutorialStage = 0;
    updateTutorialUI();
    
    resetLevel();
}

function resetLevel() {
    stopSimulation();
    document.getElementById('l6-terminal-log').innerHTML = '<div class="log-info">> System initialized. Awaiting logic execution.</div>';
    
    track = [...levelData.grid];
    ninjaPos = 0;
    
    draw();
}

// ---- Simulation Loop ----

function stopSimulation() {
    isSimulating = false;
    if (simulationTimer) clearInterval(simulationTimer);
}

function startSimulation() {
    if (isSimulating) return;
    
    const userCode = document.getElementById('l6-code-editor').value;
    
    // Validate based on tutorial stage
    if (tutorialStage === 0 && !userCode.includes('return this.run();')) {
        logTerminal(`> Tutorial Error: Please add \`return this.run();\` to get the Ninja moving.`, 'err');
        return;
    }
    
    if (tutorialStage > 0 && !userCode.includes('return this.run();')) {
        logTerminal(`> Validation Error: No default fallback action found. You must return this.run() at the end.`, 'err');
        return;
    }
    
    if (!userCode.includes('class MyNinja extends NinjaBot')) {
        logTerminal(`> Validation Error: You must define 'class MyNinja extends NinjaBot'.`, 'err');
        return;
    }
    
    // Compile user code with NinjaBot base class injected
    let botFunc;
    try {
        const fullCode = `
class NinjaBot {
    hide() { return "HIDE"; }
    jump() { return "JUMP"; }
    run()  { return "RUN";  }
    wait() { return "WAIT"; }
}
${userCode}
const bot = new MyNinja();
return bot.decideAction(state);
`;
        botFunc = new Function('state', fullCode);
        logTerminal('> Code compiled successfully.', 'succ');
    } catch (e) {
        logTerminal(`> Compiler Error: ${e.message}`, 'err');
        return;
    }
    
    isSimulating = true;
    logTerminal('> Simulation started...', 'info');
    simulationTimer = setInterval(() => tick(botFunc), 800); // 1 tick every 0.8s
}

function buildState() {
    let nextCell = ninjaPos + 1 < track.length ? track[ninjaPos + 1] : 0;
    
    // Using encapsulated methods instead of raw properties
    return {
        hasEnemy: () => nextCell === 2,
        hasObstacle: () => nextCell === 1,
        isSafe: () => nextCell === 0 || nextCell === 3
    };
}

function tick(botFunc) {
    if (!isSimulating) return;
    
    const state = buildState();
    let action = 'WAIT';
    
    try {
        action = botFunc(state);
    } catch (e) {
        logTerminal(`> Runtime Error in script: ${e.message}`, 'err');
        triggerDefeat("Your code crashed!");
        return;
    }
    
    if (action !== 'WAIT' && action !== 'RUN' && action !== 'JUMP' && action !== 'HIDE') {
        logTerminal(`> Invalid Action: '${action}'. Must be RUN, JUMP, HIDE, or WAIT.`, 'warn');
        action = 'WAIT';
    }

    // Process Action
    if (action === 'WAIT') {
        logTerminal(`> Ninja waited.`, 'info');
    } else {
        // Move Forward
        ninjaPos++;
        let currentCell = track[ninjaPos];
        
        if (currentCell === 1) { // Obstacle
            if (action === 'JUMP') {
                logTerminal(`> Ninja successfully JUMPED over an obstacle!`, 'succ');
            } else {
                logTerminal(`> Ninja tried to ${action} but hit an obstacle!`, 'err');
                draw();
                triggerDefeat("You hit an obstacle! Should have jumped.", "obstacle");
                return;
            }
        } else if (currentCell === 2) { // Enemy
            if (action === 'HIDE') {
                logTerminal(`> Ninja successfully HID from an enemy!`, 'succ');
            } else {
                logTerminal(`> Ninja tried to ${action} and was caught by an enemy!`, 'err');
                draw();
                triggerDefeat("An enemy caught you! Should have hidden.", "enemy");
                return;
            }
        } else if (currentCell === 0 || currentCell === 3) { // Empty or Goal
            if (action === 'RUN') {
                logTerminal(`> Ninja ran forward safely.`, 'info');
            } else {
                // Unnecessary action, but we allow it or penalize? Let's allow it but warn.
                logTerminal(`> Ninja used ${action} when it was safe to RUN. Wasted energy.`, 'warn');
            }
        }
    }
    
    draw();
    
    // Check Win
    if (track[ninjaPos] === 3) { // Goal
        stopSimulation();
        logTerminal(`> 🏆 GOAL REACHED! Logic flow is perfect.`, 'succ');
        
        // Award all 15 gems (matching the 15 OOP concepts tested)
        levelData.rewards.forEach(r => saveMazeReward(6, r.id));
        completeLevel(6);
        
        addXP(100); addCoins(80);
        document.getElementById('l6-victory').classList.remove('hidden');
    }
}

// ---- Rendering ----

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const groundY = canvas.height - 40;
    
    // Draw Ground
    ctx.fillStyle = '#333';
    ctx.fillRect(0, groundY, canvas.width, 40);
    
    // Camera Tracking: Center the ninja
    let cameraX = (ninjaPos * CELL_WIDTH) - (canvas.width / 2) + (CELL_WIDTH / 2);
    if (cameraX < 0) cameraX = 0;
    
    ctx.save();
    ctx.translate(-cameraX, 0);
    
    // Draw Track
    for (let i = 0; i < track.length; i++) {
        let x = i * CELL_WIDTH;
        let cell = track[i];
        
        if (cell === 1) { // Obstacle
            ctx.fillStyle = '#ff5500';
            ctx.beginPath();
            ctx.moveTo(x + 10, groundY);
            ctx.lineTo(x + CELL_WIDTH/2, groundY - 30);
            ctx.lineTo(x + CELL_WIDTH - 10, groundY);
            ctx.fill();
        } else if (cell === 2) { // Enemy
            ctx.fillStyle = '#ff0055';
            ctx.fillRect(x + 15, groundY - 50, 30, 50);
            // Evil Eyes
            ctx.fillStyle = '#fff';
            ctx.fillRect(x + 20, groundY - 40, 6, 6);
            ctx.fillRect(x + 34, groundY - 40, 6, 6);
        } else if (cell === 3) { // Goal
            ctx.fillStyle = '#00ff88';
            ctx.fillRect(x + 10, groundY - 60, 40, 60);
        }
    }
    
    // Draw Ninja
    let nx = ninjaPos * CELL_WIDTH;
    ctx.fillStyle = '#00aaff';
    ctx.fillRect(nx + 15, groundY - 40, 30, 40);
    // Ninja Bandana
    ctx.fillStyle = '#fff';
    ctx.fillRect(nx + 15, groundY - 30, 30, 8);
    
    ctx.restore();
}

function triggerDefeat(msg, type) {
    stopSimulation();
    
    // Dynamic Tutorial Advancement
    if (type === 'obstacle' && tutorialStage === 0) {
        tutorialStage = 1;
        updateTutorialUI();
        document.getElementById('l6-defeat-msg').innerHTML = "Ouch! You hit an obstacle.<br>Check the Tutorial Guide for your next step.";
    } else if (type === 'enemy' && tutorialStage === 1) {
        tutorialStage = 2;
        updateTutorialUI();
        document.getElementById('l6-defeat-msg').innerHTML = "Yikes! An enemy caught you.<br>Check the Tutorial Guide for your next step.";
    } else {
        document.getElementById('l6-defeat-msg').textContent = msg;
    }
    
    document.getElementById('l6-defeat').classList.remove('hidden');
}

function updateTutorialUI() {
    const textEl = document.getElementById('l6-tutorial-text');
    if (!textEl) return;
    
    if (tutorialStage === 0) {
        textEl.innerHTML = `<strong>Step 1: Inheritance & Overriding</strong><br>Let's get moving! You are creating a class that <code>extends NinjaBot</code>. Override the <code>decideAction()</code> method and simply type <code>return this.run();</code> inside.`;
    } else if (tutorialStage === 1) {
        textEl.innerHTML = `<strong>Step 2: Guard Clauses & Encapsulation</strong><br>Ouch! Before running, check if there is an obstacle using the state object's encapsulated method.<br>Above your RUN command, add: <code>if (state.hasObstacle()) { return this.jump(); }</code>`;
    } else if (tutorialStage === 2) {
        textEl.innerHTML = `<strong>Step 3: Handle Danger First</strong><br>An enemy caught you! You must prioritize hiding from danger.<br>At the VERY TOP of your method, add: <code>if (state.hasEnemy()) { return this.hide(); }</code>`;
    }
}

function logTerminal(msg, type) {
    const terminal = document.getElementById('l6-terminal-log');
    const div = document.createElement('div');
    div.className = `log-${type}`;
    div.textContent = msg;
    terminal.appendChild(div);
    terminal.scrollTop = terminal.scrollHeight;
}
