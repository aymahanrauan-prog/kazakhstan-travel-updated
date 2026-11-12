/**
 * sounds.js - sound effects for the whole site.
 *
 * Exposes a small object `KZSound` with the methods play(), toggle() and isMuted().
 * Any element with a data-sound="click" attribute plays that sound when clicked
 * (event delegation: one listener on the document handles all buttons).
 */
(function () {
    'use strict';

    const STORAGE_KEY = 'kz-travel-sound-muted';

    // Object that maps a sound name to its file
    const SOUND_FILES = {
        click: 'sounds/click.wav',
        star: 'sounds/star.wav',
        success: 'sounds/success.wav'
    };

    const audioCache = {};   // name -> Audio object (created once, reused)
    let muted = false;

    try { muted = localStorage.getItem(STORAGE_KEY) === '1'; } catch (e) { /* storage unavailable */ }

    // Preload every sound once
    Object.keys(SOUND_FILES).forEach(function (name) {
        const audio = new Audio(SOUND_FILES[name]);
        audio.preload = 'auto';
        audio.volume = 0.5;
        audioCache[name] = audio;
    });

    // Stop everything that is currently playing so sounds never overlap
    function stopAll() {
        Object.values(audioCache).forEach(function (audio) {
            audio.pause();
            audio.currentTime = 0;
        });
    }

    function play(name) {
        if (muted || !audioCache[name]) { return; }
        stopAll();
        const promise = audioCache[name].play();
        // Browsers may block audio before the first user interaction - ignore that error
        if (promise && promise.catch) { promise.catch(function () { }); }
    }

    function updateButton() {
        const button = document.getElementById('sound-toggle');
        if (!button) { return; }
        button.textContent = muted ? 'Sound: off' : 'Sound: on';
        button.setAttribute('aria-pressed', String(!muted));
    }

    function toggle() {
        muted = !muted;
        try { localStorage.setItem(STORAGE_KEY, muted ? '1' : '0'); } catch (e) { /* ignore */ }
        updateButton();
        play('click');   // plays only when the sound was just switched ON
    }

    // One delegated listener: any [data-sound] element plays its sound on click
    document.addEventListener('click', function (event) {
        const target = event.target.closest('[data-sound]');
        if (target) { play(target.dataset.sound); }
    });

    const toggleButton = document.getElementById('sound-toggle');
    if (toggleButton) { toggleButton.addEventListener('click', toggle); }
    updateButton();

    window.KZSound = { play: play, toggle: toggle, isMuted: function () { return muted; } };
})();
