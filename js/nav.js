/**
 * nav.js - keyboard navigation for the main menu.
 *
 * When focus is on a menu item, the arrow keys move it to the next / previous
 * item, Home and End jump to the first / last item.
 */
(function () {
    'use strict';

    const menu = document.querySelector('#navbarNav .navbar-nav');
    if (!menu) { return; }

    // Only items that are visible and enabled can receive focus
    function getItems() {
        return Array.from(menu.querySelectorAll('a.nav-link, button')).filter(function (item) {
            return item.offsetParent !== null && !item.disabled;
        });
    }

    menu.addEventListener('keydown', function (event) {
        const items = getItems();
        const currentIndex = items.indexOf(document.activeElement);
        if (currentIndex === -1) { return; }

        let nextIndex;
        switch (event.key) {
            case 'ArrowRight':
            case 'ArrowDown':
                nextIndex = (currentIndex + 1) % items.length;                  // wrap to the first
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                nextIndex = (currentIndex - 1 + items.length) % items.length;   // wrap to the last
                break;
            case 'Home':
                nextIndex = 0;
                break;
            case 'End':
                nextIndex = items.length - 1;
                break;
            default:
                return;   // any other key: do nothing
        }

        event.preventDefault();   // stop the page from scrolling
        items[nextIndex].focus();
    });
})();
