// ============================================
// GLOBAL STATE
// ============================================
let currentLanguage = localStorage.getItem('language') || 'tr';
let isDarkMode = localStorage.getItem('darkMode') === 'true';
let languageData = {};

// ============================================
// PAGE INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Portfolio loading...');
  
  // Set theme
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
  }
  updateThemeButton();
  
  // Load language
  loadLanguageData(currentLanguage);
  
  // Setup event listeners
  setupEventListeners();
});

// ============================================
// EVENT LISTENERS
// ============================================
function setupEventListeners() {
  // Theme button
  const themeBtn = document.getElementById('themeBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      toggleTheme();
    });
  }
  
  // Language button
  const langBtn = document.getElementById('langBtn');
  if (langBtn) {
    langBtn.addEventListener('click', function(e) {
      e.preventDefault();
      toggleLanguageDropdown();
    });
  }
  
  // Language items
  const langItems = document.querySelectorAll('.language-group .dropdown-item');
  langItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      const lang = this.getAttribute('data-lang');
      changeLanguage(lang);
    });
  });
  
  // Tab buttons - use event delegation
  const tabNav = document.querySelector('.tab-navigation');
  if (tabNav) {
    tabNav.addEventListener('click', function(e) {
      const tabBtn = e.target.closest('.tab-btn');
      if (tabBtn) {
        e.preventDefault();
        const tabName = tabBtn.getAttribute('data-tab');
        switchTab(tabName);
      }
    });
  }
  
  // Close dropdowns
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.control-group')) {
      const dropdown = document.getElementById('langDropdown');
      if (dropdown) {
        dropdown.classList.remove('active');
      }
    }
  });
}

// ============================================
// LANGUAGE MANAGEMENT
// ============================================
function loadLanguageData(lang) {
  fetch(`assets/data/${lang}.json`)
    .then(response => response.json())
    .then(data => {
      languageData = data;
      updatePageContent();
      setupEventListeners();
    })
    .catch(error => console.error('Language load error:', error));
}

function changeLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('language', lang);
  const dropdown = document.getElementById('langDropdown');
  if (dropdown) dropdown.classList.remove('active');
  loadLanguageData(lang);
}

function toggleLanguageDropdown() {
  const dropdown = document.getElementById('langDropdown');
  if (dropdown) {
    dropdown.classList.toggle('active');
  }
}

// ============================================
// THEME MANAGEMENT
// ============================================
function toggleTheme() {
  isDarkMode = !isDarkMode;
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', isDarkMode);
  updateThemeButton();
}

function updateThemeButton() {
  const themeBtn = document.getElementById('themeBtn');
  if (themeBtn) {
    if (isDarkMode) {
      themeBtn.innerHTML = '<i class="fas fa-sun"></i><span class="btn-text">Açık</span>';
    } else {
      themeBtn.innerHTML = '<i class="fas fa-moon"></i><span class="btn-text">Koyu</span>';
    }
  }
}

// ============================================
// TAB MANAGEMENT
// ============================================
function switchTab(tabName) {
  // Keep all tab contents visible; only highlight the selected one
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

  // Activate button
  const btn = document.querySelector('[data-tab="' + tabName + '"]');
  if (btn) btn.classList.add('active');

  // Mark the selected content as active (do not hide others)
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  const tab = document.getElementById(tabName + '-tab');
  if (tab) {
    tab.classList.add('active');
    // Smooth scroll into view so user notices the selected section
    try { tab.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) {}
  }
}

// ============================================
// CONTENT MANAGEMENT
// ============================================
function updatePageContent() {
  // Update buttons
  updateLanguageButton();
  updateTabButtonLabels();
  
  // Render all content
  renderPersonalTab();
  renderDesignTab();
  renderSystemsTab();
  renderFooter();
  
  // Activate personal tab
  switchTab('personal');
}

function updateLanguageButton() {
  const langBtn = document.getElementById('langBtn');
  const names = { 'tr': 'Türkçe', 'en': 'English', 'zh': '中文' };
  if (langBtn) {
    langBtn.innerHTML = `<i class="fas fa-globe"></i><span class="btn-text">${names[currentLanguage]}</span><i class="fas fa-chevron-down"></i>`;
  }
  
  // Update dropdown
  document.querySelectorAll('.language-group .dropdown-item').forEach(item => {
    if (item.getAttribute('data-lang') === currentLanguage) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

function updateTabButtonLabels() {
  const tabs = ['personal', 'design', 'systems'];
  const btns = document.querySelectorAll('.tab-btn');
  btns.forEach((btn, i) => {
    const data = languageData.tabs[tabs[i]];
    if (data) {
      btn.setAttribute('data-tab', tabs[i]);
      btn.innerHTML = `<span class="tab-icon">${data.icon}</span><span class="tab-label">${data.title}</span>`;
    }
  });
}

// ============================================
// RENDER TABS
// ============================================
function renderPersonalTab() {
  const el = document.getElementById('personal-tab');
  if (!el || !languageData.tabs.personal) return;
  
  const data = languageData.tabs.personal;
  let html = '<div class="sections">';
  
  if (data.sections) {
    data.sections.forEach(s => {
      html += `<div class="section-card"><h3>${s.title}</h3><p>${s.content}</p></div>`;
    });
  }
  
  html += '</div>';
  
  if (data.projects && data.projects.length > 0) {
    html += '<div class="projects-section"><h2>Projelerim</h2><div class="projects-grid">';
    data.projects.forEach(p => {
      html += `<a href="${p.link}" class="project-card" target="_blank" rel="noopener noreferrer"><h4>${p.name}</h4><p>${p.description}</p><span class="project-link">Ziyaret Et <i class="fas fa-arrow-right"></i></span></a>`;
    });
    html += '</div></div>';
  }
  
  el.innerHTML = html;
}

function renderDesignTab() {
  const el = document.getElementById('design-tab');
  if (!el || !languageData.tabs.design) return;
  
  const data = languageData.tabs.design;
  let html = `<div class="design-intro"><h2>${data.title}</h2><p>${data.description}</p></div>`;
  
  if (data.video) {
    html += `<div class="video-container"><h3>${data.video.title}</h3><div class="video-wrapper"><video controls><source src="${data.video.url}" type="video/mp4"></video></div></div>`;
  }
  
  if (data.career) {
    html += `<div class="career-section"><h3>Kariyer</h3><p>${data.career}</p></div>`;
  }
  
  if (data.gallery && data.gallery.length > 0) {
    html += '<div class="gallery">';
    data.gallery.forEach(g => {
      html += `<div class="gallery-item"><img src="${g.image}" alt="${g.title}" loading="lazy"><div class="gallery-title">${g.title}</div></div>`;
    });
    html += '</div>';
  }
  
  el.innerHTML = html;
}

function renderSystemsTab() {
  const el = document.getElementById('systems-tab');
  if (!el || !languageData.tabs.systems) return;
  
  const data = languageData.tabs.systems;
  let html = `<div class="systems-intro"><h2>${data.title}</h2><p>${data.description}</p></div>`;
  
  if (data.github) {
    html += `<div class="github-section"><h3>GitHub Profilim</h3><a href="${data.github.link}" class="github-button" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i>${data.github.username}</a></div>`;
  }
  
  if (data.projects && data.projects.length > 0) {
    html += '<div class="projects-section"><h2>Projelerim</h2><div class="projects-grid">';
    data.projects.forEach(p => {
      html += `<a href="${p.link}" class="project-card" target="_blank" rel="noopener noreferrer"><h4>${p.name}</h4><p>${p.description}</p><span class="project-link">GitHub <i class="fas fa-arrow-right"></i></span></a>`;
    });
    html += '</div></div>';
  }
  
  el.innerHTML = html;
}

function renderFooter() {
  const el = document.querySelector('.footer-content');
  if (!el || !languageData.footer) return;
  
  let html = '';
  Object.keys(languageData.footer).forEach(key => {
    const link = languageData.footer[key];
    html += `<a href="${link.url}" class="footer-link" target="_blank" rel="noopener noreferrer" title="${link.label}"><i class="${link.icon}"></i>${link.label}</a>`;
  });
  
  el.innerHTML = html;
}
