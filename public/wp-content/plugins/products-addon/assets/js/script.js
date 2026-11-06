/**
 * Products Addon - Scripts
 */

(function($) {
    'use strict';

    $(document).ready(function() {
        // Initialize Products Catalog
        initProductsCatalog();
    });

    function initProductsCatalog() {
        // Add smooth hover effects
        $('.pa-product-card').on('mouseenter', function() {
            $(this).addClass('is-hovered');
        }).on('mouseleave', function() {
            $(this).removeClass('is-hovered');
        });

        // CTA button interaction
        $('.pa-cta-button').on('click', function(e) {
            var href = $(this).attr('href');
            if (href && href.startsWith('#')) {
                var target = $(href);
                if (target.length) {
                    e.preventDefault();
                    $('html, body').animate({
                        scrollTop: target.offset().top - 80
                    }, 600, 'swing');
                }
            }
        });
    }

})(jQuery);
