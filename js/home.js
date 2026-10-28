/**
 * home.js - interactive parts of the home page:
 *   1. Greeting that depends on the time of day (switch statement)
 *   2. "Did you know?" random fact button (array of objects, innerHTML, animation)
 */
(function () {
    'use strict';

    /* ---------- 1. Time-of-day greeting ---------- */

    const greetingElement = document.getElementById('greeting');

    // Converts an hour (0-23) to a named part of the day
    function getPartOfDay(hour) {
        if (hour >= 5 && hour < 12) { return 'morning'; }
        if (hour >= 12 && hour < 17) { return 'afternoon'; }
        if (hour >= 17 && hour < 22) { return 'evening'; }
        return 'night';
    }

    // switch chooses the greeting (Kazakh + English) for each part of the day
    function buildGreeting(partOfDay) {
        switch (partOfDay) {
            case 'morning':
                return 'Қайырлы таң! Good morning, traveler';
            case 'afternoon':
                return 'Қайырлы күн! Good afternoon, traveler';
            case 'evening':
                return 'Қайырлы кеш! Good evening, traveler';
            default:
                return 'Қайырлы түн! Good night, traveler';
        }
    }

    if (greetingElement) {
        greetingElement.textContent = buildGreeting(getPartOfDay(new Date().getHours()));
    }

    /* ---------- 2. Random fact ---------- */

    // Array of objects: every fact has a topic and a text
    const facts = [
        { topic: 'Geography', text: 'Kazakhstan is the largest landlocked country in the world.' },
        { topic: 'Space', text: 'Baikonur Cosmodrome is where Yuri Gagarin launched into space in 1961.' },
        { topic: 'Nature', text: 'Kaindy Lake was created by a landslide after the 1911 earthquake, and spruce trunks still stand under its water.' },
        { topic: 'History', text: 'The Mausoleum of Khoja Ahmed Yasawi in Turkistan is a UNESCO World Heritage Site.' },
        { topic: 'Culture', text: 'The dombra has only two strings, yet it carries centuries of Kazakh storytelling through music.' },
        { topic: 'Culture', text: 'Guests in Kazakh homes are traditionally welcomed with tea, baursaks and a generous table.' },
        { topic: 'Cities', text: 'The name Almaty is linked to the Kazakh word for apple - "alma".' },
        { topic: 'Sport', text: 'Medeu in the mountains above Almaty is one of the highest outdoor skating rinks in the world.' }
    ];

    const factText = document.getElementById('fact-text');
    const factButton = document.getElementById('fact-btn');
    let lastIndex = -1;

    function showRandomFact() {
        // Pick a random fact that is different from the previous one
        let index;
        do {
            index = Math.floor(Math.random() * facts.length);
        } while (index === lastIndex);
        lastIndex = index;

        const fact = facts[index];
        // innerHTML lets us add the coloured topic badge together with the text
        factText.innerHTML = '<span class="badge text-bg-primary me-2">' + fact.topic + '</span>' + fact.text;

        // Restart the fade-in animation: remove the class, force a reflow, add it again
        factText.classList.remove('fade-in-up');
        void factText.offsetWidth;
        factText.classList.add('fade-in-up');
    }

    if (factButton && factText) {
        factButton.addEventListener('click', showRandomFact);
    }
})();
