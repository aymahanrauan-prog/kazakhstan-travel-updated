(function () {
    'use strict';

    var target = document.getElementById('current-datetime');
    if (!target) { return; }

    function formatNow() {
        var now = new Date();
        var datePart = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        var timePart = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
        return datePart + ', ' + timePart;
    }

    function update() {
        target.textContent = formatNow();
        target.setAttribute('datetime', new Date().toISOString());
    }

    update();
    setInterval(update, 1000);
})();
