/**
 * profile.js - Profile page.
 * Shows the details of the logged-in user (from localStorage), the saved
 * tours / places and the requests sent from the contact form.
 * A visitor who is not logged in is sent to the login page.
 */
(function () {
    'use strict';

    var nameBox = document.getElementById('profile-name');
    if (!nameBox) { return; }

    var user = window.KZAuth.current();
    if (!user) {
        window.location.replace('login.html');
        return;
    }

    function setText(id, text) { document.getElementById(id).textContent = text; }

    function formatDate(isoString, withTime) {
        var options = { year: 'numeric', month: 'long', day: 'numeric' };
        if (withTime) { options.hour = '2-digit'; options.minute = '2-digit'; }
        return new Date(isoString).toLocaleDateString('en-US', options);
    }

    /* ---------- User details ---------- */
    setText('profile-avatar', user.name.trim().charAt(0).toUpperCase());
    setText('profile-name', user.name);
    setText('profile-email', user.email);
    setText('detail-name', user.name);
    setText('detail-email', user.email);
    setText('detail-phone', user.phone);
    setText('detail-since', formatDate(user.createdAt, false));

    document.getElementById('profile-logout').addEventListener('click', function () {
        window.KZAuth.logout();
        window.location.href = 'index.html';
    });

    /* ---------- Saved tours and places ---------- */
    function renderSaved(containerId, type, emptyText, linkText, linkHref) {
        var container = document.getElementById(containerId);
        var items = window.KZFav.list(type);
        container.innerHTML = '';

        if (!items.length) {
            var message = document.createElement('p');
            message.className = 'text-muted mb-0';
            message.append(emptyText + ' ');
            var link = document.createElement('a');
            link.href = linkHref;
            link.textContent = linkText;
            message.appendChild(link);
            container.appendChild(message);
            return;
        }

        items.forEach(function (item) {
            var row = document.createElement('div');
            row.className = 'saved-item';

            var image = document.createElement('img');
            image.src = item.image;
            image.alt = item.title;
            image.loading = 'lazy';

            var title = document.createElement('a');
            title.href = item.href;
            title.className = 'fw-semibold text-decoration-none flex-grow-1';
            title.textContent = item.title;

            var remove = document.createElement('button');
            remove.type = 'button';
            remove.className = 'btn btn-sm btn-outline-primary';
            remove.textContent = 'Remove';
            remove.addEventListener('click', function () {
                window.KZFav.toggle(type, item);   // saved -> removed
                renderSaved(containerId, type, emptyText, linkText, linkHref);
            });

            row.append(image, title, remove);
            container.appendChild(row);
        });
    }

    renderSaved('saved-tours', 'tours', 'You have not saved any tours yet.', 'Browse tours', 'tours.html');
    renderSaved('saved-places', 'places', 'You have not saved any places yet.', 'Browse destinations', 'destinations.html');

    /* ---------- Requests from the contact form ---------- */
    var requestList = document.getElementById('my-requests');
    var requests = window.KZAuth.requestsFor(user.email).reverse();

    if (!requests.length) {
        var empty = document.createElement('p');
        empty.className = 'text-muted mb-0';
        empty.append('You have not sent any requests yet. ');
        var contactLink = document.createElement('a');
        contactLink.href = 'contact.html';
        contactLink.textContent = 'Contact us';
        empty.appendChild(contactLink);
        requestList.appendChild(empty);
    } else {
        requests.forEach(function (request) {
            var item = document.createElement('div');
            item.className = 'saved-item';

            var text = document.createElement('div');
            var title = document.createElement('div');
            title.className = 'fw-semibold';
            title.textContent = request.tourLabel || 'General question';
            var meta = document.createElement('div');
            meta.className = 'small text-muted';
            meta.textContent = formatDate(request.date, true) + ' \u00B7 ' + request.message;

            text.append(title, meta);
            item.appendChild(text);
            requestList.appendChild(item);
        });
    }
})();
