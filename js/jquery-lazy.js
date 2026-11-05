$(document).ready(function () {
    // Функция проверки и загрузки картинок
    function loadLazyImages() {
        $('.lazy').each(function () {
            var $img = $(this);

            // Если у картинки уже нет data-src, значит она уже загружена
            if (!$img.attr('data-src')) {
                return;
            }

            var imagePosition = $img.offset().top; // Позиция картинки сверху
            var topOfWindow = $(window).scrollTop(); // Текущая позиция скролла
            var windowHeight = $(window).height(); // Высота видимой области экрана

            // Если картинка находится в зоне видимости (или приближается к ней)
            if (imagePosition < topOfWindow + windowHeight + 300) {
                var realSrc = $img.attr('data-src');

                // Меняем placeholder на реальную картинку (согласно подсказке к заданию)[cite: 3]
                $img.attr('src', realSrc);

                // Удаляем data-src, чтобы скрипт больше не обрабатывал эту картинку повторно
                $img.removeAttr('data-src');
            }
        });
    }

    // Проверяем картинки сразу при загрузке страницы (если они уже видны)
    loadLazyImages();

    // Отслеживаем скролл страницы с помощью метода .on('scroll')[cite: 3]
    $(window).on('scroll', function () {
        loadLazyImages();
    });
});