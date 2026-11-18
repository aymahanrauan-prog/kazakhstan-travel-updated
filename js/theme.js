/**
 * theme.js - Day / Night theme switch.
 *
 * Loaded in <head> so the saved theme is applied before the page is painted
 * (no white flash). Bootstrap 5.3 colours the page through the
 * data-bs-theme attribute on <html>; our own dark styles in style.css use the same attribute.
 */
(function () {
    'use strict';

    const STORAGE_KEY = 'kz-travel-theme';
    const root = document.documentElement;
    root.classList.add('js');   // lets CSS know JavaScript is running (used by the scroll-reveal effect)

    function getSavedTheme() {
        try { return localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : 'light'; }
        catch (e) { return 'light'; }
    }

    let currentTheme = getSavedTheme();
    root.setAttribute('data-bs-theme', currentTheme);   // apply immediately

    function updateButton() {
        const button = document.getElementById('theme-toggle');
        if (!button) { return; }
        // The label shows the mode the button will switch TO
        button.innerHTML = currentTheme === 'dark'
            ? '<i class="bi bi-sun" aria-hidden="true"></i> Day'
            : '<i class="bi bi-moon-stars" aria-hidden="true"></i> Night';
        button.setAttribute('aria-label', currentTheme === 'dark' ? 'Switch to day mode' : 'Switch to night mode');
        button.setAttribute('aria-pressed', String(currentTheme === 'dark'));
    }

    function setTheme(theme) {
        currentTheme = theme;
        root.setAttribute('data-bs-theme', theme);
        try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) { /* ignore */ }
        updateButton();
        // Let other scripts react to the change
        document.dispatchEvent(new CustomEvent('kz:themechange', { detail: { theme: theme } }));
    }

    document.addEventListener('DOMContentLoaded', function () {
        const button = document.getElementById('theme-toggle');
        if (!button) { return; }
        updateButton();
        button.addEventListener('click', function () {
            setTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });
    });
})();
