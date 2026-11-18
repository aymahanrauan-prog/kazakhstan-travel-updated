/**
 * auth.js - authentication simulation without a backend.
 *
 * Users are stored in localStorage:
 *   kz-users    -> array of { name, email, phone, password, createdAt }
 *   kz-session  -> e-mail of the user who is logged in
 *   kz-requests -> contact / booking requests sent from the contact form
 *
 * NOTE: a real website must never keep plain-text passwords in the browser.
 * This is only a simulation required by the assignment.
 *
 * Exposes the global object KZAuth and updates the header (Log in / user name).
 */
(function () {
    'use strict';

    var USERS_KEY = 'kz-users';
    var SESSION_KEY = 'kz-session';
    var REQUESTS_KEY = 'kz-requests';

    /* ---------- Small localStorage helpers (never throw) ---------- */

    function read(key, fallback) {
        try {
            var value = JSON.parse(localStorage.getItem(key));
            return value === null || value === undefined ? fallback : value;
        } catch (error) {
            return fallback;
        }
    }

    function write(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            return false;
        }
    }

    function normalizeEmail(email) {
        return String(email || '').trim().toLowerCase();
    }

    function escapeHtml(text) {
        return String(text).replace(/[&<>"']/g, function (char) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
        });
    }

    /* ---------- Public API ---------- */

    function getUsers() {
        var users = read(USERS_KEY, []);
        return Array.isArray(users) ? users : [];
    }

    // Creates an account and logs the new user in
    function register(data) {
        var email = normalizeEmail(data.email);
        var users = getUsers();

        var exists = users.some(function (user) { return user.email === email; });
        if (exists) {
            return { error: 'An account with this email already exists. Please log in.' };
        }

        var user = {
            name: data.name.trim(),
            email: email,
            phone: data.phone.trim(),
            password: data.password,
            createdAt: new Date().toISOString()
        };
        users.push(user);

        if (!write(USERS_KEY, users)) {
            return { error: 'Your browser does not allow saving data. Please enable local storage.' };
        }
        write(SESSION_KEY, email);
        return { user: user };
    }

    // Checks the credentials and starts a session
    function login(email, password) {
        var cleanEmail = normalizeEmail(email);
        var user = getUsers().find(function (item) {
            return item.email === cleanEmail && item.password === password;
        });

        if (!user) {
            return { error: 'Incorrect email or password. Please try again.' };
        }
        write(SESSION_KEY, cleanEmail);
        return { user: user };
    }

    function logout() {
        try { localStorage.removeItem(SESSION_KEY); } catch (error) { /* ignore */ }
    }

    // Returns the logged-in user or null
    function current() {
        var email = read(SESSION_KEY, null);
        if (!email) { return null; }
        return getUsers().find(function (user) { return user.email === email; }) || null;
    }

    // Saves a request from the contact form
    function addRequest(request) {
        var requests = read(REQUESTS_KEY, []);
        if (!Array.isArray(requests)) { requests = []; }
        request.date = new Date().toISOString();
        requests.push(request);
        return write(REQUESTS_KEY, requests);
    }

    // Requests that were sent with the e-mail of this user
    function requestsFor(email) {
        var requests = read(REQUESTS_KEY, []);
        if (!Array.isArray(requests)) { return []; }
        var clean = normalizeEmail(email);
        return requests.filter(function (item) { return normalizeEmail(item.email) === clean; });
    }

    /* ---------- Header: show the user name instead of "Log in" ---------- */

    function renderHeader() {
        var area = document.getElementById('auth-area');
        var user = current();
        if (!area || !user) { return; }

        var firstName = user.name.split(' ')[0];
        area.innerHTML =
            '<a href="profile.html" class="auth-link"><i class="bi bi-person-circle" aria-hidden="true"></i> ' +
            escapeHtml(firstName) + '</a>' +
            '<button type="button" id="logout-btn" class="btn-brand">Log out</button>';

        document.getElementById('logout-btn').addEventListener('click', function () {
            logout();
            window.location.href = 'index.html';
        });
    }

    document.addEventListener('DOMContentLoaded', renderHeader);

    window.KZAuth = {
        register: register,
        login: login,
        logout: logout,
        current: current,
        addRequest: addRequest,
        requestsFor: requestsFor
    };
})();
