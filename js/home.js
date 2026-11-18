/**
 * home.js - interactive parts of the home page:
 *   1. Greeting that depends on the time of day (and the user name when logged in)
 *   2. Hero search form: sends the visitor to the Destinations page with the query
 */
(function () {
    'use strict';

    /* ---------- 1. Greeting ---------- */
    var greeting = document.getElementById('greeting');

    // Converts an hour (0-23) to a Kazakh + English greeting
    function buildGreeting(hour) {
        if (hour >= 5 && hour < 12) { return 'Қайырлы таң! Good morning'; }
        if (hour >= 12 && hour < 17) { return 'Қайырлы күн! Good afternoon'; }
        if (hour >= 17 && hour < 22) { return 'Қайырлы кеш! Good evening'; }
        return 'Қайырлы түн! Good night';
    }

    if (greeting) {
        var user = window.KZAuth ? window.KZAuth.current() : null;
        var name = user ? ', ' + user.name.split(' ')[0] : '';
        greeting.textContent = buildGreeting(new Date().getHours()) + name;
    }

    /* ---------- 2. Hero search ---------- */
    var form = document.getElementById('hero-search-form');
    var input = document.getElementById('hero-search');

    if (form && input) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            var query = input.value.trim();
            window.location.href = 'destinations.html' + (query ? '?q=' + encodeURIComponent(query) : '');
        });
    }
})();
