// Language management
let currentLanguage = localStorage.getItem('language') || 'tr';
let languageData = {};

// Theme management
let isDarkMode = localStorage.getItem('darkMode') === 'true';

// Load language data
async function loadLanguageData(lang) {
  try {
    const response = await fetch(`assets/data/${lang}.json`);
    languageData = await response.json();
    updatePageContent();
  } catch (error) {
    console.error('Error loading language data:', error);
  }
}

// Initialize theme
function initializeTheme() {
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
    updateThemeButton();
  }
}

// Toggle theme
function toggleTheme() {
  isDarkMode = !isDarkMode;
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', isDarkMode);
  updateThemeButton();
}

// Update theme button appearance
function updateThemeButton() {
  const themeBtn = document.querySelector('.theme-toggle');
  if (isDarkMode) {
    themeBtn.innerHTML = '☀️ <span>Açık Mod</span>';
  } else {
    themeBtn.innerHTML = '🌙 <span>Koyu Mod</span>';
  }
}

// Change language
function changeLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('language', lang);
  loadLanguageData(lang);
  closeDropdowns();
}

// Update page content from JSON
function updatePageContent() {
  // Update logo/name
  const logo = document.querySelector('.logo');
  if (logo) logo.textContent = languageData.name;

  // Update tab buttons
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach((btn, index) => {
    const tabKey = ['personal', 'design', 'systems'][index];
    const tabInfo = languageData.tabs[tabKey];
    if (tabInfo) {
      btn.innerHTML = `<span class="tab-icon">${tabInfo.icon}</span>${tabInfo.title}`;
    }
  });

  // Update tab contents
  renderPersonalTab();
  renderDesignTab();
  renderSystemsTab();

  // Update footer
  renderFooter();

  // Update language button
  updateLanguageButton();
}

// Render Personal Life Tab
function renderPersonalTab() {
  const personalTab = document.getElementById('personal-tab');
  const personalData = languageData.tabs.personal;

  let html = '<div class="sections">';

  // Render sections
  if (personalData.sections) {
    personalData.sections.forEach(section => {
      html += `
        <div class="section-card">
          <h3>${section.title}</h3>
          <p>${section.content}</p>
        </div>
      `;
    });
  }

  html += '</div>';

  // Render projects
  if (personalData.projects && personalData.projects.length > 0) {
    html += '<div class="projects-section"><h2>Projelerim</h2><div class="projects-grid">';
    personalData.projects.forEach(project => {
      html += `
        <a href="${project.link}" class="project-card" target="_blank">
          <h4>${project.name}</h4>
          <p>${project.description}</p>
          <span class="project-link">→ Ziyaret Et</span>
        </a>
      `;
    });
    html += '</div></div>';
  }

  personalTab.innerHTML = html;
}

// Render Design Tab
function renderDesignTab() {
  const designTab = document.getElementById('design-tab');
  const designData = languageData.tabs.design;

  let html = `
    <div class="design-intro">
      <h2>${designData.title}</h2>
      <p>${designData.description}</p>
    </div>
  `;

  // Render video
  if (designData.video) {
    html += `
      <div class="video-container">
        <h3>${designData.video.title}</h3>
        <div class="video-wrapper">
          <video controls>
            <source src="${designData.video.url}" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    `;
  }

  // Render career section
  if (designData.career) {
    html += `
      <div class="career-section">
        <h3>Kariyer Hakkında</h3>
        <p>${designData.career}</p>
      </div>
    `;
  }

  // Render gallery
  if (designData.gallery && designData.gallery.length > 0) {
    html += '<div class="gallery">';
    designData.gallery.forEach(item => {
      html += `
        <div class="gallery-item">
          <img src="${item.image}" alt="${item.title}">
          <div class="gallery-title">${item.title}</div>
        </div>
      `;
    });
    html += '</div>';
  }

  designTab.innerHTML = html;
}

// Render Systems Tab
function renderSystemsTab() {
  const systemsTab = document.getElementById('systems-tab');
  const systemsData = languageData.tabs.systems;

  let html = `
    <div class="systems-intro">
      <h2>${systemsData.title}</h2>
      <p>${systemsData.description}</p>
    </div>
  `;

  // GitHub section
  if (systemsData.github) {
    html += `
      <div class="github-section">
        <h3>GitHub Profilim</h3>
        <a href="${systemsData.github.link}" class="github-button" target="_blank">
          <i class="fab fa-github"></i>
          ${systemsData.github.username}
        </a>
      </div>
    `;
  }

  // Projects
  if (systemsData.projects && systemsData.projects.length > 0) {
    html += '<div class="projects-section"><h2>Projelerim</h2><div class="projects-grid">';
    systemsData.projects.forEach(project => {
      html += `
        <a href="${project.link}" class="project-card" target="_blank">
          <h4>${project.name}</h4>
          <p>${project.description}</p>
          <span class="project-link">→ GitHub</span>
        </a>
      `;
    });
    html += '</div></div>';
  }

  systemsTab.innerHTML = html;
}

// Render Footer
function renderFooter() {
  const footer = document.querySelector('.footer-content');
  const footerData = languageData.footer;

  let html = '';

  Object.keys(footerData).forEach(key => {
    const link = footerData[key];
    html += `
      <a href="${link.url}" class="footer-link" target="_blank" rel="noopener noreferrer">
        <i class="${link.icon}"></i>
        ${link.label}
      </a>
    `;
  });

  footer.innerHTML = html;
}

// Update language button text
function updateLanguageButton() {
  const langBtn = document.querySelector('.language-selector');
  const langNames = { 'tr': 'Türkçe', 'en': 'English', 'zh': '中文' };
  langBtn.textContent = '🌐 ' + langNames[currentLanguage];
}

// Tab switching
function switchTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });

  // Remove active class from all buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  // Show selected tab
  const selectedTab = document.getElementById(tabName + '-tab');
  if (selectedTab) {
    selectedTab.classList.add('active');
  }

  // Add active class to clicked button
  event.target.closest('.tab-btn').classList.add('active');
}

// Language dropdown
function toggleLanguageDropdown() {
  const dropdown = document.querySelector('.language-dropdown');
  dropdown.classList.toggle('active');
}

// Theme dropdown (if needed)
function toggleThemeDropdown() {
  const dropdown = document.querySelector('.theme-dropdown');
  dropdown.classList.toggle('active');
}

// Close all dropdowns
function closeDropdowns() {
  document.querySelectorAll('.language-dropdown, .theme-dropdown').forEach(dropdown => {
    dropdown.classList.remove('active');
  });
}

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.controls')) {
    closeDropdowns();
  }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initializeTheme();
  loadLanguageData(currentLanguage);

  // Add event listeners
  document.querySelector('.theme-toggle').addEventListener('click', toggleTheme);
  document.querySelector('.language-selector').addEventListener('click', toggleLanguageDropdown);

  // Tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', switchTab);
  });

  // Language options
  document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', (e) => {
      changeLanguage(e.target.dataset.lang);
    });
  });

  // Highlight active tab on load
  document.querySelector('.tab-btn').classList.add('active');
  document.getElementById('personal-tab').classList.add('active');
});
