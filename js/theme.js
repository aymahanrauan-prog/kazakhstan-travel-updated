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
        button.textContent = currentTheme === 'dark' ? 'Day mode' : 'Night mode';
        button.setAttribute('aria-pressed', String(currentTheme === 'dark'));
    }

    function setTheme(theme) {
        currentTheme = theme;
        root.setAttribute('data-bs-theme', theme);
        try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) { /* ignore */ }
        updateButton();
        // Let other scripts (background.js) react to the change
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
