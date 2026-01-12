class GamesManager {
  constructor() {
    this.gamesData = [];
    this.currentLanguage = 'en';
  }

  async init() {
    await this.loadGamesData();
    this.updateLanguageBasedOnUserPreference();
    this.renderGames();
    this.setupLanguageSwitching();
  }

  async loadGamesData() {
    try {
      const response = await fetch('games.json');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      this.gamesData = await response.json();
    } catch (error) {
      console.error('Error loading games data:', error);
      this.gamesData = [];
    }
  }

  updateLanguageBasedOnUserPreference() {
    // Меняем 'preferredLanguage' на 'snengine-lang'
    const storedLang = localStorage.getItem('snengine-lang');
    if (storedLang) {
      this.currentLanguage = storedLang;
    } else {
      const browserLang = navigator.language || navigator.userLanguage;
      this.currentLanguage = browserLang.startsWith('ru') ? 'ru' : 'en';
    }
  }

  renderGames(page = 1) {
    const container = document.getElementById('games-container');
    if (!container) return;

    container.innerHTML = '';

    if (this.gamesData.length === 0) {
      container.innerHTML = '<p>No games available at the moment.</p>';
      return;
    }

    // Pagination settings
    const gamesPerPage = 6;
    const startIndex = (page - 1) * gamesPerPage;
    const endIndex = startIndex + gamesPerPage;
    const totalPages = Math.ceil(this.gamesData.length / gamesPerPage);

    // Get games for current page
    const gamesForPage = this.gamesData.slice(startIndex, endIndex);

    const grid = document.createElement('div');
    grid.className = 'games-grid';

    gamesForPage.forEach(game => {
      grid.appendChild(this.createGameCard(game));
    });

    container.appendChild(grid);

    // Add pagination controls if there are multiple pages
    if (totalPages > 1) {
      const paginationContainer = document.createElement('div');
      paginationContainer.className = 'pagination';

      // Previous button
      if (page > 1) {
        const prevButton = document.createElement('button');
        prevButton.className = 'pagination-btn';
        prevButton.textContent = '←';
        prevButton.onclick = () => this.renderGames(page - 1);
        paginationContainer.appendChild(prevButton);
      }

      // Page buttons
      for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.className = `pagination-btn ${i === page ? 'active' : ''}`;
        pageButton.textContent = i;
        pageButton.onclick = () => this.renderGames(i);
        paginationContainer.appendChild(pageButton);
      }

      // Next button
      if (page < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.className = 'pagination-btn';
        nextButton.textContent = '→';
        nextButton.onclick = () => this.renderGames(page + 1);
        paginationContainer.appendChild(nextButton);
      }

      container.appendChild(paginationContainer);
    }
  }

  createGameCard(game) {
    const card = document.createElement('div');
    // Normalize status for CSS class
    const normalizedStatus = game.status.toLowerCase().replace(/\s+/g, '-');
    card.className = `game-card ${normalizedStatus}`;

    const name = game.name[this.currentLanguage] || game.name.en;
    const description = game.description[this.currentLanguage] || game.description.en;
    const preview = game.preview;

    card.innerHTML = `
      ${preview ? `<img src="${preview}" alt="${name}" class="preview-image">` : ''}
      <div class="card-content">
        <div class="card-header">
          <div class="title-status-container">
            <h3 class="game-title">${name}</h3>
            ${this.createStatusBadge(game.status)}
          </div>
        </div>
        <p class="game-description">${description}</p>
        <div class="game-platforms">
          ${this.createPlatformIcons(game.platforms)}
        </div>
        <div class="game-actions">
          ${this.createDownloadButton(game)}
        </div>
      </div>
    `;

    return card;
  }
  createPlatformIcons(platforms) {
    if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
      return '<span class="no-platforms">No platforms available</span>';
    }

    return platforms.map(platform => {
      // Map platform codes to readable names
      const platformNames = {
        'windows': 'Windows',
        'macos': 'macOS',
        'linux': 'Linux',
        'android': 'Android',
        'ios': 'iOS',
        'playstation': 'PlayStation',
        'xbox': 'Xbox',
        'nintendo_switch': 'Nintendo Switch',
        'browser': 'Browser'
      };

      const platformName = platformNames[platform] || platform;
      return `
        <span class="platform-tag" title="${platformName}">
          <img src="images/games_platforms/${platform}.png" alt="${platformName}" width="24" height="24">
          <span>${platformName}</span>
        </span>
      `;
    }).join('');
  }

  createStatusBadge(status) {
    // Normalize status to kebab-case for CSS class names
    const normalizedStatus = status.toLowerCase().replace(/\s+/g, '-');

    // Define status translations using the original format from JSON
    const statusTexts = {
      'released': { en: 'Released', ru: 'Выпущено' },
      'in development': { en: 'In Development', ru: 'В разработке' },
      'pre release': { en: 'Pre-release', ru: 'Предварительный релиз' },
      'in-development': { en: 'In Development', ru: 'В разработке' }, // Kebab-case version
      'pre-release': { en: 'Pre-release', ru: 'Предварительный релиз' } // Kebab-case version
    };

    // Look up using the original status first, then the normalized version
    const info = statusTexts[status.toLowerCase()] || statusTexts[normalizedStatus] || { en: status, ru: status };
    const text = info[this.currentLanguage] || info.en;
    return `<span class="status-badge status-${normalizedStatus}">${text}</span>`;
  }

  createDownloadButton(game) {
    // Normalize status for comparison
    const normalizedStatus = game.status.toLowerCase().replace(/\s+/g, '-');

    // Кнопка скачивания доступна только для статусов released и beta
    if ((normalizedStatus === 'released' || normalizedStatus === 'beta') && game.downloadUrl) {
      const buttonText = this.currentLanguage === 'ru' ? 'Скачать' : 'Download';
      return `<button class="download-btn" onclick="window.open('${game.downloadUrl}', '_blank')">${buttonText}</button>`;
    } else {
      // Для всех остальных статусов показываем кнопку как недоступную
      if (normalizedStatus === 'in-development') {
        const text = this.currentLanguage === 'ru' ? 'Скоро' : 'Coming Soon';
        return `<button class="download-btn disabled" disabled>${text}</button>`;
      } else if (normalizedStatus === 'pre-release') {
        const text = this.currentLanguage === 'ru' ? 'Недоступно' : 'Not Available';
        return `<button class="download-btn disabled" disabled>${text}</button>`;
      } else {
        const text = this.currentLanguage === 'ru' ? 'Недоступно' : 'Not Available';
        return `<button class="download-btn disabled" disabled>${text}</button>`;
      }
    }
  }

setupLanguageSwitching() {
    window.addEventListener('languageChanged', (e) => {
      this.currentLanguage = e.detail.lang;
      this.renderGames();
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const manager = new GamesManager();
  manager.init();
});