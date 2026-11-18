/**
 * contact.js - Contact page extras:
 *   1. Pre-selects the tour from the link ("Book now" -> contact.html?tour=tour-3)
 *   2. Fills in name, email and phone for a logged-in user
 *   3. "Copy" button for the e-mail address
 */
(function () {
    'use strict';

    /* ---------- 1. Pre-select the tour ---------- */
    var tourSelect = document.getElementById('contact-tour');
    var wantedTour = new URLSearchParams(window.location.search).get('tour');

    if (tourSelect && wantedTour) {
        var exists = Array.from(tourSelect.options).some(function (option) { return option.value === wantedTour; });
        if (exists) { tourSelect.value = wantedTour; }
    }

    /* ---------- 2. Prefill for a logged-in user ---------- */
    var user = window.KZAuth ? window.KZAuth.current() : null;

    if (user && document.getElementById('contact-form')) {
        document.getElementById('contact-name').value = user.name;
        document.getElementById('contact-email').value = user.email;
        document.getElementById('contact-phone').value = user.phone;
    }

    /* ---------- 3. Copy e-mail ---------- */
    var copyButton = document.getElementById('copy-email-btn');
    var emailText = document.getElementById('contact-email-text');

    if (copyButton && emailText) {
        copyButton.addEventListener('click', function () {
            navigator.clipboard.writeText(emailText.textContent.trim()).then(function () {
                copyButton.textContent = 'Copied!';
                setTimeout(function () { copyButton.textContent = 'Copy'; }, 2000);
            }).catch(function () {
                copyButton.textContent = 'Press Ctrl+C';
                setTimeout(function () { copyButton.textContent = 'Copy'; }, 2000);
            });
        });
    }
})();
