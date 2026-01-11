// Navigation and Footer Generator
class NavFooterGenerator {
  constructor() {
    this.currentLang = localStorage.getItem('snengine-lang') || 'en';
    this.translations = {
      'en': {
        nav_main: "Main",
        nav_code_editor: "Code Editor",
        nav_yaml_editor: "YAML Editor",
        nav_docs: "Docs",
        nav_demo_game: "Demo Game",
        nav_contacts: "Contacts",
        nav_download: "Download",
        footer_copyright: "SNEngine"
      },
      'ru': {
        nav_main: "Главная",
        nav_code_editor: "Редактор кода",
        nav_yaml_editor: "Редактор YAML",
        nav_docs: "Документация",
        nav_demo_game: "Демо-игра",
        nav_contacts: "Контакты",
        nav_download: "Скачать",
        footer_copyright: "SNEngine"
      }
    };
  }

  generateHeader() {
    const currentPage = window.location.pathname.split('/').pop();
    const translations = this.translations[this.currentLang];

    // Определяем активные классы для навигации
    const isActive = (page) => currentPage === page ? 'active' : '';

    let headerHTML = `
      <div class="header-content">
        <div class="logo-and-nav">
          <a href="index.html" class="logo">
            <img src="images/icon_nav_light.png" alt="SNEngine Logo" class="logo-icon logo-icon-light">
            <img src="images/icon_nav_dark.png" alt="SNEngine Logo" class="logo-icon logo-icon-dark">
            <span class="logo-text">Engine</span>
          </a>
          <nav class="nav">
            <a href="index.html" class="${isActive('index.html') || currentPage === '' ? 'active' : ''}">${translations.nav_main}</a>
            <a href="code-editor.html" class="${isActive('code-editor.html') ? 'active' : ''}">${translations.nav_code_editor}</a>
            <a href="yaml-editor.html" class="${isActive('yaml-editor.html') ? 'active' : ''}">${translations.nav_yaml_editor}</a>
            <a href="https://github.com/SNEngine/SNEngineDocs/wiki/" target="_blank">${translations.nav_docs}</a>
            <a href="https://github.com/SNEngine/Nagatoro-Novel-Game" target="_blank">${translations.nav_demo_game}</a>
            <a href="https://t.me/Siphome" target="_blank">${translations.nav_contacts}</a>
            <a href="https://github.com/Siphoin/SNEngine" target="_blank">${translations.nav_download}</a>
          </nav>
        </div>
        <select id="language-selector" class="lang-selector">
          <option value="en">EN</option>
          <option value="ru">RU</option>
        </select>
      </div>
    `;

    return headerHTML;
  }

  generateFooter() {
    const translations = this.translations[this.currentLang];
    
    const footerHTML = `
      <footer class="footer">
        © <span id="currentYear"></span> <span>${translations.footer_copyright}</span>
      </footer>
    `;
    
    return footerHTML;
  }

  updateLanguage() {
    this.currentLang = localStorage.getItem('snengine-lang') || 'en';
    this.updateHeader();
    this.updateFooter();

    // Also update other components if language manager exists
    if (window.languageManager) {
      window.languageManager.loadLanguage(this.currentLang);
    }
  }

  updateHeader() {
    const header = document.querySelector('header');
    if (header) {
      header.innerHTML = this.generateHeader();
      this.setupLanguageSelector();
    }
  }

  updateFooter() {
    const footer = document.querySelector('footer');
    if (footer) {
      footer.innerHTML = this.generateFooter();
      this.updateCurrentYear();
    }
  }

  updateCurrentYear() {
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }
  }

  setupLanguageSelector() {
    const langSelector = document.getElementById('language-selector');
    if (langSelector) {
      langSelector.value = this.currentLang;

      // Remove existing event listener if any
      const newSelector = langSelector.cloneNode(true);
      langSelector.parentNode.replaceChild(newSelector, langSelector);

      const updatedSelector = document.getElementById('language-selector');
      updatedSelector.addEventListener('change', (event) => {
        const newLang = event.target.value;
        localStorage.setItem('snengine-lang', newLang);

        // Update the current language
        this.currentLang = newLang;

        // Update the header and footer with new language
        this.updateHeader();
        this.updateFooter();

        // Trigger language update for other components
        if (window.languageManager) {
          window.languageManager.loadLanguage(newLang);
        } else {
          // If language manager isn't ready yet, reload the page
          window.location.reload();
        }
      });
    }
  }

  init() {
    // Update current year
    this.updateCurrentYear();

    // Generate header if not already present
    const header = document.querySelector('header');
    if (header) {
      header.innerHTML = this.generateHeader();
    }

    // Generate footer if not already present
    const footer = document.querySelector('footer');
    if (footer) {
      footer.innerHTML = this.generateFooter();
    }

    // Setup language selector
    this.setupLanguageSelector();

    // Listen for language changes
    window.addEventListener('storage', (event) => {
      if (event.key === 'snengine-lang') {
        this.updateLanguage();
      }
    });
  }
}

// Initialize the generator when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const generator = new NavFooterGenerator();
  generator.init();

  // Dispatch a custom event to notify other scripts that the header and footer are ready
  window.dispatchEvent(new CustomEvent('navFooterReady'));

  // Listen for storage events to sync language across tabs/pages
  window.addEventListener('storage', (event) => {
    if (event.key === 'snengine-lang' && event.newValue !== event.oldValue) {
      // Update the language if it was changed in another tab/window
      generator.updateLanguage();
    }
  });
});