/**
 * favorites.js - "Save" (heart) buttons for tours and places.
 *
 * Saved items live in localStorage under the key "kz-favorites":
 *   { tours: [ {id, title, image, href} ], places: [ ... ] }
 * A button needs the class "fav-btn" and data-fav-* attributes
 * (type, id, title, image, href). One click listener handles all buttons.
 */
(function () {
    'use strict';

    var STORAGE_KEY = 'kz-favorites';

    function readAll() {
        try {
            var data = JSON.parse(localStorage.getItem(STORAGE_KEY));
            if (data && typeof data === 'object') { return data; }
        } catch (error) { /* ignore */ }
        return { tours: [], places: [] };
    }

    function writeAll(data) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (error) { /* ignore */ }
    }

    function list(type) {
        return readAll()[type] || [];
    }

    function has(type, id) {
        return list(type).some(function (item) { return item.id === id; });
    }

    // Adds the item or removes it when it is already saved. Returns true when saved.
    function toggle(type, item) {
        var data = readAll();
        data[type] = data[type] || [];
        var index = data[type].findIndex(function (saved) { return saved.id === item.id; });

        if (index > -1) {
            data[type].splice(index, 1);
            writeAll(data);
            return false;
        }
        data[type].push(item);
        writeAll(data);
        return true;
    }

    function paint(button, saved) {
        button.classList.toggle('saved', saved);
        button.setAttribute('aria-pressed', String(saved));
        var icon = button.querySelector('i');
        if (icon) { icon.className = saved ? 'bi bi-heart-fill' : 'bi bi-heart'; }
    }

    // Colours every heart button inside root according to the saved list
    function sync(root) {
        (root || document).querySelectorAll('.fav-btn').forEach(function (button) {
            paint(button, has(button.dataset.favType, button.dataset.favId));
        });
    }

    document.addEventListener('click', function (event) {
        var button = event.target.closest('.fav-btn');
        if (!button) { return; }

        var saved = toggle(button.dataset.favType, {
            id: button.dataset.favId,
            title: button.dataset.favTitle,
            image: button.dataset.favImage,
            href: button.dataset.favHref
        });
        paint(button, saved);
    });

    document.addEventListener('DOMContentLoaded', function () { sync(document); });

    window.KZFav = { list: list, has: has, toggle: toggle, sync: sync };
})();
