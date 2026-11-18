/**
 * validation.js - validation for every form on the website.
 *
 * Rules are plain JavaScript functions (no HTML attributes such as required,
 * pattern or type="email"). Every form has the "novalidate" attribute, and
 * error messages are shown on the page, under the field.
 *
 * Forms handled here: register-form, login-form, contact-form.
 */
(function () {
    'use strict';

    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    // Kazakhstan phone: +7 777 123 45 67, 8 (777) 123-45-67, +77771234567 ...
    var PHONE_RE = /^(\+7|8)[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;

    /* ---------- Error / success display ---------- */

    function showError(input, message) {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        var box = document.getElementById(input.id + '-error');
        if (box) { box.textContent = message; }
    }

    function showOk(input) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    }

    /* ---------- Rules: each returns an error message or '' ---------- */

    function nameRule(el) {
        var value = el.value.trim();
        if (!value) { return 'Please enter your full name.'; }
        if (value.length < 2) { return 'Name must be at least 2 characters.'; }
        if (/\d/.test(value)) { return 'Name must not contain digits.'; }
        return '';
    }

    function emailRule(el) {
        var value = el.value.trim();
        if (!value) { return 'Please enter your email address.'; }
        if (!EMAIL_RE.test(value)) { return 'Please enter a valid email, e.g. name@example.com.'; }
        return '';
    }

    function phoneRule(el) {
        var value = el.value.trim();
        if (!value) { return 'Please enter your phone number.'; }
        if (!PHONE_RE.test(value)) { return 'Use a Kazakhstan number, e.g. +7 777 123 45 67.'; }
        return '';
    }

    // Length + complexity (used when creating a password)
    function newPasswordRule(el) {
        var value = el.value;
        if (!value) { return 'Please create a password.'; }
        if (value.length < 8) { return 'Password must be at least 8 characters long.'; }
        if (!/[a-z]/.test(value) || !/[A-Z]/.test(value)) { return 'Use both uppercase and lowercase letters.'; }
        if (!/\d/.test(value)) { return 'Add at least one digit.'; }
        return '';
    }

    var rules = {
        'reg-name': nameRule,
        'reg-email': emailRule,
        'reg-phone': phoneRule,
        'reg-password': newPasswordRule,
        'reg-confirm': function (el) {
            if (!el.value) { return 'Please confirm your password.'; }
            if (el.value !== document.getElementById('reg-password').value) { return 'Passwords do not match.'; }
            return '';
        },
        'reg-terms': function (el) {
            return el.checked ? '' : 'You must accept the terms to continue.';
        },
        'login-email': emailRule,
        'login-password': function (el) {
            return el.value ? '' : 'Please enter your password.';
        },
        'contact-name': nameRule,
        'contact-email': emailRule,
        'contact-phone': phoneRule,
        'contact-message': function (el) {
            var value = el.value.trim();
            if (!value) { return 'Please write a message.'; }
            if (value.length < 10) { return 'Message must be at least 10 characters.'; }
            return '';
        }
    };

    function validateField(el) {
        var rule = rules[el.id];
        if (!rule) { return true; }
        var message = rule(el);
        if (message) { showError(el, message); return false; }
        showOk(el);
        return true;
    }

    /* ---------- Generic form wiring ---------- */

    // Disables the submit button and shows the spinner while "sending"
    function setBusy(button, busy) {
        if (!button) { return; }
        var spinner = button.querySelector('.spinner-border');
        var text = button.querySelector('.btn-text');
        button.disabled = busy;
        if (spinner) { spinner.classList.toggle('d-none', !busy); }
        if (text) {
            if (busy) { text.dataset.original = text.textContent; text.textContent = 'Please wait...'; }
            else if (text.dataset.original) { text.textContent = text.dataset.original; }
        }
    }

    // handler(form) runs after all fields are valid. It returns:
    //   {}                                   -> success
    //   { fieldId, message }                 -> error under one field
    //   { formError }                        -> error for the whole form
    function setupForm(form, handler) {
        if (!form) { return; }

        var fields = Array.prototype.filter.call(form.elements, function (el) { return rules[el.id]; });
        var successBox = form.querySelector('[data-success]');
        var formError = form.querySelector('[data-form-error]');

        fields.forEach(function (el) {
            var eventName = el.type === 'checkbox' ? 'change' : 'blur';
            el.addEventListener(eventName, function () { validateField(el); });
            el.addEventListener('input', function () {
                if (el.classList.contains('is-invalid')) { validateField(el); }
                // When the password changes, re-check the confirmation
                if (el.id === 'reg-password') {
                    var confirm = document.getElementById('reg-confirm');
                    if (confirm && confirm.value) { validateField(confirm); }
                }
            });
        });

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            if (successBox) { successBox.classList.add('d-none'); }
            if (formError) { formError.classList.add('d-none'); }

            var firstInvalid = null;
            fields.forEach(function (el) {
                if (!validateField(el) && !firstInvalid) { firstInvalid = el; }
            });
            if (firstInvalid) { firstInvalid.focus(); return; }

            var button = form.querySelector('button[type="submit"]');
            setBusy(button, true);

            // Short delay imitates a real request to a server
            setTimeout(function () {
                setBusy(button, false);
                var result = handler(form) || {};

                if (result.fieldId) {
                    showError(document.getElementById(result.fieldId), result.message);
                    // multistep.js listens to this event and opens the step with the error
                    form.dispatchEvent(new CustomEvent('kz:fielderror', { detail: { fieldId: result.fieldId } }));
                    return;
                }
                if (result.formError) {
                    if (formError) {
                        formError.textContent = result.formError;
                        formError.classList.remove('d-none');
                    }
                    return;
                }
                if (successBox) { successBox.classList.remove('d-none'); }
            }, 700);
        });
    }

    // Used by multistep.js to validate one step at a time
    window.KZValidation = { validateField: validateField };

    /* ---------- Sign up ---------- */
    setupForm(document.getElementById('register-form'), function () {
        var result = window.KZAuth.register({
            name: document.getElementById('reg-name').value,
            email: document.getElementById('reg-email').value,
            phone: document.getElementById('reg-phone').value,
            password: document.getElementById('reg-password').value
        });

        if (result.error) { return { fieldId: 'reg-email', message: result.error }; }

        // The user is logged in automatically - open the profile page
        setTimeout(function () { window.location.href = 'profile.html'; }, 1200);
        return {};
    });

    /* ---------- Log in ---------- */
    setupForm(document.getElementById('login-form'), function () {
        var result = window.KZAuth.login(
            document.getElementById('login-email').value,
            document.getElementById('login-password').value
        );

        if (result.error) { return { formError: result.error }; }

        setTimeout(function () { window.location.href = 'profile.html'; }, 500);
        return {};
    });

    /* ---------- Contact form ---------- */
    var contactForm = document.getElementById('contact-form');

    setupForm(contactForm, function (form) {
        var saved = window.KZAuth.addRequest({
            name: document.getElementById('contact-name').value.trim(),
            email: document.getElementById('contact-email').value.trim(),
            phone: document.getElementById('contact-phone').value.trim(),
            tour: document.getElementById('contact-tour').value,
            tourLabel: document.getElementById('contact-tour').selectedOptions[0].textContent,
            message: document.getElementById('contact-message').value.trim()
        });

        if (!saved) { return { formError: 'We could not save your request in this browser.' }; }

        form.reset();
        Array.prototype.forEach.call(form.elements, function (el) { el.classList.remove('is-valid', 'is-invalid'); });
        return {};
    });
})();
