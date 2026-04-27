/**
 * Sistema de troca de idiomas para CNR Creche Canina
 * Idiomas suportados: PT (Português), EN (English), ES (Español), FR (Français)
 */

(function() {
  'use strict';

  // Idioma padrão
  const DEFAULT_LANG = 'pt';

  // Bandeiras por idioma
  const FLAG_CONFIG = {
    pt: {
      src: 'assets/paises/hex/portugal1.webp',
      alt: 'Português'
    },
    en: {
      src: 'assets/paises/hex/reino-unido1.webp',
      alt: 'English'
    },
    es: {
      src: 'assets/paises/hex/espanha1.webp',
      alt: 'Español'
    },
    fr: {
      src: 'assets/paises/hex/franca2.webp',
      alt: 'Français'
    }
  };
  
  // Armazenamento do idioma atual
  let currentLang = localStorage.getItem('cnr-lang') || DEFAULT_LANG;

  /**
   * Inicializa o sistema de idiomas
   */
  function initLanguageSystem() {
    // Aplica o idioma salvo ao carregar a página
  applyLanguage(currentLang);
    
    // Configura os listeners dos botões de idioma
    setupLanguageButtons();
    
    // Atualiza a bandeira ativa no dropdown
    updateActiveFlag(currentLang);

  // Atualiza atributo lang do documento
  document.documentElement.lang = currentLang;
    
    // Configura o comportamento de fechar o dropdown
    setupDropdownBehavior();
  }

  /**
   * Configura o comportamento do dropdown (abrir/fechar)
   */
  function setCurrentFlagVisual(lang) {
    const config = FLAG_CONFIG[lang] || FLAG_CONFIG[DEFAULT_LANG];
    const currentFlagImg = document.getElementById('current-flag');
    if (currentFlagImg && config) {
      if (currentFlagImg.getAttribute('src') !== config.src) {
        currentFlagImg.setAttribute('src', config.src);
      }
      currentFlagImg.setAttribute('alt', config.alt);
      currentFlagImg.dataset.lang = lang;
    }

    const langTrigger = document.querySelector('.lang-trigger');
    if (langTrigger && config) {
      langTrigger.dataset.currentLang = lang;
      if (!langTrigger.dataset.baseAriaLabel) {
        langTrigger.dataset.baseAriaLabel = langTrigger.getAttribute('aria-label') || '';
      }
      if (!langTrigger.hasAttribute('data-i18n')) {
        var baseLabel = langTrigger.dataset.baseAriaLabel || '';
        var languageLabel = config.alt;
        var combined = baseLabel ? baseLabel + ' — ' + languageLabel : languageLabel;
        langTrigger.setAttribute('aria-label', combined.trim());
      }
    }

    document.querySelectorAll('.lang-trigger img, #current-flag').forEach(img => {
      img.style.width = '20px';
      img.style.height = '20px';
      img.style.maxWidth = '20px';
      img.style.maxHeight = '20px';
      img.style.minWidth = '20px';
      img.style.minHeight = '20px';
    });

    document.querySelectorAll('.lang-dropdown img').forEach(img => {
      img.style.width = '24px';
      img.style.height = '24px';
      img.style.maxWidth = '24px';
      img.style.maxHeight = '24px';
      img.style.minWidth = '24px';
      img.style.minHeight = '24px';
    });
  }

  function setupDropdownBehavior() {
    const langSelector = document.querySelector('.lang-selector');
    const langTrigger = document.querySelector('.lang-trigger');
    const langDropdown = document.querySelector('.lang-dropdown');
    
    if (!langSelector || !langTrigger || !langDropdown) return;
    
    // Initial state
    langSelector.classList.remove('open');
    langDropdown.style.display = 'none';
    langTrigger.setAttribute('aria-expanded', 'false');
    
    let isOpen = false;

    // Helper para abrir
    function openDropdown(){
      if(isOpen) return;
      isOpen = true;
      langSelector.classList.add('open');
      langTrigger.setAttribute('aria-expanded','true');
      setCurrentFlagVisual(currentLang);
    }
    // Helper para fechar
    function closeDropdown(){
      if(!isOpen) return;
      isOpen = false;
      langSelector.classList.remove('open');
      langTrigger.setAttribute('aria-expanded','false');
      setCurrentFlagVisual(currentLang);
    }
    
    // Toggle dropdown ao clicar no trigger
    langTrigger.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      isOpen ? closeDropdown() : openDropdown();
    });
    
    // Fechar dropdown ao clicar fora
    document.addEventListener('mousedown', function(e){
      if(!langSelector.contains(e.target)) closeDropdown();
    });
    document.addEventListener('touchstart', function(e){
      if(!langSelector.contains(e.target)) closeDropdown();
    }, {passive:true});
    
    // Fechar dropdown ao selecionar um idioma
    const langLinks = langDropdown.querySelectorAll('[data-lang]');
    langLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const selectedLang = this.getAttribute('data-lang');
        // Troca o idioma e fecha o dropdown
        switchLanguage(selectedLang);
        closeDropdown();
      });
    });
    
    // Prevenir que hover abra o dropdown quando gerenciado por JS
    // Desativa comportamento de hover automático (opcional: remover se já não existir CSS de hover)
    langSelector.addEventListener('mouseenter', function(){
      if(!isOpen) langDropdown.style.display='none';
    });

    // Fecha com tecla Escape
    document.addEventListener('keydown', function(e) {
      if(e.key === 'Escape') closeDropdown();
      // Navegação por setas dentro da lista
      if(isOpen && (e.key === 'ArrowDown' || e.key==='ArrowUp')){
        const focusable = Array.from(langLinks);
        let idx = focusable.indexOf(document.activeElement);
        if(e.key==='ArrowDown') idx = (idx+1)%focusable.length; else idx = (idx-1+focusable.length)%focusable.length;
        focusable[idx].focus();
        e.preventDefault();
      }
    });
  }

  /**
   * Configura os event listeners para os botões de idioma
   */
  function setupLanguageButtons() {
    const langButtons = document.querySelectorAll('[data-lang]');
    
    langButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const lang = this.getAttribute('data-lang');
        switchLanguage(lang);
      });
    });
  }

  /**
   * Troca o idioma da página
   * @param {string} lang - Código do idioma (pt, en, es, fr)
   */
  function switchLanguage(lang) {
    if (!lang) return;
    if (lang === currentLang) {
      updateActiveFlag(lang);
      return;
    }
    
    currentLang = lang;
    localStorage.setItem('cnr-lang', lang);
    
  applyLanguage(lang);
  updateActiveFlag(lang);
    
  // Atualiza o atributo lang do HTML
  document.documentElement.lang = lang;
  }

  /**
   * Aplica o idioma selecionado a todos os elementos traduzíveis
   * @param {string} lang - Código do idioma
   */
  function applyLanguage(lang) {
    // Verifica se existem traduções na página
    if (typeof window.translations === 'undefined') {
      console.warn('Traduções não encontradas para esta página');
      return;
    }

    const translations = window.translations[lang];
    if (!translations) {
      console.warn(`Traduções não encontradas para o idioma: ${lang}`);
      return;
    }

    // Aplica traduções a elementos com data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = getNestedTranslation(translations, key);
      
      if (translation) {
        // Se o elemento tiver filhos especiais (imagens, etc), preserva-os
        if (element.querySelector('picture, img.van-gif-title, img.paw-gif-title, img.house-gif-title')) {
          // Preserva elementos especiais e apenas atualiza o texto
          const specialElements = Array.from(element.children).filter(child => 
            child.tagName === 'PICTURE' || 
            child.classList.contains('van-gif-title') ||
            child.classList.contains('paw-gif-title') ||
            child.classList.contains('house-gif-title')
          );
          
          element.innerHTML = translation;
          specialElements.forEach(el => element.appendChild(el));
        } else {
          element.innerHTML = translation;
        }
      }
    });

    // Aplica traduções a placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      const translation = getNestedTranslation(translations, key);
      
      if (translation) {
        element.placeholder = translation;
      }
    });

    // Aplica traduções a atributos aria-label
    document.querySelectorAll('[data-i18n-aria]').forEach(element => {
      const key = element.getAttribute('data-i18n-aria');
      const translation = getNestedTranslation(translations, key);
      
      if (translation) {
        element.setAttribute('aria-label', translation);
      }
    });

    // Atualiza o título da página
    if (translations.pageTitle) {
      document.title = translations.pageTitle;
    }
  }

  /**
   * Obtém uma tradução aninhada usando notação de ponto (ex: "nav.home")
   * @param {object} obj - Objeto de traduções
   * @param {string} key - Chave com notação de ponto
   * @returns {string|null} - Tradução encontrada ou null
   */
  function getNestedTranslation(obj, key) {
    return key.split('.').reduce((o, k) => (o || {})[k], obj);
  }

  /**
   * Atualiza a bandeira ativa no dropdown
   * @param {string} lang - Código do idioma
   */
  function updateActiveFlag(lang) {
    // Remove classe active de todas as bandeiras
    document.querySelectorAll('.lang-dropdown a').forEach(link => {
      link.classList.remove('active');
    });
    
    // Adiciona classe active à bandeira selecionada
    const activeLink = document.querySelector(`.lang-dropdown a[data-lang="${lang}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }

    // Atualiza imagem/alt da bandeira atual
    setCurrentFlagVisual(lang);
  }

  /**
   * Retorna o idioma atual
   * @returns {string} - Código do idioma atual
   */
  function getCurrentLanguage() {
    return currentLang;
  }

  // Inicializa quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanguageSystem);
  } else {
    initLanguageSystem();
  }

  // Expõe funções públicas
  window.LanguageSwitcher = {
    switch: switchLanguage,
    current: getCurrentLanguage,
    init: initLanguageSystem
  };

})();
