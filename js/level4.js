// ============================================
// LEVEL 4 – ADAPTIVE AI BOSS BATTLE
// ============================================
// The boss dynamically adapts to the player's
// OOP coding choices each turn:
//   • Polymorphism  → switch attack strategies
//   • Encapsulation → use getHealth(), not direct
//   • Inheritance   → vary character class used
//   • Abstraction   → use generic attacks
// ============================================

import { addXP, addCoins } from './store.js';

// ---- Public API Callbacks ----
let onLevel4Complete = null;
let navigateToFn    = null;

// ---- Battle State ----
let playerHP    = 100;
let bossHP      = 150;
let turn        = 0;
let bossForm    = 'fire';      // 'fire' | 'ice' | 'shadow'
let bossShield  = 0;           // absorbs this many HP on next hit
let bossResist  = null;        // attack id that boss is resistant to this turn
let playerSkip  = false;       // ice slow — skip player bonus next turn

let attackHistory    = [];     // last N attack strategy ids used
let characterHistory = [];     // last N character ids used
let encapMistakes    = 0;      // total bad encapsulation choices
let battleLog        = [];     // array of log message strings

// ---- Game Data ----

const CHARACTERS = [
    { id: 'warrior', label: 'Warrior', emoji: '⚔️',  baseBonus: 5,  desc: 'extends Character' },
    { id: 'mage',    label: 'Mage',    emoji: '🧙',  baseBonus: 8,  desc: 'extends Character' },
    { id: 'archer',  label: 'Archer',  emoji: '🏹',  baseBonus: 3,  desc: 'extends Character' },
];

const STRATEGIES = [
    { id: 'slash',       label: 'Slash',        emoji: '🗡️',  baseDmg: 20, type: 'physical', generic: false },
    { id: 'firebolt',    label: 'FireBolt',      emoji: '🔥',  baseDmg: 25, type: 'fire',     generic: false },
    { id: 'arrowrain',   label: 'ArrowRain',     emoji: '🏹',  baseDmg: 18, type: 'physical', generic: false },
    { id: 'icespike',    label: 'IceSpike',      emoji: '❄️',  baseDmg: 22, type: 'ice',      generic: false },
    { id: 'voidblast',   label: 'VoidBlast',     emoji: '✨',  baseDmg: 15, type: 'generic',  generic: true  },
];

const BOSS_FORMS = {
    fire:   { name: 'Fire Form',   emoji: '🔥', color: '#ff6600', resistType: 'fire',     weakType: 'ice',      attack: 14, atkMsg: 'scorches you with Inferno Breath' },
    ice:    { name: 'Ice Form',    emoji: '❄️', color: '#44aaff', resistType: 'ice',      weakType: 'fire',     attack: 11, atkMsg: 'freezes you with Blizzard Surge' },
    shadow: { name: 'Shadow Form', emoji: '🌑', color: '#8844cc', resistType: 'physical', weakType: 'generic',  attack: 17, atkMsg: 'drains your life with Shadow Grasp' },
};

const FORM_CYCLE = ['fire', 'ice', 'shadow'];

const OOP_HINTS = {
    spam:        '💡 Polymorphism Hint: Don\'t hardcode the same attack! Define multiple attack strategies and switch between them — that\'s polymorphism in action.',
    encap:       '💡 Encapsulation Hint: Always access data through methods (getHealth()), never directly. Private fields + public getters = encapsulation. The boss exploits exposed data!',
    inherit:     '💡 Inheritance Hint: Vary your character class each turn. Warrior, Mage, and Archer each extend Character with unique bonuses — use that diversity!',
    abstraction: '💡 Abstraction Hint: VoidBlast is a generic (abstract) attack — it works on ANY boss form because it doesn\'t depend on the concrete type. Hardcoded type-specific attacks get resisted!',
    good_poly:   '🎯 Excellent Polymorphism! You\'ve used 3 different strategies — the boss is confused by your variety and takes extra damage!',
    good_encap:  '🎯 Perfect Encapsulation! Using getHealth() protects your data — the boss can\'t exploit it!',
};

// ---- Init & Start ----

export function initLevel4(navigateTo, onCompleteFn) {
    navigateToFn     = navigateTo;
    onLevel4Complete = onCompleteFn;

    document.getElementById('btn-level4-back').addEventListener('click', () => {
        navigateToFn('level-map');
    });

    document.getElementById('btn-l4-execute').addEventListener('click', executeTurn);

    document.getElementById('btn-l4-hint').addEventListener('click', showHint);

    document.getElementById('btn-l4-retry').addEventListener('click', () => {
        document.getElementById('l4-defeat').classList.add('hidden');
        startLevel4();
    });

    document.getElementById('btn-l4-continue').addEventListener('click', () => {
        document.getElementById('l4-victory').classList.add('hidden');
        if (onLevel4Complete) onLevel4Complete(4);
    });

    // Build character & strategy selectors
    buildSelectors();
}

export function startLevel4() {
    // Reset state
    playerHP         = 100;
    bossHP           = 150;
    turn             = 0;
    bossForm         = 'fire';
    bossShield       = 0;
    bossResist       = null;
    playerSkip       = false;
    attackHistory    = [];
    characterHistory = [];
    encapMistakes    = 0;
    battleLog        = [];

    // Reset UI selections
    document.querySelectorAll('.l4-char-card').forEach(c => c.classList.remove('selected'));
    document.querySelectorAll('.l4-strat-card').forEach(c => c.classList.remove('selected'));
    document.querySelectorAll('.l4-encap-btn').forEach(b => b.classList.remove('selected'));

    // Select defaults
    selectCharacter('warrior');
    selectStrategy('slash');
    selectEncap('getter');

    renderBattleState();
    pushLog('⚔️ The battle begins! Choose wisely — the boss is watching your OOP patterns...');
}

// ---- Selector Builders ----

function buildSelectors() {
    const charContainer = document.getElementById('l4-char-selector');
    charContainer.innerHTML = '';
    CHARACTERS.forEach(ch => {
        const card = document.createElement('div');
        card.className = 'l4-char-card';
        card.dataset.id = ch.id;
        card.innerHTML = `
            <span class="l4-card-emoji">${ch.emoji}</span>
            <span class="l4-card-label">${ch.label}</span>
            <span class="l4-card-sub">${ch.desc}</span>`;
        card.addEventListener('click', () => selectCharacter(ch.id));
        charContainer.appendChild(card);
    });

    const stratContainer = document.getElementById('l4-strat-selector');
    stratContainer.innerHTML = '';
    STRATEGIES.forEach(s => {
        const card = document.createElement('div');
        card.className = 'l4-strat-card';
        card.dataset.id = s.id;
        const tag = s.generic ? '<span class="l4-generic-tag">GENERIC</span>' : '';
        card.innerHTML = `
            <span class="l4-card-emoji">${s.emoji}</span>
            <span class="l4-card-label">${s.label}${tag}</span>
            <span class="l4-card-sub">${s.baseDmg} base dmg</span>`;
        card.addEventListener('click', () => selectStrategy(s.id));
        stratContainer.appendChild(card);
    });
}

function selectCharacter(id) {
    document.querySelectorAll('.l4-char-card').forEach(c => c.classList.toggle('selected', c.dataset.id === id));
}

function selectStrategy(id) {
    document.querySelectorAll('.l4-strat-card').forEach(c => c.classList.toggle('selected', c.dataset.id === id));
}

function selectEncap(value) {
    document.querySelectorAll('.l4-encap-btn').forEach(b => b.classList.toggle('selected', b.dataset.encap === value));
}

// Wire encap buttons (called after DOM is available)
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.l4-encap-btn').forEach(btn => {
        btn.addEventListener('click', () => selectEncap(btn.dataset.encap));
    });
});

// ---- Turn Execution ----

function executeTurn() {
    const charId   = getSelected('.l4-char-card');
    const stratId  = getSelected('.l4-strat-card');
    const encapVal = getSelected('.l4-encap-btn', 'encap');

    if (!charId || !stratId || !encapVal) {
        pushLog('⚠️ Please select a Character, Attack Strategy, and Attribute Access method!');
        return;
    }

    turn++;

    // Cycle boss form every 3 turns
    const formIndex = Math.floor((turn - 1) / 3) % FORM_CYCLE.length;
    const newForm   = FORM_CYCLE[formIndex];
    if (newForm !== bossForm) {
        bossForm = newForm;
        const form = BOSS_FORMS[bossForm];
        pushLog(`🌀 Boss transforms! ➜ ${form.emoji} ${form.name}. ${OOP_HINTS.abstraction}`);
    }

    const character = CHARACTERS.find(c => c.id === charId);
    const strategy  = STRATEGIES.find(s => s.id === stratId);
    const form      = BOSS_FORMS[bossForm];

    // Track histories
    attackHistory.push(stratId);
    if (attackHistory.length > 4) attackHistory.shift();
    characterHistory.push(charId);
    if (characterHistory.length > 3) characterHistory.shift();

    // ---- Encapsulation Check ----
    let encapPenalty = 0;
    if (encapVal === 'direct') {
        encapMistakes++;
        encapPenalty = 10;
        playerHP -= encapPenalty;
        pushLog(`🚨 Encapsulation Violation! You accessed health directly — boss stole ${encapPenalty} HP! ${OOP_HINTS.encap}`);
    } else {
        pushLog(`✅ ${OOP_HINTS.good_encap}`);
    }

    // ---- Calculate Damage ----
    let dmg        = strategy.baseDmg + character.baseBonus;
    let dmgNote    = '';

    // Spam detection
    if (attackHistory.length >= 2 && attackHistory[attackHistory.length - 1] === attackHistory[attackHistory.length - 2]) {
        dmg = Math.floor(dmg * 0.25);
        bossResist = stratId;
        dmgNote += ` 🛡️ Spam detected! Boss resisted — heavily reduced to ${dmg} dmg! ${OOP_HINTS.spam}`;
    } else {
        bossResist = null;
    }

    // Boss form resistance / weakness
    if (!strategy.generic) {
        if (strategy.type === form.resistType) {
            dmg = Math.floor(dmg * 0.5);
            dmgNote += ` 🔥 Boss form resists ${strategy.type}! Damage halved to ${dmg}.`;
        } else if (strategy.type === form.weakType) {
            dmg = Math.floor(dmg * 1.5);
            dmgNote += ` ⚡ Boss is WEAK to ${strategy.type}! Bonus damage → ${dmg}!`;
        }
    } else {
        // Generic / abstract attack bonus
        dmg = Math.floor(dmg * 1.2);
        dmgNote += ` ✨ Generic attack bypasses boss form — +20% (${dmg} dmg)!`;
    }

    // Polymorphism bonus: last 3 all unique
    if (attackHistory.length >= 3) {
        const last3 = attackHistory.slice(-3);
        if (new Set(last3).size === 3) {
            dmg = Math.floor(dmg * 1.2);
            dmgNote += ` 🎭 ${OOP_HINTS.good_poly}`;
        }
    }

    // Inheritance diversity check
    let inheritShield = false;
    if (characterHistory.length >= 3 && characterHistory.every(c => c === characterHistory[0])) {
        bossShield = Math.max(bossShield, 15);
        inheritShield = true;
        pushLog(`🛡️ No class variety! Boss gains a ${bossShield}-HP shield. ${OOP_HINTS.inherit}`);
    }

    // Apply shield
    let shieldAbsorbed = 0;
    if (bossShield > 0 && !inheritShield) {
        shieldAbsorbed = Math.min(bossShield, dmg);
        dmg -= shieldAbsorbed;
        bossShield -= shieldAbsorbed;
        if (shieldAbsorbed > 0) pushLog(`🛡️ Boss shield absorbed ${shieldAbsorbed} damage! (shield left: ${bossShield})`);
    }

    // Deal damage to boss
    bossHP = Math.max(0, bossHP - dmg);

    pushLog(`⚔️ Turn ${turn}: ${character.emoji} ${character.label} used ${strategy.emoji} ${strategy.label} → ${dmg} damage!${dmgNote}`);

    // ---- Boss Counterattack ----
    if (bossHP > 0) {
        let bossDmg = form.attack;
        // Shadow form bonus if encap violated this turn
        if (bossForm === 'shadow' && encapVal === 'direct') {
            bossDmg += 8;
            pushLog(`🌑 Shadow Boss exploits your exposed data for bonus damage!`);
        }
        // Ice form freeze: player loses next turn bonus (simulated as extra dmg)
        if (bossForm === 'ice') {
            playerSkip = true;
        }
        playerHP = Math.max(0, playerHP - bossDmg);
        pushLog(`💀 ${form.emoji} Boss ${form.atkMsg} for ${bossDmg} damage!`);
        if (playerSkip && bossForm === 'ice') {
            pushLog(`🧊 You are frozen! Your next attack deals -5 base damage.`);
        }
    }

    // ---- Win / Loss Check ----
    if (bossHP <= 0) {
        winBattle();
        return;
    }
    if (playerHP <= 0) {
        loseBattle();
        return;
    }

    renderBattleState();
}

// ---- Win / Loss ----

function winBattle() {
    // Award rewards
    const xpEarned     = 60 - encapMistakes * 5;
    const coinsEarned  = 30;
    addXP(Math.max(10, xpEarned));
    addCoins(coinsEarned);

    const stars = encapMistakes === 0 ? 3 : encapMistakes <= 2 ? 2 : 1;

    document.getElementById('l4-victory-stars').textContent   = '⭐'.repeat(stars);
    document.getElementById('l4-victory-xp').textContent      = Math.max(10, xpEarned);
    document.getElementById('l4-victory-coins').textContent   = coinsEarned;
    document.getElementById('l4-victory-encap').textContent   = encapMistakes;
    document.getElementById('l4-victory-turns').textContent   = turn;

    renderBattleState();
    setTimeout(() => {
        document.getElementById('l4-victory').classList.remove('hidden');
    }, 500);
}

function loseBattle() {
    renderBattleState();
    document.getElementById('l4-defeat-turns').textContent = turn;
    setTimeout(() => {
        document.getElementById('l4-defeat').classList.remove('hidden');
    }, 500);
}

// ---- Hint System ----

function showHint() {
    let hint = '';
    // Pick most relevant hint based on current mistakes
    if (attackHistory.length >= 2 && attackHistory[attackHistory.length - 1] === attackHistory[attackHistory.length - 2]) {
        hint = OOP_HINTS.spam;
    } else if (encapMistakes > 0) {
        hint = OOP_HINTS.encap;
    } else if (characterHistory.length >= 3 && characterHistory.every(c => c === characterHistory[0])) {
        hint = OOP_HINTS.inherit;
    } else {
        hint = OOP_HINTS.abstraction;
    }

    const hintEl = document.getElementById('l4-hint-box');
    hintEl.textContent = hint;
    hintEl.classList.remove('hidden', 'l4-hint-fade');
    void hintEl.offsetWidth; // reflow
    hintEl.classList.add('l4-hint-fade');
    setTimeout(() => hintEl.classList.add('hidden'), 5000);
}

// ---- Render ----

function renderBattleState() {
    const form = BOSS_FORMS[bossForm];

    // Boss area
    document.getElementById('l4-boss-emoji').textContent   = form.emoji;
    document.getElementById('l4-boss-name').textContent    = `Adaptive AI Boss — ${form.name}`;
    document.getElementById('l4-boss-hp-val').textContent  = Math.max(0, bossHP);
    document.getElementById('l4-boss-hp-bar').style.width  = `${(bossHP / 150) * 100}%`;
    document.getElementById('l4-boss-hp-bar').style.background = form.color;

    // Shield indicator
    const shieldEl = document.getElementById('l4-boss-shield');
    if (bossShield > 0) {
        shieldEl.textContent = `🛡️ Shield: ${bossShield}`;
        shieldEl.classList.remove('hidden');
    } else {
        shieldEl.classList.add('hidden');
    }

    // Boss form glow
    const bossArea = document.getElementById('l4-boss-area');
    bossArea.className = `l4-boss-area boss-${bossForm}`;

    // Player area
    const hpPct  = (playerHP / 100) * 100;
    document.getElementById('l4-player-hp-val').textContent  = Math.max(0, playerHP);
    const bar = document.getElementById('l4-player-hp-bar');
    bar.style.width = `${hpPct}%`;
    bar.style.background = hpPct > 50 ? 'var(--emerald)' : hpPct > 25 ? '#f0a500' : 'var(--fire-red)';

    // Turn counter
    document.getElementById('l4-turn-count').textContent = turn;

    // Battle log
    renderLog();
}

function renderLog() {
    const logEl = document.getElementById('l4-battle-log');
    logEl.innerHTML = '';
    // Show last 8 entries newest first
    [...battleLog].reverse().slice(0, 8).forEach(msg => {
        const line = document.createElement('p');
        line.className = 'l4-log-line';
        line.textContent = msg;
        logEl.appendChild(line);
    });
}

// ---- Helpers ----

function pushLog(msg) {
    battleLog.push(msg);
    // Limit log size
    if (battleLog.length > 40) battleLog.shift();
}

function getSelected(selector, dataAttr = 'id') {
    const el = document.querySelector(`${selector}.selected`);
    return el ? el.dataset[dataAttr] : null;
}
