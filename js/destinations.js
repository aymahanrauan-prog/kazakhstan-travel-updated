/**
 * destinations.js - search + region filter on the Destinations page.
 *
 *   - The list updates while the visitor types or clicks a region chip
 *   - The last search (text + region) is saved in localStorage and restored
 *     on the next visit; "?q=..." from the home page search has priority
 */
(function () {
    'use strict';

    var grid = document.getElementById('places-grid');
    if (!grid) { return; }

    var STORAGE_KEY = 'kz-places-search';
    var input = document.getElementById('search-input');
    var chips = document.querySelectorAll('.region-chip');
    var cards = Array.from(grid.querySelectorAll('.place-item'));
    var emptyMessage = document.getElementById('no-results');
    var counter = document.getElementById('results-count');
    var restoredNote = document.getElementById('restored-note');
    var clearButton = document.getElementById('clear-search');

    var state = { query: '', region: 'all' };

    /* ---------- Saved search ---------- */

    function loadState() {
        var urlQuery = new URLSearchParams(window.location.search).get('q');
        if (urlQuery !== null) {
            state.query = urlQuery.trim();       // comes from the home page search
            return false;
        }
        try {
            var saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
            if (saved && (saved.query || saved.region !== 'all')) {
                state.query = saved.query || '';
                state.region = saved.region || 'all';
                return true;                     // restored from a previous visit
            }
        } catch (error) { /* ignore */ }
        return false;
    }

    function saveState() {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (error) { /* ignore */ }
    }

    /* ---------- Filtering ---------- */

    function applyFilters() {
        var query = state.query.toLowerCase();
        var visible = 0;

        cards.forEach(function (card) {
            var matchesText = !query || card.textContent.toLowerCase().indexOf(query) !== -1;
            var matchesRegion = state.region === 'all' || card.dataset.region === state.region;
            var show = matchesText && matchesRegion;
            card.hidden = !show;
            if (show) { visible += 1; }
        });

        chips.forEach(function (chip) {
            var active = chip.dataset.region === state.region;
            chip.classList.toggle('active', active);
            chip.setAttribute('aria-pressed', String(active));
        });

        counter.textContent = visible === 1 ? '1 place found' : visible + ' places found';
        emptyMessage.hidden = visible > 0;
        saveState();
    }

    function resetFilters() {
        state.query = '';
        state.region = 'all';
        input.value = '';
        restoredNote.hidden = true;
        applyFilters();
    }

    /* ---------- Events ---------- */

    input.addEventListener('input', function () {
        state.query = input.value.trim();
        restoredNote.hidden = true;
        applyFilters();
    });

    chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
            state.region = chip.dataset.region;
            restoredNote.hidden = true;
            applyFilters();
        });
    });

    clearButton.addEventListener('click', resetFilters);
    document.getElementById('search-form').addEventListener('submit', function (event) { event.preventDefault(); });

    var wasRestored = loadState();
    input.value = state.query;
    applyFilters();
    restoredNote.hidden = !wasRestored;
})();
