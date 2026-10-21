(function () {
    'use strict';

    var overlay = document.getElementById('subscribe-popup');
    if (!overlay) { return; }

    var openers = document.querySelectorAll('[data-popup-open="subscribe-popup"]');
    var closeBtn = overlay.querySelector('.popup-close');
    var form = overlay.querySelector('form');
    var emailInput = document.getElementById('sub-email');
    var emailError = document.getElementById('sub-email-error');
    var success = document.getElementById('sub-success');
    var lastFocused = null;
    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    function openPopup() {
        lastFocused = document.activeElement;
        overlay.classList.add('show');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        emailInput.focus();
    }

    function closePopup() {
        overlay.classList.remove('show');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lastFocused) { lastFocused.focus(); }
    }

    openers.forEach(function (btn) { btn.addEventListener('click', openPopup); });
    closeBtn.addEventListener('click', closePopup);

    overlay.addEventListener('click', function (event) {
        if (event.target === overlay) { closePopup(); }
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && overlay.classList.contains('show')) { closePopup(); }
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        var value = emailInput.value.trim();
        success.classList.add('d-none');

        if (!value) {
            emailInput.classList.add('is-invalid');
            emailError.textContent = 'Please enter your email address.';
            return;
        }
        if (!EMAIL_RE.test(value)) {
            emailInput.classList.add('is-invalid');
            emailError.textContent = 'Please enter a valid email, e.g. name@example.com.';
            return;
        }

        emailInput.classList.remove('is-invalid');
        success.classList.remove('d-none');
        form.reset();
        setTimeout(closePopup, 1800);
    });

    emailInput.addEventListener('input', function () { emailInput.classList.remove('is-invalid'); });
})();
