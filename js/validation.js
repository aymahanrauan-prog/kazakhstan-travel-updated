(function () {
    'use strict';

    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

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

    var rules = {
        'reg-name': function (el) {
            var v = el.value.trim();
            if (!v) { return 'Please enter your full name.'; }
            if (v.length < 2) { return 'Name must be at least 2 characters.'; }
            return '';
        },
        'reg-email': emailRule,
        'reg-password': function (el) {
            if (!el.value) { return 'Please create a password.'; }
            if (el.value.length < 8) { return 'Password must be at least 8 characters long.'; }
            return '';
        },
        'reg-confirm': function (el) {
            if (!el.value) { return 'Please confirm your password.'; }
            if (el.value !== document.getElementById('reg-password').value) { return 'Passwords do not match.'; }
            return '';
        },
        'reg-terms': function (el) {
            return el.checked ? '' : 'You must accept the terms to continue.';
        },
        'username': function (el) {
            var v = el.value.trim();
            if (!v) { return 'Please enter your name.'; }
            if (v.length < 2) { return 'Name must be at least 2 characters.'; }
            return '';
        },
        'useremail': emailRule,
        'message': function (el) {
            var v = el.value.trim();
            if (!v) { return 'Please write a message.'; }
            if (v.length < 10) { return 'Message must be at least 10 characters.'; }
            return '';
        }
    };

    function emailRule(el) {
        var v = el.value.trim();
        if (!v) { return 'Please enter your email address.'; }
        if (!EMAIL_RE.test(v)) { return 'Please enter a valid email, e.g. name@example.com.'; }
        return '';
    }

    function validateField(el) {
        var rule = rules[el.id];
        if (!rule) { return true; }
        var message = rule(el);
        if (message) { showError(el, message); return false; }
        showOk(el);
        return true;
    }

    function setupForm(form, successId, toastId) {
        if (!form) { return; }
        var fields = Array.prototype.filter.call(form.elements, function (el) { return rules[el.id]; });
        var success = document.getElementById(successId);

        fields.forEach(function (el) {
            var eventName = el.type === 'checkbox' ? 'change' : 'blur';
            el.addEventListener(eventName, function () { validateField(el); });
            el.addEventListener('input', function () {
                if (el.classList.contains('is-invalid')) { validateField(el); }
                if (el.id === 'reg-password') {
                    var confirm = document.getElementById('reg-confirm');
                    if (confirm && confirm.value) { validateField(confirm); }
                }
            });
        });

        // Обработка отправки формы со спиннером и тостом
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            if (success) { success.classList.add('d-none'); }

            var firstInvalid = null;
            fields.forEach(function (el) {
                if (!validateField(el) && !firstInvalid) { firstInvalid = el; }
            });

            if (firstInvalid) { firstInvalid.focus(); return; }

            // Находим кнопку отправки и элементы спиннера внутри нее
            var $submitBtn = $(form).find('button[type="submit"], #submit-btn');
            var $spinner = $submitBtn.find('.spinner-border');
            var $btnText = $submitBtn.find('.btn-text');
            var originalText = $btnText.length ? $btnText.text() : 'Sign Up';

            // Блокируем кнопку, показываем спиннер и текст загрузки
            $submitBtn.prop('disabled', true);
            if ($spinner.length) { $spinner.removeClass('d-none'); }
            if ($btnText.length) { $btnText.text('Please wait...'); } else { $submitBtn.text('Please wait...'); }

            setTimeout(function () {
                // Возвращаем кнопку в исходное состояние
                $submitBtn.prop('disabled', false);
                if ($spinner.length) { $spinner.addClass('d-none'); }
                if ($btnText.length) { $btnText.text(originalText); } else { $submitBtn.text(originalText); }

                // Очищаем форму и валидацию
                form.reset();
                fields.forEach(function (el) { el.classList.remove('is-valid', 'is-invalid'); });
                if (success) { success.classList.remove('d-none'); }

                // Воспроизводим звук успешной отправки
                if (window.KZSound && typeof window.KZSound.play === 'function') {
                    window.KZSound.play('success');
                }

                // Показываем нужный тост в правом нижнем углу
                if (toastId) {
                    var toastEl = document.getElementById(toastId);
                    if (toastEl) {
                        var toast = new bootstrap.Toast(toastEl);
                        toast.show();
                    }
                }
            }, 1500);
        });
    }

    // Used by multistep.js to validate one step at a time
    window.KZValidation = { validateField: validateField };

    // Инициализируем формы с передачей ID соответствующего тоста для угла
    setupForm(document.getElementById('register-form'), 'register-success', 'register-toast');
    setupForm(document.getElementById('contact-form'), 'contact-success', 'live-toast');

    // Task 8: Copy to Clipboard functionality
    $('#copy-email-btn').on('click', function () {
        var textToCopy = $('#contact-email-text').text();
        var $btn = $(this);

        navigator.clipboard.writeText(textToCopy).then(function () {
            $btn.html('✓ Copied!');
            $btn.removeClass('btn-outline-secondary').addClass('btn-success');

            setTimeout(function () {
                $btn.html('Copy');
                $btn.removeClass('btn-success').addClass('btn btn-sm btn-primary');
            }, 2000);
        }).catch(function (err) {
            console.error('Failed to copy text: ', err);
        });
    });
})();