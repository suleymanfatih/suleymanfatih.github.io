/* ============================================
   LAYOUT - SEKMELERDEN BAĞIMSIZ ÖĞELER
   ============================================ */

// Dil yönetimi
let currentLanguage = localStorage.getItem('language') || 'tr';
const availableLanguages = ['tr', 'en', 'ch'];

/**
 * Dil değiştir ve localStorage'da kaydet
 */
function switchLanguage() {
    const currentIndex = availableLanguages.indexOf(currentLanguage);
    const nextIndex = (currentIndex + 1) % availableLanguages.length;
    currentLanguage = availableLanguages[nextIndex];
    localStorage.setItem('language', currentLanguage);
    
    // Dil butonunu güncelle
    const languageToggle = document.getElementById('languageToggle');
    if (languageToggle) {
        languageToggle.querySelector('.language-text').textContent = currentLanguage.toUpperCase();
    }
    
    // Sayfayı yenile (main.js'deki içeriği yeniden yükle)
    // loadTabContent() fonksiyonu main.js tarafından çağrılacak
    if (typeof loadTabContent === 'function') {
        loadTabContent();
    }
}

/**
 * Başlangıçta dil butonunu ayarla
 */
function initLanguageButton() {
    const languageToggle = document.getElementById('languageToggle');
    if (languageToggle) {
        languageToggle.querySelector('.language-text').textContent = currentLanguage.toUpperCase();
        languageToggle.addEventListener('click', switchLanguage);
    }
}

/**
 * Tema değiştirme (layout.js tarafında da yönetilecek)
 */
let currentTheme = localStorage.getItem('theme') || 'light';

function applyTheme() {
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.querySelector('.theme-icon').textContent = '🌙';
        }
    } else {
        document.body.classList.remove('dark-theme');
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.querySelector('.theme-icon').textContent = '☀️';
        }
    }
    localStorage.setItem('theme', currentTheme);
}

function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            currentTheme = currentTheme === 'light' ? 'dark' : 'light';
            applyTheme();
        });
    }
}

// Sayfa yüklediğinde başlat
// DOMContentLoaded burada çalışmaz çünkü main.js bundan sonra yükleniyor
// Bunun yerine main.js initPage() içinde layout başlatılacak
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        applyTheme();
        initThemeToggle();
        initLanguageButton();
    });
} else {
    // Eğer script defer ile yüklenmişse
    applyTheme();
    initThemeToggle();
    initLanguageButton();
}
