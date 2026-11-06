/* Egeiro WhatsApp Floating Action Button */
(function () {
    'use strict';

    function initFab() {
        var button = document.getElementById('egeiro-whfab-button');
        var menu   = document.getElementById('egeiro-whfab-menu');

        if (!button || !menu) {
            return;
        }

        function toggleMenu() {
            var isOpen = menu.classList.contains('is-open');

            if (isOpen) {
                menu.classList.remove('is-open');
                menu.setAttribute('aria-hidden', 'true');
                button.setAttribute('aria-expanded', 'false');
            } else {
                menu.classList.add('is-open');
                menu.setAttribute('aria-hidden', 'false');
                button.setAttribute('aria-expanded', 'true');
            }
        }

        function closeMenu() {
            menu.classList.remove('is-open');
            menu.setAttribute('aria-hidden', 'true');
            button.setAttribute('aria-expanded', 'false');
        }

        button.addEventListener('click', function (e) {
            e.stopPropagation();
            toggleMenu();
        });

        document.addEventListener('click', function (e) {
            if (!button.contains(e.target) && !menu.contains(e.target)) {
                closeMenu();
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && menu.classList.contains('is-open')) {
                closeMenu();
                button.focus();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFab);
    } else {
        initFab();
    }
})();
