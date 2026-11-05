$(document).ready(function () {
    'use strict';

    const $input = $('#search-input');
    const $suggestions = $('#search-suggestions');
    const $cards = $('.row.g-4 article'); // Карточки достопримечательностей

    // Список названий для подсказок
    const attractions = [];
    $cards.each(function () {
        attractions.push($(this).find('.card-title').text());
    });

    // Функция для подсветки ключевых слов с помощью регулярных выражений
    function highlightSearchQuery(keyword) {
        // Сначала убираем старую подсветку (возвращаем чистый текст)
        $('.card-title, .card-text').each(function () {
            var $el = $(this);
            $el.html($el.text());
        });

        if (!keyword || keyword.trim() === '') return;

        // Экранируем спецсимволы в поисковом запросе и создаем регулярное выражение (глобально, без учета регистра)
        var escapedKeyword = keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        var regex = new RegExp('(' + escapedKeyword + ')', 'gi');

        // Проходим по заголовкам и тексту карточек
        $('.card-title, .card-text').each(function () {
            var $el = $(this);
            var originalText = $el.text();

            if (regex.test(originalText)) {
                // Заменяем совпадение, оборачивая его в тег <mark> с желтым фоном от Bootstrap
                var highlightedHtml = originalText.replace(regex, '<mark class="bg-warning px-1 rounded">$1</mark>');
                $el.html(highlightedHtml);
            }
        });
    }

    $input.on('keyup', function () {
        const query = $(this).val().toLowerCase();
        const rawQuery = $(this).val();
        $suggestions.empty();

        if (query.length === 0) {
            $suggestions.hide();
            $cards.show();
            highlightSearchQuery(''); // Убираем подсветку при очистке
            return;
        }

        // Фильтрация карточек
        $cards.each(function () {
            const $card = $(this);
            const text = $card.text().toLowerCase();
            if (text.indexOf(query) !== -1) {
                $card.show();
            } else {
                $card.hide();
            }
        });

        // Генерация выпадающих подсказок (Autocomplete)
        const matches = attractions.filter(item => item.toLowerCase().includes(query));
        if (matches.length > 0) {
            matches.forEach(match => {
                $suggestions.append(`<li class="list-group-item list-group-item-action" style="cursor: pointer;">${match}</li>`);
            });
            $suggestions.show();
        } else {
            $suggestions.hide();
        }

        // Запускаем подсветку найденного текста
        highlightSearchQuery(rawQuery);
    });

    // Клик по подсказке
    $(document).on('click', '#search-suggestions li', function () {
        const selectedText = $(this).text();
        $input.val(selectedText);
        $suggestions.hide();

        // Автоматически фильтруем по выбранному
        $cards.each(function () {
            const $card = $(this);
            if ($card.text().toLowerCase().includes(selectedText.toLowerCase())) {
                $card.show();
            } else {
                $card.hide();
            }
        });

        highlightSearchQuery(selectedText);
    });

    // Скрывать подсказки при клике вне поля
    $(document).on('click', function (e) {
        if (!$(e.target).closest('#search-input, #search-suggestions').length) {
            $suggestions.hide();
        }
    });
});