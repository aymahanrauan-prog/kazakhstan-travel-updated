/**
 * main.js - effects shared by every page:
 *   1. "Back to top" button (appears after scrolling down)
 *   2. Scroll reveal: elements with the class "reveal" fade in when they enter the screen
 */
(function () {
    'use strict';

    /* ---------- 1. Back to top ---------- */
    var topButton = document.getElementById('back-to-top');

    if (topButton) {
        window.addEventListener('scroll', function () {
            topButton.classList.toggle('show', window.scrollY > 400);
        }, { passive: true });

        topButton.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ---------- 2. Scroll reveal ---------- */
    var items = document.querySelectorAll('.reveal');
    if (!items.length) { return; }

    // Old browsers: just show everything
    if (!('IntersectionObserver' in window)) {
        items.forEach(function (item) { item.classList.add('is-visible'); });
        return;
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);   // animate only once
            }
        });
    }, { threshold: 0.12 });

    items.forEach(function (item) { observer.observe(item); });
})();
