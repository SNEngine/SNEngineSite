class NavFooterGenerator {
    generateHeader() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const isActive = (p) => currentPage === p ? 'active' : '';

        return `
        <div class="header-content">
            <div class="logo-and-nav">
                <a href="index.html" class="logo">
                    <img src="images/icon_nav_light.png" alt="SNEngine Logo" class="logo-icon logo-icon-light">
                    <img src="images/icon_nav_dark.png" alt="SNEngine Logo" class="logo-icon logo-icon-dark">
                    <span class="logo-text">Engine</span>
                </a>
                <div class="mobile-nav-container">
                    <div class="burger-menu" id="burger-menu">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <nav class="nav">
                        <a href="index.html" class="${isActive('index.html')}" data-i18n="nav_main">Main</a>
                        <a href="games.html" class="${isActive('games.html')}" data-i18n="nav_games">Games</a>
                        <a href="code-editor.html" class="${isActive('code-editor.html')}" data-i18n="nav_code_editor">Code Editor</a>
                        <a href="yaml-editor.html" class="${isActive('yaml-editor.html')}" data-i18n="nav_yaml_editor">YAML Editor</a>
                        <a href="https://github.com/SNEngine/SNEngineDocs" data-i18n="nav_docs">Docs</a>
                    </nav>
                </div>
            </div>
            <div class="header-right">
                <select id="language-selector" class="lang-selector">
                    <option value="en">EN</option>
                    <option value="ru">RU</option>
                </select>
                <a href="https://github.com/SNEngine/SNEngine/releases" class="download-btn" data-i18n="nav_download" target="_blank">Download</a>
            </div>
        </div>`;
    }

    generateFooter() {
        return `
        <footer class="footer">
            © <span id="currentYear">${new Date().getFullYear()}</span> <span data-i18n="footer_copyright">SNEngine</span>
        </footer>`;
    }

    init() {
        const header = document.querySelector('header');
        if (header) header.innerHTML = this.generateHeader();

        const footer = document.querySelector('footer');
        if (footer) footer.innerHTML = this.generateFooter();

        // Initialize burger menu functionality
        this.initBurgerMenu();

        window.dispatchEvent(new CustomEvent('navFooterReady'));
    }

    initBurgerMenu() {
        // Wait for DOM to be fully loaded before initializing
        setTimeout(() => {
            const burgerMenu = document.getElementById('burger-menu');
            const nav = document.querySelector('.nav');

            if (burgerMenu && nav) {
                burgerMenu.addEventListener('click', () => {
                    nav.classList.toggle('active');

                    // Animate burger menu
                    burgerMenu.classList.toggle('active');
                });

                // Close menu when clicking on a link
                const navLinks = nav.querySelectorAll('a');
                navLinks.forEach(link => {
                    link.addEventListener('click', () => {
                        nav.classList.remove('active');
                        burgerMenu.classList.remove('active');
                    });
                });

                // Close menu when clicking outside
                document.addEventListener('click', (event) => {
                    if (!nav.contains(event.target) && !burgerMenu.contains(event.target)) {
                        nav.classList.remove('active');
                        burgerMenu.classList.remove('active');
                    }
                });
            }
        }, 100); // Small delay to ensure DOM is fully rendered
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new NavFooterGenerator().init();
});