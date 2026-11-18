/**
 * culture.js - Culture page:
 *   1. "Learn More" / "Show Less" buttons on the culture cards
 *   2. "Did you know?" random fact
 */
(function () {
    'use strict';

    /* ---------- 1. Learn more / Show less ---------- */
    document.querySelectorAll('.learn-more-btn').forEach(function (button) {
        var extraInfo = button.closest('.card-body').querySelector('.more-info');
        if (!extraInfo) { return; }

        extraInfo.style.display = 'none';   // hidden by default

        button.addEventListener('click', function () {
            var isHidden = extraInfo.style.display === 'none';

            if (isHidden) {
                extraInfo.style.display = 'block';
                extraInfo.classList.add('fade-in-up');
                button.textContent = 'Show Less';
            } else {
                extraInfo.style.display = 'none';
                extraInfo.classList.remove('fade-in-up');
                button.textContent = 'Learn More';
            }
            button.setAttribute('aria-expanded', String(isHidden));
        });
    });

    /* ---------- 2. Random fact ---------- */
    var facts = [
        { topic: 'Geography', text: 'Kazakhstan is the largest landlocked country in the world.' },
        { topic: 'Space', text: 'Baikonur Cosmodrome is where Yuri Gagarin launched into space in 1961.' },
        { topic: 'Nature', text: 'Kaindy Lake was created by a landslide after the 1911 earthquake, and spruce trunks still stand under its water.' },
        { topic: 'History', text: 'The Mausoleum of Khoja Ahmed Yasawi in Turkistan is a UNESCO World Heritage Site.' },
        { topic: 'Culture', text: 'The dombra has only two strings, yet it carries centuries of Kazakh storytelling through music.' },
        { topic: 'Culture', text: 'Guests in Kazakh homes are traditionally welcomed with tea, baursaks and a generous table.' },
        { topic: 'Cities', text: 'The name Almaty is linked to the Kazakh word for apple - "alma".' },
        { topic: 'Sport', text: 'Medeu in the mountains above Almaty is one of the highest outdoor skating rinks in the world.' }
    ];

    var factText = document.getElementById('fact-text');
    var factButton = document.getElementById('fact-btn');
    var lastIndex = -1;

    function showRandomFact() {
        var index;
        do {
            index = Math.floor(Math.random() * facts.length);
        } while (index === lastIndex);   // never repeat the previous fact
        lastIndex = index;

        var fact = facts[index];
        factText.innerHTML = '<span class="badge text-bg-primary me-2">' + fact.topic + '</span>' + fact.text;

        // Restart the fade-in animation
        factText.classList.remove('fade-in-up');
        void factText.offsetWidth;
        factText.classList.add('fade-in-up');
    }

    if (factButton && factText) {
        factButton.addEventListener('click', showRandomFact);
    }
})();
