let animated = false;
$(window).on('scroll', function() {
    const $counterSection = $('.counter');
    if ($counterSection.length === 0) return;
    
    const oTop = $counterSection.offset().top - window.innerHeight;
    if (!animated && $(window).scrollTop() > oTop) {
        $('.counter').each(function() {
            var $this = $(this),
                countTo = $this.attr('data-target');
            
            $({ countNum: $this.text() }).animate({
                countNum: countTo
            }, {
                duration: 2000,
                easing: 'swing',
                step: function() {
                    $this.text(Math.floor(this.countNum) + '+');
                },
                complete: function() {
                    $this.text(this.countNum + '+');
                }
            });
        });
        animated = true;
    }
});