(function () {
    'use strict';

    var questions = document.querySelectorAll('.faq-question');

    function open(button, answer) {
        button.setAttribute('aria-expanded', 'true');
        answer.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
    }

    function close(button, answer) {
        button.setAttribute('aria-expanded', 'false');
        answer.classList.remove('open');
        answer.style.maxHeight = null;
    }

    questions.forEach(function (button) {
        var answer = document.getElementById(button.getAttribute('aria-controls'));
        if (!answer) { return; }

        button.addEventListener('click', function () {
            if (answer.classList.contains('open')) { close(button, answer); }
            else { open(button, answer); }
        });
    });

    window.addEventListener('resize', function () {
        document.querySelectorAll('.faq-answer.open').forEach(function (answer) {
            answer.style.maxHeight = answer.scrollHeight + 'px';
        });
    });
})();
