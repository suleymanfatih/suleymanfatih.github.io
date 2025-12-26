// ============================================
// GLOBAL STATE
// ============================================
let currentLanguage = localStorage.getItem('language') || 'tr';
let isDarkMode = localStorage.getItem('darkMode') === 'true';
let languageData = {};

// ============================================
// BACKGROUND SETUP
// ============================================
function initializeBackground() {
  // Blobs are handled by CSS animations; no JS needed
}

// ============================================
// PAGE INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Portfolio loading...');
  
  // Initialize background
  initializeBackground();
  
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
// PARALLAX EFFECT
// ============================================
// (Parallax removed; using CSS blob animations instead)

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
  
  // Language button (clicking a code selects that language; clicking empty area cycles)
  const langBtn = document.getElementById('langBtn');
  if (langBtn) {
    langBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const codeEl = e.target.closest('.code');
      if (codeEl && codeEl.dataset && codeEl.dataset.lang) {
        changeLanguage(codeEl.dataset.lang);
      } else {
        cycleLanguage();
      }
    });
  }
  
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
    })
    .catch(error => console.error('Language load error:', error));
}

function changeLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('language', lang);
  loadLanguageData(lang);
}

// Cycle through available languages when language button is clicked
function cycleLanguage() {
  const langs = ['tr', 'en', 'zh'];
  const currentIndex = langs.indexOf(currentLanguage);
  const nextIndex = (currentIndex + 1) % langs.length;
  changeLanguage(langs[nextIndex]);
}

// ============================================
// THEME MANAGEMENT
// ============================================
function toggleTheme() {
  isDarkMode = !isDarkMode;
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', isDarkMode);
  updateThemeButton();
  // Reinitialize background with new theme colors
  initializeBackground();
}

function updateThemeButton() {
  const themeBtn = document.getElementById('themeBtn');
  if (themeBtn) {
    // Icon-only button
    if (isDarkMode) {
      themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
      themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
    }
  }
}

// ============================================
// TAB MANAGEMENT
// ============================================
function switchTab(tabName) {
  // Hide all tab contents and deactivate buttons
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

  // Show selected tab and activate button
  const btn = document.querySelector('[data-tab="' + tabName + '"]');
  if (btn) btn.classList.add('active');

  const tab = document.getElementById(tabName + '-tab');
  if (tab) {
    tab.classList.add('active');
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
  if (langBtn) {
    // Render the three shortcodes and highlight the active one
    const codes = ['tr','en','zh'];
    const html = codes.map(c => `<span class="code ${c === currentLanguage ? 'active' : ''}" data-lang="${c}">${c === 'zh' ? 'ch' : c}</span>`).join(' ');
    langBtn.innerHTML = `<span class="lang-labels">${html}</span>`;
  }
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
    html += `<div class="video-container"><h3>${data.video.title || ''}</h3>`;

    // Support for: { youtubeId: 'ID' } or { url: 'https://youtu.be/...' } or local mp4
    const vid = data.video;
    const youtubeId = vid.youtubeId || extractYouTubeID(vid.url || '');
    if (youtubeId) {
      html += `<div class="video-wrapper"><iframe src="https://www.youtube.com/embed/${youtubeId}" title="${(vid.title||'Video')}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
    } else if (vid.url && vid.url.endsWith('.mp4')) {
      html += `<div class="video-wrapper"><video controls><source src="${vid.url}" type="video/mp4">Your browser does not support the video tag.</video></div>`;
    }

    html += `</div>`;
  }
  
  if (data.career) {
    html += `<div class="career-section"><h3>Kariyer</h3><p>${data.career}</p></div>`;
  }
  
  if (data.gallery && data.gallery.length > 0) {
    html += '<div class="gallery">';
    data.gallery.forEach(g => {
      // Varsayılan değerler
      let type = g.type || 'normal';
      let style = '';
      if (g.gridColumn) style += `grid-column: ${g.gridColumn};`;
      if (g.gridRow) style += `grid-row: ${g.gridRow};`;
      if (type === 'wide') style += 'grid-column: span 2;';
      if (type === 'tall') style += 'grid-row: span 2;';
      // WebP desteği için <picture> yapısı
      let imgPath = g.image;
      let webpPath = imgPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      html += `<div class="gallery-item gallery-${type}" style="${style}">
        <picture>
          <source srcset="${webpPath}" type="image/webp">
          <img src="${imgPath}" alt="${g.title}" loading="lazy">
        </picture>
        <div class="gallery-title">${g.title}</div>
      </div>`;
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

// Helper: extract YouTube ID from common URL formats
function extractYouTubeID(url) {
  if (!url) return null;
  // If already an ID
  if (/^[A-Za-z0-9_-]{11}$/.test(url)) return url;
  try {
    const u = new URL(url);
    // youtu.be/ID
    if (u.hostname.includes('youtu.be')) {
      return u.pathname.slice(1);
    }
    // youtube.com/watch?v=ID
    if (u.hostname.includes('youtube.com')) {
      return u.searchParams.get('v');
    }
  } catch (e) {
    // ignore
  }
  // fallback regex
  const m = url.match(/(youtu.be\/|v=|embed\/)([A-Za-z0-9_-]{11})/);
  return m ? m[2] : null;
}
