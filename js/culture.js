/**
 * culture.js - "Learn More" / "Show Less" buttons on the culture cards.
 * Each button shows or hides extra text by changing style.display
 * and updates its own label with textContent.
 */
(function () {
    'use strict';

    const buttons = document.querySelectorAll('.learn-more-btn');

    buttons.forEach(function (button) {
        const extraInfo = button.closest('.card-body').querySelector('.more-info');
        if (!extraInfo) { return; }

        extraInfo.style.display = 'none';   // hidden by default

        button.addEventListener('click', function () {
            const isHidden = extraInfo.style.display === 'none';

            if (isHidden) {
                extraInfo.style.display = 'block';
                extraInfo.classList.add('fade-in-up');   // CSS animation
                button.textContent = 'Show Less';
            } else {
                extraInfo.style.display = 'none';
                extraInfo.classList.remove('fade-in-up');
                button.textContent = 'Learn More';
            }
            button.setAttribute('aria-expanded', String(isHidden));
        });
    });
})();
