const LanguageManager = {
    translations: {
        'en': typeof LANG_EN !== 'undefined' ? LANG_EN : {},
        'ru': typeof LANG_RU !== 'undefined' ? LANG_RU : {}
    },
    
    currentLang: localStorage.getItem('snengine-lang') || 
                (navigator.language.startsWith('ru') ? 'ru' : 'en'),

    init() {
        this.apply();
        this.setupEventListeners();
    },

    set(lang) {
        if (!this.translations[lang]) return;
        this.currentLang = lang;
        localStorage.setItem('snengine-lang', lang);
        this.apply();
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    },

    apply() {
        document.documentElement.lang = this.currentLang;
        
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            const text = this.translations[this.currentLang][key];
            
            if (text) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = text;
                } else if (text.includes('<') && text.includes('>')) {
                    el.innerHTML = text;
                } else {
                    el.textContent = text;
                }
            }
        });

        const selectors = document.querySelectorAll('#language-selector');
        selectors.forEach(s => { s.value = this.currentLang; });
    },

    setupEventListeners() {
        document.addEventListener('change', (e) => {
            if (e.target.id === 'language-selector') {
                this.set(e.target.value);
            }
        });

        window.addEventListener('storage', (e) => {
            if (e.key === 'snengine-lang' && e.newValue !== this.currentLang) {
                this.set(e.newValue);
            }
        });

        window.addEventListener('navFooterReady', () => {
            this.apply();
        });
    }
};

document.addEventListener('DOMContentLoaded', () => LanguageManager.init());