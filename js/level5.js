// ============================================
// LEVEL 5 – OOP Tower Defense: Code Wars
// ============================================
import { addXP, addCoins } from './store.js';

let navigateToFn = null, onLevel5Complete = null;
let canvas, ctx, animId = null, lastTime = 0;

const CW = 780, CH = 400;

// ---- Path waypoints ----
const PATH = [
    {x:820,y:90}, {x:580,y:90}, {x:580,y:220},
    {x:200,y:220}, {x:200,y:340}, {x:-20,y:340}
];

// Precompute segments
const SEG = [];
let PATH_LEN = 0;
for (let i = 0; i < PATH.length - 1; i++) {
    const dx = PATH[i+1].x - PATH[i].x, dy = PATH[i+1].y - PATH[i].y;
    const len = Math.hypot(dx, dy);
    SEG.push({ sx: PATH[i].x, sy: PATH[i].y, dx: dx/len, dy: dy/len, len });
    PATH_LEN += len;
}

// ---- Tower slot positions ----
const SLOTS = [
    {x:700,y:35}, {x:560,y:35}, {x:430,y:35}, {x:290,y:35}, {x:150,y:35},
    {x:680,y:160}, {x:450,y:160}, {x:310,y:160},
    {x:710,y:285}, {x:490,y:285},
    {x:410,y:375}, {x:270,y:375}, {x:100,y:375},
];

// ---- Tower definitions ----
const TDEFS = {
    enc:  { e:'🔒', name:'Encapsulation', cost:30, range:115, dmg:20, rate:1100, col:'#f0a500', pref:'publicfield',     slow:false, splash:false, fact:'Private fields + getters prevent external corruption.' },
    inh:  { e:'🧬', name:'Inheritance',   cost:40, range:145, dmg:15, rate:900,  col:'#00cc66', pref:'copypaste',       slow:false, splash:true,  fact:'Inheritance reuses code — no more copy-pasting!' },
    poly: { e:'🎭', name:'Polymorphism',  cost:50, range:130, dmg:30, rate:1300, col:'#aa44ff', pref:'instanceofchain', slow:false, splash:false, fact:'Method overriding replaces ugly instanceof chains.' },
    abs:  { e:'🔮', name:'Abstraction',   cost:60, range:200, dmg:12, rate:700,  col:'#4488ff', pref:'tightcoupling',  slow:true,  splash:false, fact:'Abstraction decouples — program to interfaces!' },
    face: { e:'📋', name:'Interface',     cost:80, range:160, dmg:38, rate:1500, col:'#ff6600', pref:'godclass',       slow:false, splash:true,  fact:'Interfaces enable multiple contracts — beats any bug!' },
};

// ---- Enemy definitions ----
const EDEFS = {
    publicfield:    { e:'🐛', name:'PublicField',     hp:60,  spd:1.6, rew:10, shield:0,   col:'#ff4444' },
    copypaste:      { e:'🦠', name:'CopyPaste',       hp:100, spd:1.1, rew:15, shield:0,   col:'#ff8800' },
    instanceofchain:{ e:'🔗', name:'InstanceofChain', hp:130, spd:0.9, rew:20, shield:50,  col:'#aa44ff' },
    tightcoupling:  { e:'⛓️', name:'TightCoupling',   hp:230, spd:0.6, rew:25, shield:0,   col:'#4488ff' },
    godclass:       { e:'👾', name:'GodClass',        hp:500, spd:0.4, rew:60, shield:120, col:'#ff0066' },
};

// ---- Waves ----
const WAVES = [
    [{t:'publicfield',n:5,gap:1300}],
    [{t:'publicfield',n:3,gap:1100},{t:'copypaste',n:4,gap:1000}],
    [{t:'copypaste',n:3,gap:1000},{t:'instanceofchain',n:4,gap:1300},{t:'publicfield',n:2,gap:900}],
    [{t:'instanceofchain',n:3,gap:1200},{t:'tightcoupling',n:3,gap:1600},{t:'copypaste',n:3,gap:1000}],
    [{t:'publicfield',n:2,gap:900},{t:'copypaste',n:2,gap:1000},{t:'instanceofchain',n:2,gap:1200},{t:'tightcoupling',n:2,gap:1600},{t:'godclass',n:2,gap:2500}],
];

// ---- Game state ----
let coins, codeHP, waveIdx, phase, towers, enemies, slotUsed, shots;
let spawnQueue, spawnTimer, selectedType, infoMsg;

// ---- Position on path ----
function pathPos(dist) {
    let rem = dist;
    for (const s of SEG) {
        if (rem <= s.len) return { x: s.sx + s.dx * rem, y: s.sy + s.dy * rem };
        rem -= s.len;
    }
    return { x: PATH[PATH.length-1].x, y: PATH[PATH.length-1].y };
}

// ---- Public API ----
export function initLevel5(navigateTo, onCompleteFn) {
    navigateToFn = navigateTo;
    onLevel5Complete = onCompleteFn;
    canvas = document.getElementById('l5-canvas');
    ctx = canvas.getContext('2d');
    canvas.width = CW; canvas.height = CH;

    document.getElementById('btn-level5-back').addEventListener('click', () => {
        cancelAnimationFrame(animId); animId = null;
        navigateToFn('level-map');
    });
    document.getElementById('btn-l5-wave').addEventListener('click', startWave);
    document.getElementById('btn-l5-victory').addEventListener('click', () => {
        document.getElementById('l5-victory').classList.add('hidden');
        if (onLevel5Complete) onLevel5Complete(5);
    });
    document.getElementById('btn-l5-retry').addEventListener('click', () => {
        document.getElementById('l5-defeat').classList.add('hidden');
        startLevel5();
    });
    
    const waveStartBtn = document.getElementById('btn-l5-start-wave-action');
    if (waveStartBtn) {
        waveStartBtn.addEventListener('click', actuallyStartWave);
    }
    
    // Welcome dismissal
    const welcomeBtn = document.getElementById('btn-l5-welcome-got-it');
    if (welcomeBtn) {
        welcomeBtn.addEventListener('click', () => {
            document.getElementById('l5-welcome').classList.add('hidden');
        });
    }

    canvas.addEventListener('click', onCanvasClick);
    canvas.addEventListener('mousemove', onCanvasHover);
    buildShop();
}

export function startLevel5() {
    coins = 80; codeHP = 100; waveIdx = 0; phase = 'shop';
    towers = []; enemies = []; slotUsed = new Array(SLOTS.length).fill(false);
    shots = []; spawnQueue = []; spawnTimer = 0;
    selectedType = null; infoMsg = 'Select a tower below, then click a ⬡ slot on the map.';
    
    document.getElementById('l5-welcome').classList.remove('hidden');
    document.getElementById('l5-wave-intro').classList.add('hidden');
    document.getElementById('l5-victory').classList.add('hidden');
    document.getElementById('l5-defeat').classList.add('hidden');
    updateHUD();
    if (animId) cancelAnimationFrame(animId);
    animId = requestAnimationFrame(loop);
}

// ---- Shop ----
function buildShop() {
    const el = document.getElementById('l5-shop-row');
    el.innerHTML = '';
    Object.entries(TDEFS).forEach(([key, td]) => {
        const btn = document.createElement('button');
        btn.className = 'l5-shop-btn'; btn.dataset.key = key;
        btn.innerHTML = `<span class="l5-se">${td.e}</span><span class="l5-sn">${td.name}</span><span class="l5-sc">🪙${td.cost}</span>`;
        btn.addEventListener('click', () => selectTower(key));
        el.appendChild(btn);
    });
}

function selectTower(key) {
    selectedType = key;
    const td = TDEFS[key];
    const prefEnemyName = EDEFS[td.pref] ? EDEFS[td.pref].name : td.pref;
    infoMsg = `${td.e} ${td.name} — Cost: 🪙${td.cost} | Range: ${td.range} | DMG: ${td.dmg} | Best Against: ${prefEnemyName} | 💡 ${td.fact}`;
    document.querySelectorAll('.l5-shop-btn').forEach(b => b.classList.toggle('selected', b.dataset.key === key));
    setInfo(infoMsg);
}

function setInfo(msg) {
    const el = document.getElementById('l5-info');
    if (el) el.textContent = msg;
}

// ---- Wave Management ----
function startWave() {
    if (phase !== 'shop' || waveIdx >= WAVES.length) return;
    
    // Pause and show the dynamic Wave Intro modal
    const waveIntro = document.getElementById('l5-wave-intro');
    const wTitle = document.getElementById('l5-wave-title');
    const wDesc = document.getElementById('l5-wave-desc');
    const wHint = document.getElementById('l5-wave-hint');
    
    wTitle.textContent = `Wave ${waveIdx + 1}`;
    
    if (waveIdx === 0) {
        wDesc.textContent = "The PublicField bugs are attacking! They expose sensitive data directly.";
        wHint.innerHTML = "Place an <strong>Encapsulation Tower</strong>. It protects fields and stops these bugs effortlessly!";
    } else if (waveIdx === 1) {
        wDesc.textContent = "CopyPaste bugs are multiplying! They represent duplicated code that is hard to maintain.";
        wHint.innerHTML = "Place an <strong>Inheritance Tower</strong>! Its splash damage hits duplicated bugs at once.";
    } else if (waveIdx === 2) {
        wDesc.textContent = "InstanceofChain bugs have heavy shields. They represent messy type-checking code.";
        wHint.innerHTML = "Place a <strong>Polymorphism Tower</strong>! It dynamically pierces their shields.";
    } else if (waveIdx === 3) {
        wDesc.textContent = "TightCoupling bugs are incredibly fast and resistant.";
        wHint.innerHTML = "Place an <strong>Abstraction Tower</strong>. It decouples the code and slows all enemies in its massive radius.";
    } else if (waveIdx === 4) {
        wDesc.textContent = "The GodClass Boss has arrived! It's a massive, bloated object doing everything.";
        wHint.innerHTML = "Place an <strong>Interface Tower</strong>! It establishes clear contracts and deals massive damage.";
    }
    
    waveIntro.classList.remove('hidden');
}

function actuallyStartWave() {
    document.getElementById('l5-wave-intro').classList.add('hidden');
    phase = 'wave';
    document.getElementById('btn-l5-wave').disabled = true;
    buildSpawnQueue(WAVES[waveIdx]);
    updateHUD();
}

function buildSpawnQueue(groups) {
    spawnQueue = []; let delay = 0;
    groups.forEach(g => {
        for (let i = 0; i < g.n; i++) {
            spawnQueue.push({ t: g.t, delay });
            delay += g.gap;
        }
    });
    spawnTimer = 0;
}

function updateSpawn(dt) {
    if (!spawnQueue.length) return;
    spawnTimer += dt;
    while (spawnQueue.length && spawnTimer >= spawnQueue[0].delay) {
        const s = spawnQueue.shift();
        spawnEnemy(s.t);
    }
}

function spawnEnemy(type) {
    const d = EDEFS[type];
    enemies.push({ type, hp: d.hp, maxHp: d.hp, shield: d.shield, spd: d.spd,
        dist: 0, slow: 0, x: PATH[0].x, y: PATH[0].y });
}

// ---- Game Loop ----
function loop(ts) {
    const dt = Math.min(ts - lastTime, 50); lastTime = ts;
    if (phase === 'wave') {
        updateSpawn(dt);
        moveEnemies(dt);
        fireTowers(ts);
        checkWaveEnd();
    }
    // age shots
    shots = shots.filter(s => ts - s.ts < 220);
    render(ts);
    animId = requestAnimationFrame(loop);
}

function moveEnemies(dt) {
    for (const e of enemies) {
        const spd = e.slow > 0 ? e.spd * 0.45 : e.spd;
        e.slow = Math.max(0, e.slow - dt);
        e.dist += spd * (dt / 16);
        if (e.dist >= PATH_LEN) {
            e.dist = PATH_LEN;
            e.reached = true;
        }
        const p = pathPos(e.dist);
        e.x = p.x; e.y = p.y;
    }
    // Remove reached enemies
    enemies = enemies.filter(e => {
        if (e.reached) { codeHP -= e.boss ? 20 : 10; updateHUD(); return false; }
        return true;
    });
    if (codeHP <= 0) { codeHP = 0; phase = 'lost'; showLose(); }
}

function fireTowers(ts) {
    for (const t of towers) {
        if (ts - t.lastFire < t.rate) continue;
        const def = TDEFS[t.type];
        let targets = enemies.filter(e => Math.hypot(e.x - t.x, e.y - t.y) <= def.range && !e.reached);
        if (!targets.length) continue;
        // Preferred enemy first
        targets.sort((a, b) => (b.type === def.pref ? 1 : -1) || b.dist - a.dist);
        const primary = targets[0];
        const hit = def.splash ? targets.slice(0, 3) : [primary];
        hit.forEach(e => {
            let dmg = def.dmg;
            if (e.type === def.pref) dmg = Math.floor(dmg * 1.6);
            if (e.shield > 0 && def.key !== 'poly') {
                e.shield = Math.max(0, e.shield - dmg); dmg = 0;
            } else { e.shield = Math.max(0, e.shield - Math.floor(dmg * 0.3)); }
            e.hp -= dmg;
            if (e.hp <= 0) { coins += EDEFS[e.type].rew; updateHUD(); e.dead = true;
                showFact(def.fact); }
            if (def.slow) e.slow = 2200;
        });
        enemies = enemies.filter(e => !e.dead);
        shots.push({ x1: t.x, y1: t.y, x2: primary.x, y2: primary.y, col: def.col, ts });
        t.lastFire = ts;
    }
}

function checkWaveEnd() {
    if (spawnQueue.length > 0 || enemies.length > 0) return;
    waveIdx++;
    if (waveIdx >= WAVES.length) { phase = 'won'; showWin(); return; }
    phase = 'shop';
    coins += 30; // between-wave bonus
    updateHUD();
    document.getElementById('btn-l5-wave').disabled = false;
    document.getElementById('btn-l5-wave').textContent = `▶ Start Wave ${waveIdx + 1}`;
    setInfo(`🎉 Wave ${waveIdx} cleared! +🪙30 bonus. Place more towers, then start Wave ${waveIdx+1}.`);
}

// ---- Canvas Interaction ----
function onCanvasClick(e) {
    if (phase !== 'shop' && phase !== 'wave') return;
    if (!selectedType) { setInfo('Select a tower type from the shop first!'); return; }
    const r = canvas.getBoundingClientRect();
    const mx = (e.clientX - r.left) * (CW / r.width);
    const my = (e.clientY - r.top) * (CH / r.height);
    const idx = SLOTS.findIndex((s, i) => !slotUsed[i] && Math.hypot(mx - s.x, my - s.y) < 28);
    if (idx < 0) { setInfo('Click on a ⬡ slot to place your tower.'); return; }
    const td = TDEFS[selectedType];
    if (coins < td.cost) { setInfo(`Not enough coins! Need 🪙${td.cost}.`); return; }
    coins -= td.cost; slotUsed[idx] = true;
    towers.push({ type: selectedType, x: SLOTS[idx].x, y: SLOTS[idx].y,
        range: td.range, dmg: td.dmg, rate: td.rate, lastFire: 0 });
    updateHUD(); setInfo(`${td.e} ${td.name} placed! Remaining: 🪙${coins}`);
}

let hovSlot = -1;
function onCanvasHover(e) {
    const r = canvas.getBoundingClientRect();
    const mx = (e.clientX - r.left) * (CW / r.width);
    const my = (e.clientY - r.top) * (CH / r.height);
    hovSlot = SLOTS.findIndex((s, i) => !slotUsed[i] && Math.hypot(mx - s.x, my - s.y) < 28);
}

// ---- Render ----
function render(ts) {
    ctx.clearRect(0, 0, CW, CH);
    drawBg();
    drawPath();
    drawSlots(ts);
    drawShots();
    drawTowers();
    drawEnemies();
    drawCodebase();
    drawSpawn();
}

function drawBg() {
    ctx.fillStyle = '#0e0e18';
    ctx.fillRect(0, 0, CW, CH);
    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < CW; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,CH); ctx.stroke(); }
    for (let y = 0; y < CH; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(CW,y); ctx.stroke(); }
}

function drawPath() {
    // Shadow
    ctx.beginPath();
    ctx.moveTo(PATH[0].x, PATH[0].y);
    PATH.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = 'rgba(255,200,50,0.08)'; ctx.lineWidth = 44; ctx.stroke();
    // Main path
    ctx.strokeStyle = '#2a2a1a'; ctx.lineWidth = 36; ctx.stroke();
    ctx.strokeStyle = '#3a3518'; ctx.lineWidth = 30; ctx.stroke();
    // Dashed center
    ctx.setLineDash([12, 10]);
    ctx.strokeStyle = 'rgba(240,165,0,0.25)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.setLineDash([]);
}

function drawSlots(ts) {
    SLOTS.forEach((s, i) => {
        if (slotUsed[i]) return;
        const hover = i === hovSlot;
        
        // Pulsing effect if a tower is currently selected in the shop
        let pulseRadius = 0;
        if (selectedType) {
            pulseRadius = Math.sin(ts / 150) * 4;
            ctx.beginPath();
            ctx.arc(s.x, s.y, 20 + pulseRadius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(0, 255, 0, ${0.4 + Math.sin(ts / 150) * 0.3})`;
            ctx.lineWidth = 3;
            ctx.stroke();
        }
        
        ctx.beginPath();
        ctx.arc(s.x, s.y, hover ? 22 : 18, 0, Math.PI * 2);
        ctx.strokeStyle = hover ? '#f0a500' : 'rgba(240,165,0,0.35)';
        ctx.lineWidth = hover ? 2 : 1.5;
        ctx.fillStyle = hover ? 'rgba(240,165,0,0.12)' : 'rgba(240,165,0,0.04)';
        ctx.fill(); ctx.stroke();
        ctx.fillStyle = 'rgba(240,165,0,0.5)'; ctx.font = '11px Courier New';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('⬡', s.x, s.y);
    });
}

function drawTowers() {
    for (const t of towers) {
        const td = TDEFS[t.type];
        // Range circle (faint)
        if (selectedType) {
            ctx.beginPath(); ctx.arc(t.x, t.y, t.range, 0, Math.PI*2);
            ctx.strokeStyle = `${td.col}22`; ctx.lineWidth = 1; ctx.stroke();
        }
        // Tower base
        ctx.beginPath(); ctx.arc(t.x, t.y, 17, 0, Math.PI*2);
        ctx.fillStyle = `${td.col}33`; ctx.fill();
        ctx.strokeStyle = td.col; ctx.lineWidth = 2; ctx.stroke();
        // Emoji
        ctx.font = '18px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(td.e, t.x, t.y);
    }
}

function drawShots() {
    for (const s of shots) {
        ctx.beginPath(); ctx.moveTo(s.x1, s.y1); ctx.lineTo(s.x2, s.y2);
        ctx.strokeStyle = s.col; ctx.lineWidth = 2;
        ctx.globalAlpha = 0.7; ctx.stroke(); ctx.globalAlpha = 1;
    }
}

function drawEnemies() {
    for (const e of enemies) {
        const def = EDEFS[e.type];
        // HP bar bg
        const bw = 36;
        ctx.fillStyle = '#333'; ctx.fillRect(e.x - bw/2, e.y - 24, bw, 5);
        ctx.fillStyle = e.hp / e.maxHp > 0.5 ? '#44cc44' : e.hp / e.maxHp > 0.25 ? '#f0a500' : '#ff4444';
        ctx.fillRect(e.x - bw/2, e.y - 24, bw * (e.hp / e.maxHp), 5);
        // Shield
        if (e.shield > 0 && EDEFS[e.type].shield > 0) {
            ctx.fillStyle = '#aa44ff';
            ctx.fillRect(e.x - bw/2, e.y - 30, bw * (e.shield / EDEFS[e.type].shield), 4);
        }
        // Emoji
        ctx.font = def.hp >= 400 ? '26px serif' : '20px serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        if (e.slow > 0) { ctx.globalAlpha = 0.7; }
        ctx.fillText(def.e, e.x, e.y);
        ctx.globalAlpha = 1;
    }
}

function drawCodebase() {
    const p = PATH[PATH.length - 1];
    ctx.font = '28px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('🏰', p.x + 30, p.y);
    ctx.fillStyle = codeHP > 60 ? '#44cc44' : codeHP > 30 ? '#f0a500' : '#ff4444';
    ctx.font = 'bold 11px Cinzel, serif'; ctx.fillText(`${codeHP}%`, p.x + 30, p.y + 22);
}

function drawSpawn() {
    ctx.font = '22px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('⚠️', PATH[0].x - 20, PATH[0].y);
}

// ---- HUD ----
function updateHUD() {
    document.getElementById('l5-coins').textContent  = coins;
    document.getElementById('l5-hp').textContent     = codeHP;
    document.getElementById('l5-wave').textContent   = waveIdx + 1;
}

// ---- Overlays ----
function showWin() {
    const xp = 70, c = 35;
    addXP(xp); addCoins(c);
    document.getElementById('l5-win-xp').textContent    = xp;
    document.getElementById('l5-win-coins').textContent = c;
    document.getElementById('l5-win-hp').textContent    = codeHP;
    document.getElementById('l5-victory').classList.remove('hidden');
}

function showLose() {
    document.getElementById('l5-defeat').classList.remove('hidden');
}

function showFact(fact) {
    const el = document.getElementById('l5-info');
    if (el && fact) { el.textContent = `💡 ${fact}`; }
}
