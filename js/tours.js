/**
 * tours.js - interactive Tours page.
 *
 *   - Tour data is stored as objects (class Tour) in an array
 *   - Cards are created with a loop / map and added to the page with the DOM API
 *   - Filters (price, category, location) are handled with a switch statement
 *   - "Load more" appends extra cards without reloading the page
 *   - Star rating: click a star to rate a tour (saved in localStorage)
 *   - Sound effects and CSS animations are triggered by these events
 */
(function () {
    'use strict';

    const container = document.getElementById('tours-container');
    if (!container) { return; }

    const RATINGS_KEY = 'kz-travel-ratings';
    const FIRST_PAGE = 6;    // cards shown at the start
    const LOAD_STEP = 2;     // cards added by one click on "Load more"

    /* ---------- Data: objects and methods ---------- */

    class Tour {
        constructor(data) {
            Object.assign(this, data);
        }

        get priceLabel() {
            return '$' + this.price;
        }

        get reviewLabel() {
            return this.rating + '/10 \u00B7 ' + this.reviews + ' reviews';
        }

        // Does this tour pass the current filters?
        matches(filters) {
            const priceOk = this.price >= filters.minPrice && this.price <= filters.maxPrice;
            const categoryOk = filters.categories.length === 0 || filters.categories.includes(this.category);
            const locationOk = filters.locations.length === 0 || filters.locations.includes(this.location);
            return priceOk && categoryOk && locationOk;
        }
    }

    const tours = [
        { id: 1, title: 'Best of Almaty: City Tour', subtitle: 'Excursions in Almaty', category: 'Individual Excursions', location: 'Almaty', price: 109, rating: 9.8, reviews: 122, image: 'images/medeu.avif' },
        { id: 2, title: 'Best of Almaty: Mountains', subtitle: 'Excursions in Almaty', category: 'Active Outdoor', location: 'Almaty', price: 223, rating: 9.7, reviews: 59, image: 'images/Almaty-mountains.avif' },
        { id: 3, title: 'Charyn Canyon Excursion', subtitle: 'Excursions in Almaty', category: 'Individual Excursions', location: 'Almaty Region', price: 298, rating: 9.6, reviews: 64, image: 'images/Charyn.jpg' },
        { id: 4, title: 'Big Almaty Lake Tour', subtitle: 'Excursions in Almaty', category: 'Active Outdoor', location: 'Almaty', price: 150, rating: 9.7, reviews: 25, image: 'images/Big_Almaty_lake.avif' },
        { id: 5, title: 'Kaindy & Kolsay Lakes', subtitle: 'Almaty Region', category: 'Individual Tours', location: 'Kaindy Lake', price: 210, rating: 9.6, reviews: 34, image: 'images/kolsai.avif' },
        { id: 6, title: 'Altyn-Emel National Park', subtitle: 'Almaty Region', category: 'Individual Tours', location: 'Almaty Region', price: 350, rating: 9.8, reviews: 15, image: 'images/altyn-emel.avif' },
        // Extra tours - they appear after pressing "Load more"
        { id: 7, title: 'Astana: Baiterek & Modern City', subtitle: 'Excursions in Astana', category: 'Individual Excursions', location: 'Astana', price: 95, rating: 9.5, reviews: 41, image: 'images/baiterek.avif' },
        { id: 8, title: 'Eagle Hunters Experience', subtitle: 'Ethno activities, Almaty Region', category: 'Ethno Activities', location: 'Almaty Region', price: 260, rating: 9.9, reviews: 18, image: 'images/EagleHunters.avif' },
        { id: 9, title: 'Dombra & Dastarkhan Evening', subtitle: 'Ethno activities in Astana', category: 'Ethno Activities', location: 'Astana', price: 80, rating: 9.6, reviews: 27, image: 'images/dombyra.avif' },
        { id: 10, title: 'Kokpar & Horse Riding Day', subtitle: 'Active outdoor, Almaty Region', category: 'Active Outdoor', location: 'Almaty Region', price: 180, rating: 9.4, reviews: 12, image: 'images/Kokpar.avif' }
    ].map(function (data) { return new Tour(data); });   // higher-order function: map

    /* ---------- State ---------- */

    const sidebar = document.getElementById('filters-sidebar');
    const priceSlider = document.getElementById('price-range');
    const minInput = document.getElementById('price-min');
    const maxInput = document.getElementById('price-max');
    const resetButton = document.getElementById('reset-filters');
    const loadMoreButton = document.getElementById('load-more');
    const countBadge = document.getElementById('results-count');
    const emptyMessage = document.getElementById('no-results');

    const MAX_PRICE = Number(priceSlider.max);

    const filters = { minPrice: 0, maxPrice: MAX_PRICE, categories: [], locations: [] };
    let shownCount = FIRST_PAGE;    // how many cards the user is allowed to see
    let renderedCount = 0;          // how many cards are already in the DOM
    let results = tours.slice();    // tours that pass the filters
    let userRatings = loadRatings();

    /* ---------- Ratings (localStorage) ---------- */

    function loadRatings() {
        try { return JSON.parse(localStorage.getItem(RATINGS_KEY)) || {}; }
        catch (e) { return {}; }
    }

    function saveRatings() {
        try { localStorage.setItem(RATINGS_KEY, JSON.stringify(userRatings)); } catch (e) { /* ignore */ }
    }

    // Colour the stars up to `rating` and update the text under them
    function paintStars(card, rating) {
        card.querySelectorAll('.star').forEach(function (star) {
            const isSelected = Number(star.dataset.value) <= rating;
            star.classList.toggle('selected', isSelected);
            star.setAttribute('aria-pressed', String(isSelected));
        });
        const label = card.querySelector('.rating-text');
        label.textContent = rating > 0 ? 'Your rating: ' + rating + '/5' : 'Rate this tour';
    }

    function setRating(card, value) {
        const tourId = card.dataset.tourId;
        // Clicking the same star again clears the rating
        const newRating = userRatings[tourId] === value ? 0 : value;
        userRatings[tourId] = newRating;
        saveRatings();
        paintStars(card, newRating);

        if (newRating > 0) {
            // Pop animation on the clicked star
            const star = card.querySelector('.star[data-value="' + value + '"]');
            star.classList.remove('star-pop');
            void star.offsetWidth;   // restart the animation
            star.classList.add('star-pop');
            window.KZSound.play('star');
        }
    }

    /* ---------- Rendering ---------- */

    function createCard(tour, animationOrder) {
        const column = document.createElement('div');
        column.className = 'col-12 col-md-6';

        // Five star buttons built with Array.from + map
        const stars = Array.from({ length: 5 }, function (_, i) {
            const value = i + 1;
            return '<button type="button" class="star" data-value="' + value + '" aria-pressed="false" ' +
                'aria-label="Rate ' + value + ' out of 5">\u2605</button>';
        }).join('');

        column.innerHTML =
            '<article class="tour-card fade-in-up" data-tour-id="' + tour.id + '">' +
                '<div class="tour-card-content d-flex flex-column justify-content-between h-100 p-3">' +
                    '<span class="badge align-self-start text-bg-light">' + tour.reviewLabel + '</span>' +
                    '<div class="tour-overlay p-3 rounded-3">' +
                        '<h2 class="h5 text-white">' + tour.title + '</h2>' +
                        '<p class="small text-white-50 mb-2">' + tour.subtitle + '</p>' +
                        '<div class="rating-row mb-2">' +
                            '<div class="rating-stars" role="group" aria-label="Rate ' + tour.title + '">' + stars + '</div>' +
                            '<span class="rating-text small text-white-50">Rate this tour</span>' +
                        '</div>' +
                        '<div class="d-flex justify-content-between align-items-center gap-2">' +
                            '<span class="fs-5 fw-bold">' + tour.priceLabel + '</span>' +
                            '<a href="contact.html" class="btn btn-danger btn-sm" data-sound="click">Book now</a>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</article>';

        const card = column.querySelector('.tour-card');
        card.style.backgroundImage = "url('" + tour.image + "')";
        card.style.animationDelay = (animationOrder * 80) + 'ms';   // cards appear one after another
        paintStars(card, userRatings[tour.id] || 0);
        return column;
    }

    // Adds the cards that are allowed to be visible but are not in the DOM yet.
    // With clearFirst = true the container is emptied and rebuilt.
    function renderTours(clearFirst) {
        if (clearFirst) {
            container.innerHTML = '';
            renderedCount = 0;
        }

        const toAdd = results.slice(renderedCount, shownCount);
        for (let i = 0; i < toAdd.length; i++) {            // loop over the new cards
            container.appendChild(createCard(toAdd[i], i));
        }
        renderedCount += toAdd.length;

        updateStatus();
    }

    function updateStatus() {
        const visible = Math.min(shownCount, results.length);
        countBadge.textContent = results.length === 0
            ? '0 results'
            : 'Showing ' + visible + ' of ' + results.length;

        emptyMessage.hidden = results.length > 0;
        loadMoreButton.hidden = shownCount >= results.length;
    }

    /* ---------- Filters ---------- */

    function applyFilters() {
        results = tours.filter(function (tour) { return tour.matches(filters); });   // higher-order: filter
        shownCount = FIRST_PAGE;
        renderTours(true);
    }

    // Collect the values of all checked checkboxes of one group
    function getChecked(groupName) {
        return Array.from(sidebar.querySelectorAll('input[data-filter="' + groupName + '"]:checked'))
            .map(function (input) { return input.value; });
    }

    function readNumber(input, fallback) {
        const value = parseInt(input.value, 10);
        return isNaN(value) ? fallback : value;
    }

    // One handler for every filter control; switch decides what changed
    function handleFilterChange(event) {
        const filterName = event.target.dataset.filter;

        switch (filterName) {
            case 'price-range':                       // the slider sets the maximum price
                filters.maxPrice = Number(priceSlider.value);
                maxInput.value = priceSlider.value;
                break;
            case 'price-min':
                filters.minPrice = readNumber(minInput, 0);
                break;
            case 'price-max':
                filters.maxPrice = readNumber(maxInput, MAX_PRICE);
                priceSlider.value = filters.maxPrice;
                break;
            case 'category':
                filters.categories = getChecked('category');
                window.KZSound.play('click');
                break;
            case 'location':
                filters.locations = getChecked('location');
                window.KZSound.play('click');
                break;
            default:
                return;   // not a filter control
        }

        applyFilters();
    }

    function resetFilters() {
        // Clear every input in the sidebar
        sidebar.querySelectorAll('input[type="checkbox"]').forEach(function (input) { input.checked = false; });
        priceSlider.value = MAX_PRICE;
        minInput.value = 0;
        maxInput.value = MAX_PRICE;

        filters.minPrice = 0;
        filters.maxPrice = MAX_PRICE;
        filters.categories = [];
        filters.locations = [];
        applyFilters();
    }

    /* ---------- Events ---------- */

    sidebar.addEventListener('input', handleFilterChange);
    resetButton.addEventListener('click', resetFilters);

    // "Load more": append the next cards without reloading the page
    loadMoreButton.addEventListener('click', function () {
        shownCount += LOAD_STEP;
        renderTours(false);
    });

    // Star clicks: one listener on the container (event delegation)
    container.addEventListener('click', function (event) {
        const star = event.target.closest('.star');
        if (!star) { return; }
        setRating(star.closest('.tour-card'), Number(star.dataset.value));
    });

    renderTours(true);
})();
