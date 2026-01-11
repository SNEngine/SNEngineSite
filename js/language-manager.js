// Language Manager
class LanguageManager {
  constructor() {
    // Initialize with both language objects that will be loaded in HTML
    this.translations = {
      'en': typeof LANG_EN !== 'undefined' ? LANG_EN : {},
      'ru': typeof LANG_RU !== 'undefined' ? LANG_RU : {}
    };

    this.currentLang = localStorage.getItem('snengine-lang') || 'en';

    // Load the initial language
    this.translatePage();
  }

  async loadLanguage(lang) {
    // Just switch the language without loading anything
    this.currentLang = lang;
    localStorage.setItem('snengine-lang', lang);

    // Update the language selector if it exists
    const langSelector = document.getElementById('language-selector');
    if (langSelector) {
      langSelector.value = lang;
    }

    this.translatePage();
  }
  
  translatePage() {
    // Translate elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.translations[this.currentLang][key];
      
      if (translation !== undefined) {
        // Check if the element is an input or textarea for value attribute
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
          element.placeholder = translation;
        } else {
          // Check if translation contains HTML tags
          if (translation.includes('<') && translation.includes('>')) {
            element.innerHTML = translation;
          } else {
            element.textContent = translation;
          }
        }
      }
    });
    
    // Update the language selector UI
    this.updateLanguageSelector();
  }
  
  updateLanguageSelector() {
    const langSelector = document.getElementById('language-selector');
    if (langSelector) {
      // Update the selected option
      langSelector.value = this.currentLang;
    }
  }
  
  switchLanguage(lang) {
    this.loadLanguage(lang);
  }
  
  getCurrentLanguage() {
    return this.currentLang;
  }
  
  getTranslation(key) {
    return this.translations[this.currentLang]?.[key] || key;
  }
}

// Initialize the language manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
  window.languageManager = new LanguageManager();

  // Add event listener for language selector if it exists
  // We'll try to add the event listener after a short delay to ensure DOM is updated
  setTimeout(() => {
    const langSelector = document.getElementById('language-selector');
    if (langSelector) {
      langSelector.addEventListener('change', (event) => {
        window.languageManager.switchLanguage(event.target.value);
      });
    }
  }, 100);

  // Listen for storage events to sync language across tabs/pages
  window.addEventListener('storage', (event) => {
    if (event.key === 'snengine-lang' && event.newValue !== event.oldValue) {
      // Update the language if it was changed in another tab/window
      window.languageManager.loadLanguage(event.newValue);
    }
  });
});