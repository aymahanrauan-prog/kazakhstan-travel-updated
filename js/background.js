(function () {
    'use strict';

    const COLORS = ['#f8f9fa', '#e3f2fd', '#fff3e0', '#e8f5e9', '#fce4ec', '#ede7f6', '#fffde7'];
    const STORAGE_KEY = 'kz-travel-bg-index';
    let index = 0;

    function isNight() {
        return document.documentElement.getAttribute('data-bs-theme') === 'dark';
    }

    // In Night mode the colour is removed so the dark theme is not overridden
    function applyColor(i) {
        if (isNight()) {
            document.body.style.removeProperty('background-color');
            return;
        }
        document.body.style.setProperty('background-color', COLORS[i], 'important');
    }

    try {
        const saved = parseInt(localStorage.getItem(STORAGE_KEY), 10);
        if (!isNaN(saved) && saved >= 0 && saved < COLORS.length) { index = saved; }
    } catch (e) { }

    const button = document.getElementById('bg-color-btn');

    // The background button only makes sense in Day mode
    function syncButton() {
        if (!button) { return; }
        button.disabled = isNight();
        button.title = isNight() ? 'Switch to Day mode to change the background' : '';
    }

    applyColor(index);
    syncButton();

    document.addEventListener('kz:themechange', function () {
        applyColor(index);
        syncButton();
    });

    if (!button) { return; }

    button.addEventListener('click', function () {
        index = (index + 1) % COLORS.length;
        applyColor(index);
        try { localStorage.setItem(STORAGE_KEY, String(index)); } catch (e) { }
    });
})();
