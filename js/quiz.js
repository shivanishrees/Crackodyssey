// ============================================
// QUIZ ENGINE – MCQ-based level assessment
// ============================================

import { QUIZZES } from './data/quizzes.js';
import { addXP, addCoins, completeLevel, saveQuizScore } from './store.js';

let currentLevelId = null;
let questions = [];
let currentQuestionIdx = 0;
let score = 0;
let answered = false;
let onQuizComplete = null;

const XP_PER_CORRECT = 20;
const COINS_PER_CORRECT = 10;
const BONUS_XP = 50;    // Bonus for completing the quiz
const BONUS_COINS = 25;

// Per-level pass thresholds (correct answers needed out of 10)
// Level 3 (Encapsulation) uses a lower bar since the vault challenge already tested the concept
const PASS_THRESHOLDS = { 3: 4 };
const DEFAULT_PASS_THRESHOLD = 6;
function getPassThreshold(levelId) {
    return PASS_THRESHOLDS[levelId] ?? DEFAULT_PASS_THRESHOLD;
}

export function initQuiz(onCompleteFn) {
    onQuizComplete = onCompleteFn;

    document.getElementById('btn-quiz-next').addEventListener('click', () => {
        nextQuestion();
    });

    document.getElementById('btn-quiz-finish').addEventListener('click', () => {
        if (onQuizComplete) {
            onQuizComplete(currentLevelId);
        }
    });

    document.getElementById('btn-quiz-retry').addEventListener('click', () => {
        startQuiz(currentLevelId);
    });
}

export function startQuiz(levelId) {
    currentLevelId = levelId;
    const quizData = QUIZZES[levelId];
    if (!quizData) return;

    questions = quizData.questions;
    currentQuestionIdx = 0;
    score = 0;
    answered = false;

    // Update header
    document.getElementById('quiz-title').textContent = quizData.title;
    document.getElementById('quiz-total').textContent = questions.length;

    // Reset live score
    const liveScore = document.getElementById('quiz-score-live');
    if (liveScore) liveScore.textContent = '0';

    // Show quiz body, hide completion
    document.querySelector('.quiz-body').style.display = 'flex';
    document.getElementById('quiz-complete').classList.add('hidden');
    document.getElementById('btn-quiz-finish').classList.remove('hidden');
    document.getElementById('btn-quiz-retry').classList.add('hidden');

    renderQuestion();
}

function renderQuestion() {
    const q = questions[currentQuestionIdx];
    answered = false;

    // Update progress
    document.getElementById('quiz-current').textContent = currentQuestionIdx + 1;

    // Render question
    document.getElementById('quiz-question').textContent = q.question;

    // Render options
    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = '';

    q.options.forEach((opt, idx) => {
        const btn = document.createElement('div');
        btn.className = 'quiz-option';
        btn.textContent = opt;
        btn.addEventListener('click', () => selectOption(idx));
        optionsContainer.appendChild(btn);
    });

    // Hide feedback, explanation, and next button
    const feedback = document.getElementById('quiz-feedback');
    feedback.classList.add('hidden');
    feedback.className = 'hidden';
    const explanation = document.getElementById('quiz-explanation');
    if (explanation) explanation.classList.add('hidden');
    document.getElementById('btn-quiz-next').classList.add('hidden');
}

function selectOption(idx) {
    if (answered) return;
    answered = true;

    const q = questions[currentQuestionIdx];
    const options = document.querySelectorAll('.quiz-option');
    const feedback = document.getElementById('quiz-feedback');

    // Disable all options
    options.forEach(opt => opt.classList.add('disabled'));

    // Mark correct/incorrect
    options[q.correct].classList.add('correct');

    if (idx === q.correct) {
        score++;
        feedback.textContent = '✓ Correct! Well done!';
        feedback.className = 'correct';
        // Update live score tracker in header
        const liveScore = document.getElementById('quiz-score-live');
        if (liveScore) liveScore.textContent = score;
    } else {
        options[idx].classList.add('incorrect');
        feedback.textContent = `✗ Incorrect. The correct answer was: ${q.options[q.correct]}`;
        feedback.className = 'incorrect';
    }

    feedback.classList.remove('hidden');

    // Show explanation if available
    const explanationEl = document.getElementById('quiz-explanation');
    if (explanationEl && q.explanation) {
        explanationEl.textContent = '💡 ' + q.explanation;
        explanationEl.classList.remove('hidden');
    }

    document.getElementById('btn-quiz-next').classList.remove('hidden');
}

function nextQuestion() {
    currentQuestionIdx++;

    if (currentQuestionIdx >= questions.length) {
        showResults();
    } else {
        renderQuestion();
    }
}

function calculateStars(sc, total) {
    const pct = sc / total;
    if (pct >= 0.9) return 3;  // 90%+  ⭐⭐⭐
    if (pct >= 0.7) return 2;  // 70%+  ⭐⭐
    if (pct >= 0.6) return 1;  // 60%+  ⭐  (minimum pass)
    return 0;
}

function showResults() {
    // Hide quiz body
    document.querySelector('.quiz-body').style.display = 'none';

    const total = questions.length;
    const passed = score >= getPassThreshold(currentLevelId);
    const stars = passed ? calculateStars(score, total) : 0;

    // Persist best score
    saveQuizScore(currentLevelId, score, stars);

    // Calculate rewards (bonus XP/coins only awarded on pass)
    const correctXP = score * XP_PER_CORRECT;
    const correctCoins = score * COINS_PER_CORRECT;
    const totalXP = passed ? correctXP + BONUS_XP : correctXP;
    const totalCoins = passed ? correctCoins + BONUS_COINS : correctCoins;

    addXP(totalXP);
    addCoins(totalCoins);

    // Only mark level completed on pass
    if (passed) {
        completeLevel(currentLevelId);
    }

    // Result title
    const resultTitle = document.getElementById('quiz-result-title');
    if (resultTitle) {
        resultTitle.textContent = passed ? '🏆 Level Complete!' : '❌ Not Quite...';
    }

    // Result message
    const resultMsg = document.getElementById('quiz-result-msg');
    if (resultMsg) {
        resultMsg.textContent = passed
            ? `You scored ${score}/${total} — ${'\u2b50'.repeat(stars)}${'\u2606'.repeat(3 - stars)}`
        : `Need at least ${getPassThreshold(currentLevelId)}/${total} to pass. You scored ${score}/${total}. Try again!`;
    }

    // Star display in result card
    const starsEl = document.getElementById('quiz-stars');
    if (starsEl) {
        starsEl.innerHTML = passed
            ? '\u2b50'.repeat(stars) + '<span class="star-empty">\u2606</span>'.repeat(3 - stars)
            : '<span class="star-empty">\u2606\u2606\u2606</span>';
    }

    document.getElementById('quiz-score').textContent = `${score} / ${total}`;
    document.getElementById('quiz-xp-earned').textContent = `${totalXP} XP + ${totalCoins} 🪙`;

    // Show Continue only on pass, Retry only on fail
    const finishBtn = document.getElementById('btn-quiz-finish');
    const retryBtn = document.getElementById('btn-quiz-retry');
    if (passed) {
        finishBtn.classList.remove('hidden');
        retryBtn.classList.add('hidden');
    } else {
        finishBtn.classList.add('hidden');
        retryBtn.classList.remove('hidden');
    }

    document.getElementById('quiz-complete').classList.remove('hidden');
}
