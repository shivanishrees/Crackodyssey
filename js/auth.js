// ============================================
// AUTH – Login / Register Logic
// ============================================

import { registerUser, loginUser, isLoggedIn } from './store.js';

export function initAuth(navigateTo) {
    const startMenu = document.getElementById('start-menu');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // Show/hide panels
    function showPanel(panel) {
        startMenu.classList.add('hidden');
        loginForm.classList.add('hidden');
        registerForm.classList.add('hidden');
        panel.classList.remove('hidden');
    }

    // --- Show Login ---
    document.getElementById('btn-login-show').addEventListener('click', () => {
        showPanel(loginForm);
    });

    // --- Show Register ---
    document.getElementById('btn-register-show').addEventListener('click', () => {
        showPanel(registerForm);
    });

    // --- Start Adventure ---
    document.getElementById('btn-start-adventure').addEventListener('click', () => {
        if (isLoggedIn()) {
            navigateTo('dashboard');
        } else {
            showPanel(loginForm);
        }
    });

    // --- Back buttons ---
    document.getElementById('btn-login-back').addEventListener('click', () => {
        showPanel(startMenu);
        clearErrors();
    });

    document.getElementById('btn-register-back').addEventListener('click', () => {
        showPanel(startMenu);
        clearErrors();
    });

    // --- Login Submit ---
    document.getElementById('btn-login-submit').addEventListener('click', () => {
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;
        const errorEl = document.getElementById('login-error');

        const result = loginUser(username, password);
        if (result.success) {
            errorEl.classList.add('hidden');
            document.getElementById('login-username').value = '';
            document.getElementById('login-password').value = '';
            navigateTo('dashboard');
        } else {
            errorEl.textContent = result.error;
            errorEl.classList.remove('hidden');
        }
    });

    // --- Register Submit ---
    document.getElementById('btn-register-submit').addEventListener('click', () => {
        const username = document.getElementById('reg-username').value.trim();
        const password = document.getElementById('reg-password').value;
        const confirm = document.getElementById('reg-confirm').value;
        const errorEl = document.getElementById('register-error');

        if (password !== confirm) {
            errorEl.textContent = 'Passwords do not match';
            errorEl.classList.remove('hidden');
            return;
        }

        const result = registerUser(username, password);
        if (result.success) {
            errorEl.classList.add('hidden');
            document.getElementById('reg-username').value = '';
            document.getElementById('reg-password').value = '';
            document.getElementById('reg-confirm').value = '';
            navigateTo('dashboard');
        } else {
            errorEl.textContent = result.error;
            errorEl.classList.remove('hidden');
        }
    });

    // Allow Enter key to submit forms
    document.getElementById('login-password').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') document.getElementById('btn-login-submit').click();
    });
    document.getElementById('reg-confirm').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') document.getElementById('btn-register-submit').click();
    });

    function clearErrors() {
        document.getElementById('login-error').classList.add('hidden');
        document.getElementById('register-error').classList.add('hidden');
    }
}
