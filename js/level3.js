// ============================================
// LEVEL 3 – SECURITY AUDIT (Multi-Round Enhanced)
// ============================================
// Round 1: Account    — 3 steps (Make Private → Getter → Setter)
// Round 2: Student    — 4 steps (2x Private → Getter → Validated Setter)
// Round 3: Employee   — 5 steps (3x Private → All Getters → Validated Setters)
// Total: 12 interactive steps vs original 3
// ============================================

import { addXP, addCoins } from './store.js';

let onLevel3Complete = null;
let navigateToFn     = null;
let currentRound     = 0;  // 0-indexed
let currentStep      = 0;  // within round
let totalMistakes    = 0;
let threatLevel      = 0;  // 0–100

// ---- Round Definitions ----
const ROUNDS = [
    {
        id: 'account',
        title: 'Account System',
        emoji: '🏦',
        subtitle: 'Banking data exposure detected!',
        instruction: 'Secure the Account class — hide the balance field and add controlled access:',
        totalSteps: 3,
        codeStates: [
            'class Account {\n    public int balance;\n}',
            'class Account {\n    private int balance;\n}',
            'class Account {\n    private int balance;\n\n    public int getBalance() {\n        return balance;\n    }\n}',
            'class Account {\n    private int balance;\n\n    public int getBalance() {\n        return balance;\n    }\n\n    public void setBalance(int b) {\n        if (b >= 0) {\n            this.balance = b;\n        }\n    }\n}',
        ],
        buttons: [
            { icon: '🔒', label: 'Make Private',       desc: 'public → private int balance' },
            { icon: '📖', label: 'Add Getter',          desc: 'public int getBalance()' },
            { icon: '✏️', label: 'Add Setter',          desc: 'setBalance() with b >= 0 check' },
        ],
        successMsg: 'Account class is now fully encapsulated!',
        warnings: [
            '⚠️ Vulnerability: public balance — anyone can set it to -99999!',
            '⚠️ Field is private. Now expose a safe read path.',
            '⚠️ Read access added. Add validated write access.',
            '✅ Account System Secured.',
        ],
    },
    {
        id: 'student',
        title: 'Student Records',
        emoji: '📚',
        subtitle: 'Student name & grade publicly accessible — privacy breach!',
        instruction: 'Secure the Student class — hide both fields, then add safe access methods:',
        totalSteps: 4,
        codeStates: [
            'class Student {\n    public String name;\n    public int grade;\n}',
            'class Student {\n    private String name;\n    public int grade;\n}',
            'class Student {\n    private String name;\n    private int grade;\n}',
            'class Student {\n    private String name;\n    private int grade;\n\n    public String getName() {\n        return name;\n    }\n}',
            'class Student {\n    private String name;\n    private int grade;\n\n    public String getName() {\n        return name;\n    }\n\n    public void setGrade(int grade) {\n        if (grade >= 0 && grade <= 100) {\n            this.grade = grade;\n        }\n    }\n}',
        ],
        buttons: [
            { icon: '🔒', label: 'Make name Private',          desc: 'public String name → private' },
            { icon: '🔒', label: 'Make grade Private',         desc: 'public int grade → private' },
            { icon: '📖', label: 'Add getName() Getter',       desc: 'public String getName()' },
            { icon: '✅', label: 'Add setGrade() + Validate',  desc: 'grade: 0–100 range check' },
        ],
        successMsg: 'Student Records are now fully protected!',
        warnings: [
            '⚠️ Both name and grade are publicly accessible — data leak risk!',
            '⚠️ name secured. Hide grade too.',
            '⚠️ Both fields private. Expose read access for name.',
            '⚠️ Almost done — add validated write access for grade.',
            '✅ Student Records Secured.',
        ],
    },
    {
        id: 'employee',
        title: 'Employee Database',
        emoji: '👔',
        subtitle: 'Salary, department & rating exposed — critical breach imminent!',
        instruction: 'Lock down Employee — three sensitive fields need full encapsulation:',
        totalSteps: 5,
        codeStates: [
            'class Employee {\n    public double salary;\n    public String department;\n    public int rating;\n}',
            'class Employee {\n    private double salary;\n    public String department;\n    public int rating;\n}',
            'class Employee {\n    private double salary;\n    private String department;\n    public int rating;\n}',
            'class Employee {\n    private double salary;\n    private String department;\n    private int rating;\n}',
            'class Employee {\n    private double salary;\n    private String department;\n    private int rating;\n\n    public double getSalary()     { return salary; }\n    public String getDepartment() { return department; }\n    public int    getRating()     { return rating; }\n}',
            'class Employee {\n    private double salary;\n    private String department;\n    private int rating;\n\n    public double getSalary()     { return salary; }\n    public String getDepartment() { return department; }\n    public int    getRating()     { return rating; }\n\n    public void setSalary(double s) {\n        if (s > 0) this.salary = s;\n    }\n\n    public void setRating(int r) {\n        if (r >= 1 && r <= 5) this.rating = r;\n    }\n}',
        ],
        buttons: [
            { icon: '🔒', label: 'Make salary Private',      desc: 'public double salary → private' },
            { icon: '🔒', label: 'Make department Private',   desc: 'public String department → private' },
            { icon: '🔒', label: 'Make rating Private',       desc: 'public int rating → private' },
            { icon: '📖', label: 'Add All Getters',           desc: 'getSalary(), getDepartment(), getRating()' },
            { icon: '✅', label: 'Add Validated Setters',     desc: 'setSalary(>0), setRating(1–5)' },
        ],
        successMsg: 'Employee Database is fully locked down!',
        warnings: [
            '⚠️ CRITICAL: All 3 fields publicly accessible — salary can be corrupted!',
            '⚠️ salary secured. department and rating still exposed.',
            '⚠️ 2/3 fields secured. rating is still public.',
            '⚠️ All fields private. Now add safe read methods.',
            '⚠️ Getters added. Protect write access with validation.',
            '✅ Employee Database Secured.',
        ],
    },
];

const VAULT_MAP = (step, total) => {
    if (step === 0)     return 0; // locked
    if (step === total) return 3; // unlocked
    return (step / total) < 0.5 ? 1 : 2; // step-1 or step-2
};
const VAULT_CLASSES  = ['locked', 'step-1', 'step-2', 'unlocked'];
const VAULT_STATUSES = ['LOCKED', 'SECURING...', 'ALMOST SAFE...', 'UNLOCKED'];
const VAULT_HANDLES  = ['🔐', '🔒', '🔒', '🔓'];

// ---- Public API ----

export function initLevel3(navigateTo, onCompleteFn) {
    navigateToFn     = navigateTo;
    onLevel3Complete = onCompleteFn;

    document.getElementById('btn-level3-back').addEventListener('click', () => {
        navigateToFn('level-map');
    });

    document.getElementById('btn-l3-continue').addEventListener('click', () => {
        document.getElementById('l3-success').classList.add('hidden');
        if (onLevel3Complete) onLevel3Complete(3);
    });

    document.getElementById('btn-l3-next-round').addEventListener('click', () => {
        document.getElementById('l3-round-complete').classList.add('hidden');
        currentRound++;
        currentStep = 0;
        loadRound(currentRound);
    });
}

export function startLevel3() {
    currentRound  = 0;
    currentStep   = 0;
    totalMistakes = 0;
    threatLevel   = 0;
    document.getElementById('l3-success').classList.add('hidden');
    document.getElementById('l3-round-complete').classList.add('hidden');
    updateThreatMeter();
    updateRoundNodes();
    loadRound(0);
}

// ---- Round Loading ----

function loadRound(idx) {
    const round = ROUNDS[idx];

    // Target header
    document.getElementById('l3-target-emoji').textContent = round.emoji;
    document.getElementById('l3-target-name').textContent  = round.title;
    document.getElementById('l3-target-sub').textContent   = round.subtitle;

    // Code filename
    const fileMap = { account: 'Account.java', student: 'Student.java', employee: 'Employee.java' };
    const filenameEl = document.getElementById('l3-code-filename');
    if (filenameEl) filenameEl.textContent = fileMap[round.id] || `${round.id}.java`;

    // HUD badges
    document.getElementById('l3-round-num').textContent  = idx + 1;
    document.getElementById('l3-step').textContent       = '0';
    document.getElementById('l3-steps-total').textContent = round.totalSteps;

    // Instruction
    document.getElementById('l3-instruction').textContent = round.instruction;

    // Build action buttons dynamically
    buildButtons(round);

    // Build progress dots dynamically
    buildDots(round.totalSteps);

    // Code display
    document.getElementById('l3-code-display').textContent = round.codeStates[0];

    // Vault
    setVault(0, round);

    // Warning
    const w = document.getElementById('vault-warning');
    w.textContent  = round.warnings[0];
    w.style.color  = '';

    // Error msg hidden
    document.getElementById('l3-error-msg').classList.add('hidden');

    // Animate round transition
    const content = document.querySelector('.level3-content');
    content.classList.remove('l3-round-enter');
    void content.offsetWidth;
    content.classList.add('l3-round-enter');
}

function buildButtons(round) {
    const group = document.getElementById('l3-btn-group');
    group.innerHTML = '';
    round.buttons.forEach((btn, idx) => {
        const el = document.createElement('button');
        el.className    = 'l3-action-btn';
        el.dataset.step = idx + 1;
        el.innerHTML = `
            <span class="l3-btn-icon">${btn.icon}</span>
            <span class="l3-btn-text">
                <span class="l3-btn-label">${btn.label}</span>
                <span class="l3-btn-desc">${btn.desc}</span>
            </span>`;
        el.addEventListener('click', () => handleStep(idx + 1, el, round));
        group.appendChild(el);
    });
}

function buildDots(total) {
    const container = document.getElementById('l3-progress-dots');
    container.innerHTML = '';
    for (let i = 1; i <= total; i++) {
        const dot = document.createElement('div');
        dot.className = 'l3-step-dot';
        dot.id = `l3-p${i}`;
        dot.innerHTML = `<span>${i}</span>`;
        container.appendChild(dot);
        if (i < total) {
            const line = document.createElement('div');
            line.className = 'l3-step-line';
            container.appendChild(line);
        }
    }
}

// ---- Step Handling ----

function handleStep(step, btnEl, round) {
    if (step !== currentStep + 1) {
        // Wrong order
        totalMistakes++;
        threatLevel = Math.min(100, threatLevel + 15);
        updateThreatMeter();
        showError(btnEl);
        return;
    }

    document.getElementById('l3-error-msg').classList.add('hidden');
    currentStep = step;

    // HUD step badge
    document.getElementById('l3-step').textContent = step;

    // Code display
    document.getElementById('l3-code-display').textContent = round.codeStates[step];

    // Mark button done
    btnEl.disabled = true;
    btnEl.classList.add('completed-step');

    // Progress dots
    updateDots(step, round.totalSteps);

    // Vault
    setVault(step, round);

    // Warning text
    const w = document.getElementById('vault-warning');
    w.textContent = round.warnings[step];
    w.style.color = step === round.totalSteps ? 'var(--success)' : '';

    if (step === round.totalSteps) {
        onRoundComplete(round);
    }
}

function onRoundComplete(round) {
    if (currentRound === ROUNDS.length - 1) {
        // All rounds done — final win
        const xp    = Math.max(20, 50 - totalMistakes * 3);
        const coins = 25;
        addXP(xp);
        addCoins(coins);

        const scoreEl = document.getElementById('l3-security-score');
        const stars   = totalMistakes === 0 ? '⭐⭐⭐' : totalMistakes <= 3 ? '⭐⭐' : '⭐';
        scoreEl.innerHTML = `
            <div class="l3-score-stars">${stars}</div>
            <p>Mistakes: <strong>${totalMistakes}</strong> &nbsp;|&nbsp; XP Earned: <strong>+${xp}</strong></p>`;

        updateRoundNodes();
        setTimeout(() => {
            document.getElementById('l3-success').classList.remove('hidden');
        }, 900);
    } else {
        // Advance to next round
        updateRoundNodes();
        document.getElementById('l3-round-msg').textContent = round.successMsg;
        setTimeout(() => {
            document.getElementById('l3-round-complete').classList.remove('hidden');
        }, 800);
    }
}

// ---- Vault ----

function setVault(step, round) {
    const vIdx   = VAULT_MAP(step, round.totalSteps);
    const door   = document.getElementById('vault-door');
    door.className = `vault-door ${VAULT_CLASSES[vIdx]}`;
    document.getElementById('vault-handle').textContent = VAULT_HANDLES[vIdx];
    document.getElementById('vault-status').textContent = VAULT_STATUSES[vIdx];
}

// ---- Progress Dots ----

function updateDots(step, total) {
    for (let i = 1; i <= total; i++) {
        const dot = document.getElementById(`l3-p${i}`);
        if (!dot) continue;
        if (i <= step) dot.className = 'l3-step-dot done';
    }
    const lines = document.querySelectorAll('#l3-progress-dots .l3-step-line');
    lines.forEach((line, idx) => {
        if (idx < step - 1) line.classList.add('done');
    });
}

// ---- Round Nodes (top progress bar) ----

function updateRoundNodes() {
    ROUNDS.forEach((_, idx) => {
        const node = document.getElementById(`l3-rnode-${idx + 1}`);
        if (!node) return;
        node.classList.remove('active', 'done');
        if (idx < currentRound)  node.classList.add('done');
        if (idx === currentRound) node.classList.add('active');
        const line = document.getElementById(`l3-rline-${idx + 1}`);
        if (line) line.classList.toggle('done', idx < currentRound);
    });
}

// ---- Threat Meter ----

function updateThreatMeter() {
    document.getElementById('l3-threat-fill').style.width  = `${threatLevel}%`;
    document.getElementById('l3-threat-pct').textContent   = threatLevel;
    const pct2 = document.getElementById('l3-threat-pct2');
    if (pct2) pct2.textContent = `${threatLevel}%`;
    const fill = document.getElementById('l3-threat-fill');
    fill.style.background = threatLevel < 40 ? 'var(--success)'
                          : threatLevel < 70 ? '#f0a500'
                          : 'var(--fire-red)';
}

// ---- Error Shake ----

function showError(btnEl) {
    document.getElementById('l3-error-msg').classList.remove('hidden');
    btnEl.classList.remove('l3-shake');
    void btnEl.offsetWidth;
    btnEl.classList.add('l3-shake');
    setTimeout(() => btnEl.classList.remove('l3-shake'), 450);

    // Flash threat meter
    const fill = document.getElementById('l3-threat-fill');
    fill.classList.add('l3-threat-flash');
    setTimeout(() => fill.classList.remove('l3-threat-flash'), 400);
}
