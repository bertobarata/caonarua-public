/**
 * CNR Cookie Consent Banner
 * Exibe aviso de cookies na primeira visita e guarda preferência em localStorage.
 * Sem analytics/tracking externos: apenas cookies essenciais (língua).
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'cnr-cookie-consent';

  /* Textos por idioma */
  var TEXTS = {
    pt: {
      message: 'Utilizamos <strong>cookies essenciais</strong> para garantir o correto funcionamento do website (ex.: guardar a sua preferência de idioma). Não utilizamos cookies de rastreamento ou publicidade.',
      policy: 'Política de Cookies',
      accept: 'Aceitar',
      decline: 'Apenas Essenciais'
    },
    en: {
      message: 'We use <strong>essential cookies</strong> to ensure the website works correctly (e.g. saving your language preference). We do not use tracking or advertising cookies.',
      policy: 'Cookie Policy',
      accept: 'Accept',
      decline: 'Essential Only'
    },
    es: {
      message: 'Usamos <strong>cookies esenciales</strong> para garantizar el correcto funcionamiento del sitio web (p. ej., guardar tu preferencia de idioma). No usamos cookies de seguimiento ni publicidad.',
      policy: 'Política de Cookies',
      accept: 'Aceptar',
      decline: 'Solo Esenciales'
    },
    fr: {
      message: 'Nous utilisons des <strong>cookies essentiels</strong> pour assurer le bon fonctionnement du site (ex. : mémoriser votre préférence de langue). Nous n\'utilisons pas de cookies de suivi ou publicitaires.',
      policy: 'Politique de Cookies',
      accept: 'Accepter',
      decline: 'Essentiels Uniquement'
    }
  };

  function getLang() {
    var lang = localStorage.getItem('cnr-lang') || 'pt';
    return TEXTS[lang] ? lang : 'pt';
  }

  function hasConsent() {
    return localStorage.getItem(STORAGE_KEY) !== null;
  }

  function saveConsent(value) {
    localStorage.setItem(STORAGE_KEY, value);
  }

  function removeBanner(banner) {
    banner.classList.add('cnr-cookie-hiding');
    setTimeout(function () {
      if (banner && banner.parentNode) {
        banner.parentNode.removeChild(banner);
      }
    }, 350);
  }

  function createBanner() {
    var lang = getLang();
    var t = TEXTS[lang];

    var banner = document.createElement('div');
    banner.id = 'cnr-cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', t.policy);
    banner.innerHTML =
      '<div class="cnr-cookie-inner">' +
        '<p class="cnr-cookie-text">' + t.message + '</p>' +
        '<div class="cnr-cookie-actions">' +
          '<a href="politica-cookies.html" class="cnr-cookie-link">' + t.policy + '</a>' +
          '<button id="cnr-cookie-decline" class="cnr-cookie-btn cnr-cookie-btn--secondary">' + t.decline + '</button>' +
          '<button id="cnr-cookie-accept" class="cnr-cookie-btn cnr-cookie-btn--primary">' + t.accept + '</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(banner);

    document.getElementById('cnr-cookie-accept').addEventListener('click', function () {
      saveConsent('all');
      removeBanner(banner);
    });

    document.getElementById('cnr-cookie-decline').addEventListener('click', function () {
      saveConsent('essential');
      removeBanner(banner);
    });
  }

  function init() {
    if (hasConsent()) return;
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createBanner);
    } else {
      createBanner();
    }
  }

  init();
})();
