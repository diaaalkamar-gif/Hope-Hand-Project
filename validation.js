
(function () {
  'use strict';


  var EMAIL_RE = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

  var NAME_RE = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,}$/;

  var PHONE_RE = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/;

  var PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d|.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

  function isBlank(v) {
    return !v || v.trim().length === 0;
  }

  function isValidEmail(v) {
    if (!v) return false;
    var email = v.trim().toLowerCase();
    if (!EMAIL_RE.test(email)) return false;

    var parts = email.split('@');
    if (parts.length !== 2) return false;

    var user = parts[0];
    var domain = parts[1];

    if (!user || user.length === 0 || !domain || domain.length === 0) return false;

    var domainParts = domain.split('.');
    if (domainParts.length < 2) return false;

    for (var i = 0; i < domainParts.length; i++) {
      var part = domainParts[i];
      if (!part || part.length === 0) return false;
      if (part.startsWith('-') || part.endsWith('-')) return false;
    }

    var mainDomain = domainParts[domainParts.length - 2];
    var tld = domainParts[domainParts.length - 1];

    if (!mainDomain || mainDomain.length < 1) return false;
    if (!tld || tld.length < 2 || !/^[a-z]+$/.test(tld)) return false;

    // Reject incomplete or mistyped "gmail" (e.g., g, gm, gma, gmai, gamil, gmal, gmaill, gmaiil)
    var gmailTypos = ['g', 'gm', 'gma', 'gmai', 'gamil', 'gmal', 'gmaill', 'gmaiil', 'gmil', 'gemail'];
    if (gmailTypos.indexOf(mainDomain) !== -1) {
      return false;
    }

    // Reject incomplete or mistyped yahoo/hotmail/outlook
    var otherTypos = ['yaho', 'yaho0', 'ymail', 'hotmai', 'hotm', 'hotmial', 'outloo', 'outlok'];
    if (otherTypos.indexOf(mainDomain) !== -1) {
      return false;
    }

    // Reject incomplete .com typos for popular email providers (e.g. .c, .cm, .co when standalone)
    var popularProviders = ['gmail', 'yahoo', 'hotmail', 'outlook', 'icloud', 'live', 'msn', 'aol', 'yandex', 'proton', 'protonmail'];
    if (popularProviders.indexOf(mainDomain) !== -1) {
      if (tld === 'c' || tld === 'cm' || (tld === 'co' && domainParts.length === 2)) {
        return false;
      }
      var validProviderTlds = ['com', 'net', 'org', 'edu', 'gov', 'fr', 'de', 'es', 'it', 'ca', 'au', 'io'];
      if (domainParts.length === 2 && validProviderTlds.indexOf(tld) === -1) {
        return false;
      }
    }

    return true;
  }

  function isValidName(v) {
    return NAME_RE.test(v.trim());
  }

  function isValidPhone(v) {
    return PHONE_RE.test(v.trim());
  }

  function isStrongPassword(v) {
    return PASSWORD_RE.test(v);
  }



  function getOrCreateError(field, id) {
    var el = document.getElementById(id);
    if (!el) {
      el = document.createElement('span');
      el.id = id;
      el.className = 'validation-error';
      el.setAttribute('role', 'alert');
      if (field.parentNode) {
        field.parentNode.appendChild(el);
      }
    }
    return el;
  }

  function showError(field, msg) {
    var id = (field.id || field.name || 'field') + '-error';
    var el = getOrCreateError(field, id);
    el.textContent = msg;
    field.classList.add('field-invalid');
    field.classList.remove('field-valid');
    field.setAttribute('aria-invalid', 'true');
  }

  function showValid(field) {
    var id = (field.id || field.name || 'field') + '-error';
    var el = document.getElementById(id);
    if (el && el.parentNode) {
      el.parentNode.removeChild(el);
    }
    field.classList.remove('field-invalid');
    field.classList.add('field-valid');
    field.setAttribute('aria-invalid', 'false');
  }

  function clearState(field) {
    var id = (field.id || field.name || 'field') + '-error';
    var el = document.getElementById(id);
    if (el && el.parentNode) {
      el.parentNode.removeChild(el);
    }
    field.classList.remove('field-invalid', 'field-valid');
    field.removeAttribute('aria-invalid');
  }



  function validateEmail(field) {
    var v = field.value;
    if (isBlank(v)) return 'This field is required. Please enter your email address.';
    if (!isValidEmail(v)) return 'Please enter a complete and valid email address ending with a full domain (e.g. name@domain.com).';
    return '';
  }

  function validatePassword(field) {
    var v = field.value;
    if (isBlank(v)) return 'This field is required. Please enter a password.';
    if (!isStrongPassword(v)) return 'Password must be at least 8 characters long and contain uppercase, lowercase, and a number or symbol.';
    return '';
  }

  function validateName(field) {
    var v = field.value;
    if (isBlank(v)) return 'This field is required. Please enter your name.';
    if (!isValidName(v)) return 'Please enter a valid name (at least 2 letters).';
    return '';
  }

  function validatePhone(field) {
    var v = field.value;
    if (isBlank(v)) {
      if (field.hasAttribute('required')) return 'This field is required. Please enter your phone number.';
      return '';
    }
    if (!isValidPhone(v)) return 'Please enter a valid phone number.';
    return '';
  }

  function validateSubject(field) {
    var v = field.value;
    if (isBlank(v)) {
      if (field.hasAttribute('required')) return 'This field is required. Please enter a subject.';
      return '';
    }
    if (v.trim().length < 2) return 'Subject must be at least 2 characters long.';
    return '';
  }

  function validateMessage(field) {
    var v = field.value;
    if (isBlank(v)) return 'This field is required. Please enter your message.';
    if (v.trim().length < 5) return 'Message must be at least 5 characters long.';
    return '';
  }

  function validateRequired(field) {
    var v = field.value;
    if (isBlank(v)) return 'This field is required.';
    return '';
  }



  function getValidatorForField(field) {
    var type = (field.type || '').toLowerCase();
    var name = (field.name || field.id || field.className || '').toLowerCase();

    if (type === 'email' || name.includes('email')) return validateEmail;
    if (type === 'password' || name.includes('password')) return validatePassword;
    if (type === 'tel' || name.includes('phone')) return validatePhone;
    if (field.tagName === 'TEXTAREA' || name.includes('message')) return validateMessage;
    if (name.includes('name')) return validateName;
    if (name.includes('subject')) return validateSubject;
    if (field.hasAttribute('required')) return validateRequired;

    return null;
  }

  function runValidator(field, validator) {
    if (!validator) return true;
    var msg = validator(field);
    if (msg) {
      showError(field, msg);
      return false;
    }
    showValid(field);
    return true;
  }

  function attachRealtime(field, validator) {
    if (!validator) return;
    ['input', 'blur'].forEach(function (evt) {
      field.addEventListener(evt, function () {
        if (field.value.length > 0 || field.classList.contains('field-invalid')) {
          runValidator(field, validator);
        }
      });
    });
  }



  var toastTimer = null;

  function showToast(msg) {
    var toast = document.getElementById('toastNotification');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toastNotification';
      toast.className = 'toast-notification';
      toast.setAttribute('role', 'alert');
      toast.setAttribute('aria-live', 'polite');
      toast.innerHTML = '<svg class="toast-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="22" height="22"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><span class="toast-message"></span>';
      document.body.appendChild(toast);
    }
    var msgEl = toast.querySelector('.toast-message');
    if (msgEl) msgEl.textContent = msg;

    if (toastTimer) clearTimeout(toastTimer);
    toast.classList.add('show');
    toastTimer = setTimeout(function () {
      toast.classList.remove('show');
      toastTimer = null;
    }, 4000);
  }

  function showInlineSuccess(form, msg) {
    var existingAlert = form.querySelector('.form-success-banner, .form-error-banner');
    if (existingAlert) {
      existingAlert.parentNode.removeChild(existingAlert);
    }

    var alertBox = document.createElement('div');
    alertBox.className = 'form-success-banner';
    alertBox.setAttribute('role', 'status');
    alertBox.innerHTML = '<i class="fa-solid fa-circle-check"></i> <span>' + msg + '</span>';

    form.appendChild(alertBox);

    setTimeout(function () {
      if (alertBox.parentNode) {
        alertBox.parentNode.removeChild(alertBox);
      }
    }, 6000);
  }

  function showInlineError(form, msg) {
    var existingAlert = form.querySelector('.form-error-banner, .form-success-banner');
    if (existingAlert) {
      existingAlert.parentNode.removeChild(existingAlert);
    }

    var alertBox = document.createElement('div');
    alertBox.className = 'form-error-banner';
    alertBox.setAttribute('role', 'alert');
    alertBox.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> <span>' + msg + '</span>';

    form.appendChild(alertBox);

    setTimeout(function () {
      if (alertBox.parentNode) {
        alertBox.parentNode.removeChild(alertBox);
      }
    }, 6000);
  }



  function initForms() {
    var forms = document.querySelectorAll('form');
    forms.forEach(function (form) {
      form.setAttribute('novalidate', 'true');
      var inputs = form.querySelectorAll('input, select, textarea');
      var fieldsToValidate = [];

      inputs.forEach(function (input) {
        var fn = getValidatorForField(input);
        if (fn) {
          fieldsToValidate.push({ el: input, fn: fn });
          attachRealtime(input, fn);
        }
      });

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var allValid = true;
        var firstInvalid = null;

        var isContact = form.id === 'contactForm' || form.classList.contains('contact-form');
        var isNewsletter = form.classList.contains('footer-newsletter-form') || form.classList.contains('newsletter-form');

        var existingError = form.querySelector('.form-error-banner');
        if (existingError && existingError.parentNode) {
          existingError.parentNode.removeChild(existingError);
        }

        fieldsToValidate.forEach(function (f) {
          var ok = runValidator(f.el, f.fn);
          if (!ok) {
            allValid = false;
            if (!firstInvalid) firstInvalid = f.el;
          }
        });

        if (!allValid) {
          if (firstInvalid && firstInvalid.focus) firstInvalid.focus();
          return;
        }

        fieldsToValidate.forEach(function (f) { clearState(f.el); });
        form.reset();

        var successMsg = 'Thank you! Your submission was successful.';
        if (isContact) {
          successMsg = 'Thank you! Your message has been sent successfully.';
        } else if (isNewsletter) {
          successMsg = 'Thank you for subscribing to our newsletter!';
        }

        showInlineSuccess(form, successMsg);
      });
    });
  }



  function createDonationModal() {
    var modal = document.getElementById('donationSuccessModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'donationSuccessModal';
      modal.className = 'donation-modal-overlay';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-labelledby', 'donationModalTitle');
      modal.innerHTML =
        '<div class="donation-modal-card">' +
        '<button type="button" class="donation-modal-close" aria-label="Close modal">&times;</button>' +
        '<div class="donation-modal-icon-wrap">' +
        '<i class="fa-solid fa-heart"></i>' +
        '</div>' +
        '<h2 id="donationModalTitle" class="donation-modal-title">Thank You For Your Support!</h2>' +
        '<div class="donation-modal-amount-badge" id="donationModalAmount">$100</div>' +
        '<p class="donation-modal-body">' +
        'Your generous donation directly funds life-changing programs in education, clean water, and healthcare for communities in need. A confirmation receipt has been sent to your records.' +
        '</p>' +
        '<button type="button" class="donation-modal-btn-primary" id="donationModalCloseBtn">Close</button>' +
        '</div>';
      document.body.appendChild(modal);

      var closeBtns = modal.querySelectorAll('.donation-modal-close, #donationModalCloseBtn');
      closeBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          modal.classList.remove('show');
        });
      });

      modal.addEventListener('click', function (e) {
        if (e.target === modal) {
          modal.classList.remove('show');
        }
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
          modal.classList.remove('show');
        }
      });
    }
    return modal;
  }

  function showDonationModal(amountStr) {
    var modal = createDonationModal();
    var amountEl = modal.querySelector('#donationModalAmount');
    if (amountEl) {
      amountEl.textContent = amountStr;
    }
    modal.classList.add('show');
  }

  function initDonationButtons() {

    var donatePrimaryBtns = document.querySelectorAll('.donate-primary');
    donatePrimaryBtns.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var card = btn.closest('.donation-card') || document;
        var activeBtn = card.querySelector('.amount-btn.active');
        var customInput = card.querySelector('.custom-amount-input') || document.getElementById('customAmount');

        var amountVal = activeBtn ? (activeBtn.getAttribute('data-amount') || activeBtn.textContent.trim()) : '100';
        var finalAmount = '$100';

        if (amountVal === 'custom' || amountVal.toLowerCase() === 'custom') {
          if (customInput) {
            clearState(customInput);
            var val = customInput.value ? customInput.value.trim() : '';
            var numVal = parseFloat(val);

            if (!val || isNaN(numVal) || numVal <= 0) {
              showError(customInput, 'Please enter a valid custom donation amount (minimum $1).');
              customInput.focus();
              return;
            } else {
              showValid(customInput);
              finalAmount = '$' + numVal.toLocaleString();
            }
          } else {
            finalAmount = '$100';
          }
        } else {
          var cleanNum = amountVal.replace(/[^0-9.]/g, '');
          finalAmount = cleanNum ? ('$' + cleanNum) : (amountVal.startsWith('$') ? amountVal : '$' + amountVal);
        }

        if (customInput) {
          customInput.value = '';
          clearState(customInput);
        }

        showDonationModal(finalAmount);
      });
    });


    var tierBtns = document.querySelectorAll('.cards-grid .btn, .cards-grid .btn-champion');
    tierBtns.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        var card = btn.closest('.card');
        if (card) {
          e.preventDefault();
          var priceEl = card.querySelector('.price');
          var tierNameEl = card.querySelector('.card-h4');
          var priceText = priceEl ? priceEl.textContent.trim().split('/')[0].trim() : '$50';
          var tierName = tierNameEl ? tierNameEl.textContent.trim() : 'Tier';
          showDonationModal(priceText + ' (' + tierName + ')');
        }
      });
    });


    var customInputs = document.querySelectorAll('.custom-amount-input, #customAmount');
    customInputs.forEach(function (input) {
      input.addEventListener('input', function () {
        if (input.classList.contains('field-invalid')) {
          var numVal = parseFloat(input.value.trim());
          if (input.value.trim() && !isNaN(numVal) && numVal > 0) {
            showValid(input);
          }
        }
      });
    });
  }

  function initAll() {
    initForms();
    initDonationButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

})();

