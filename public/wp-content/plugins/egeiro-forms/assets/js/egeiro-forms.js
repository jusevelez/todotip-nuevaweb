(function () {
    'use strict';

    // Safety check — only run if WordPress localized this script
    if (typeof egeiroForms === 'undefined') {
        return;
    }

    var forms = [
        { id: 'egeiro-pqrs-form', type: 'pqrs' },
        { id: 'egeiro-trabaja-form', type: 'trabaja' }
    ];

    function initForm(config) {
        var form = document.getElementById(config.id);
        if (!form) return;

        // Spinner overlay
        var spinner = form.querySelector('.egeiro-forms-spinner');
        if (!spinner) {
            spinner = document.createElement('div');
            spinner.className = 'egeiro-forms-spinner';
            spinner.innerHTML =
                '<div class="egeiro-forms-spinner__ring"></div>' +
                '<span class="egeiro-forms-spinner__text">Enviando...</span>';
            form.appendChild(spinner);
        }

        // Message container
        var msgBox = form.querySelector('.egeiro-forms-message');
        if (!msgBox) {
            msgBox = document.createElement('div');
            msgBox.className = 'egeiro-forms-message';
            form.appendChild(msgBox);
        }

        // Mark submit button for disabled-state styling
        var submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.classList.add('egeiro-forms-submit');
        }

        // File input feedback (trabaja form only)
        if (config.type === 'trabaja') {
            var cvInput = document.getElementById('egeiro-cv-input');
            var cvLabel = document.getElementById('egeiro-cv-label');
            var cvZone  = document.getElementById('egeiro-cv-zone');

            if (cvInput && cvLabel) {
                cvInput.addEventListener('change', function () {
                    if (this.files && this.files.length > 0) {
                        cvLabel.textContent = this.files[0].name;
                        if (cvZone) cvZone.classList.add('egeiro-cv-zone--selected');
                    } else {
                        cvLabel.textContent = egeiroForms.cvDefaultText;
                        if (cvZone) cvZone.classList.remove('egeiro-cv-zone--selected');
                    }
                });
            }
        }
    }

    function showMessage(el, type, text) {
        var iconSvg = type === 'success'
            ? '<svg class="egeiro-forms-message__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
            : '<svg class="egeiro-forms-message__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/></svg>';

        el.className = 'egeiro-forms-message egeiro-forms-message--' + type;
        el.innerHTML = iconSvg + '<span>' + escapeHtml(text) + '</span>';
        el.classList.add('is-visible');

        if (type === 'success') {
            setTimeout(function () { el.classList.remove('is-visible'); }, 8000);
        }
    }

    function escapeHtml(text) {
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function resetCvInput() {
        var cvLabel = document.getElementById('egeiro-cv-label');
        var cvZone  = document.getElementById('egeiro-cv-zone');
        if (cvLabel) cvLabel.textContent = egeiroForms.cvDefaultText;
        if (cvZone) cvZone.classList.remove('egeiro-cv-zone--selected');
    }

    // Single capture-phase handler on document — fires before any other listener
    document.addEventListener('submit', function (e) {
        var target = e.target;
        if (target.id !== 'egeiro-pqrs-form' && target.id !== 'egeiro-trabaja-form') {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        var spinner   = target.querySelector('.egeiro-forms-spinner');
        var msgBox    = target.querySelector('.egeiro-forms-message');
        var submitBtn = target.querySelector('button[type="submit"]');

        // Prevent double-submit
        if (spinner && spinner.classList.contains('is-active')) return;

        // Show spinner
        if (spinner) spinner.classList.add('is-active');
        if (submitBtn) submitBtn.disabled = true;
        if (msgBox) {
            msgBox.classList.remove('is-visible');
            msgBox.className = 'egeiro-forms-message';
        }

        var formData = new FormData(target);
        formData.set('action', 'egeiro_forms_submit');
        formData.set('egeiro_forms_nonce', egeiroForms.nonce);

        fetch(egeiroForms.ajaxUrl, {
            method: 'POST',
            body: formData,
            credentials: 'same-origin'
        })
        .then(function (res) { return res.json(); })
        .then(function (data) {
            if (data.success) {
                if (msgBox) showMessage(msgBox, 'success', data.data.message);
                target.reset();
                if (target.id === 'egeiro-trabaja-form') resetCvInput();
            } else {
                var msg = (data.data && data.data.message)
                    ? data.data.message
                    : 'Error desconocido. Por favor intenta de nuevo.';
                if (msgBox) showMessage(msgBox, 'error', msg);
            }
        })
        .catch(function () {
            if (msgBox) showMessage(msgBox, 'error', 'Hubo un error de conexión. Por favor intenta más tarde.');
        })
        .finally(function () {
            if (spinner) spinner.classList.remove('is-active');
            if (submitBtn) submitBtn.disabled = false;
        });
    }, true); // true = capture phase

    // Init UI on all forms
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { forms.forEach(initForm); });
    } else {
        forms.forEach(initForm);
    }
})();
