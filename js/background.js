(function () {
    'use strict';

    var COLORS = ['#f8f9fa', '#e3f2fd', '#fff3e0', '#e8f5e9', '#fce4ec', '#ede7f6', '#fffde7'];
    var STORAGE_KEY = 'kz-travel-bg-index';
    var index = 0;

    function applyColor(i) {
        document.body.style.setProperty('background-color', COLORS[i], 'important');
    }

    try {
        var saved = parseInt(localStorage.getItem(STORAGE_KEY), 10);
        if (!isNaN(saved) && saved >= 0 && saved < COLORS.length) { index = saved; }
    } catch (e) { }

    applyColor(index);

    var button = document.getElementById('bg-color-btn');
    if (!button) { return; }

    button.addEventListener('click', function () {
        index = (index + 1) % COLORS.length;
        applyColor(index);
        try { localStorage.setItem(STORAGE_KEY, String(index)); } catch (e) {  }
    });
})();
