/* ============================================
   MAIN.JS - SEKME VE İÇERİK YÖNETİMİ
   ============================================ */

// DOM elemanlarına erişim yardımcıları (DOMContentLoaded sıralamasından bağımsız)
function getTabButtons() { return document.querySelectorAll('.tab-btn'); }
function getTabContents() { return document.querySelectorAll('.tab-content'); }

// Hata banner'ı göster/gizle
function showDataError(message) {
    let banner = document.getElementById('dataErrorBanner');
    if (!banner) {
        banner = document.createElement('div');
        banner.id = 'dataErrorBanner';
        banner.className = 'data-error-banner';
        document.body.insertBefore(banner, document.body.firstChild);
    }
    banner.textContent = message;
}

function clearDataError() {
    const banner = document.getElementById('dataErrorBanner');
    if (banner) banner.remove();
}

// Verileri tut
let allData = {
    personal: null,
    system: null,
    design: null
};

/* ============================================
   JSON VERİLERİ FETCH ET
   ============================================ */

/**
 * JSON dosyasını dile göre yükle
 * @param {string} type - Veri türü (personal, system, design)
 * @returns {Promise<Object>}
 */
async function fetchData(type) {
    const language = localStorage.getItem('language') || 'tr';
    const filename = `./assets/data/${type}_${language}.json`;
    
    try {
        const response = await fetch(filename);
        if (!response.ok) throw new Error(`Veri yüklenemedi: ${filename} (status: ${response.status})`);
        const data = await response.json();
        // Başarılıysa varsa önceki hata banner'ını temizle
        clearDataError();
        return data;
    } catch (error) {
        console.error('Veri yükleme hatası:', error);
        // Kullanıcıya görünür hata mesajı göster (çoğunlukla file:// nedeniyle fetch başarısız olur)
        showDataError(`JSON yüklenemedi: ${filename}. Tarayıcı dosya protokolünde fetch engellenmiş olabilir. Lütfen bir HTTP sunucusunda çalıştırın.`);
        return null;
    }
}

/* ============================================
   SEKME YÖNETİMİ
   ============================================ */

/**
 * Aktif sekmeyi değiştir
 * @param {string} tabName - Sekme adı (personal, system, design)
 */
function switchTab(tabName) {
    // Tüm sekme içeriklerini gizle
    getTabContents().forEach(content => content.classList.remove('active'));

    // Tüm sekme butonlarının aktif sınıfını kaldır
    getTabButtons().forEach(button => {
        button.classList.remove('active');
        button.setAttribute('aria-selected', 'false');
    });

    // Seçili sekme içeriğini göster
    const activeContent = document.getElementById(tabName);
    if (activeContent) {
        activeContent.classList.add('active');
    }

    // Seçili sekme butonunu aktif et
    const activeButton = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
        activeButton.setAttribute('aria-selected', 'true');
    }
}

/**
 * Sekme butonlarına tıklama olayı ekle
 */
function initTabButtons() {
    const buttons = getTabButtons();
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            switchTab(tabName);
        });

        // Touch optimizasyonu
        button.addEventListener('touchend', (e) => {
            e.preventDefault();
            const tabName = button.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
}

/* ============================================
   KIŞISEL HAYAT BÖLÜMÜ
   ============================================ */

async function loadPersonalSection() {
    const data = await fetchData('personal');
    if (!data) return;

    allData.personal = data;

    const accordion = document.getElementById('personalAccordion');
    const projectsList = document.getElementById('personalProjects');

    // Profil kartı (fotoğraf + kısa kariyer açıklaması)
    const personalHeader = document.getElementById('personalHeader');
    if (personalHeader) {
        const profile = data.profile || {};
        personalHeader.innerHTML = `
            <div class="profile-card">
                <img class="profile-photo" src="${profile.photo || './assets/img/profile-placeholder.png'}" alt="${data.name || ''}">
                <div class="profile-info">
                    <h3 class="profile-name">${data.name || ''}</h3>
                    <div class="profile-career-title">${profile.title || ''}</div>
                    <p class="profile-career-desc">${profile.career || ''}</p>
                </div>
            </div>
        `;
    }

    // Accordion öğeleri oluştur (hakkımda / ne yapıyorum / ilgi alanları)
    accordion.innerHTML = '';
    const accordionItems = [
        { title: data.sections.about.title, content: data.sections.about.content },
        { title: data.sections.whatIDo.title, content: data.sections.whatIDo.content },
        { title: data.sections.interests.title, content: data.sections.interests.content }
    ];

    accordionItems.forEach((item, index) => {
        const accordionDiv = document.createElement('div');
        accordionDiv.className = 'accordion-item';
        accordionDiv.innerHTML = `
            <div class="accordion-header" data-index="${index}">
                <h3>${item.title}</h3>
                <span class="accordion-icon">▼</span>
            </div>
            <div class="accordion-content">
                <p>${item.content}</p>
            </div>
        `;
        accordion.appendChild(accordionDiv);
    });

    // Accordion tıklama olayları
    const accordionHeaders = document.querySelectorAll('#personalAccordion .accordion-header');
    accordionHeaders.forEach(header => {
        const clickHandler = () => {
            const content = header.nextElementSibling;
            const isActive = header.classList.contains('active');

            // Tüm accordion öğelerini kapat
            accordionHeaders.forEach(h => {
                h.classList.remove('active');
                h.nextElementSibling.classList.remove('active');
            });

            // Tıklanan öğeyi aç (eğer kapalıysa)
            if (!isActive) {
                header.classList.add('active');
                content.classList.add('active');
            }
        };

        header.addEventListener('click', clickHandler);
        header.addEventListener('touchend', (e) => {
            e.preventDefault();
            clickHandler();
        });
    });

    // İlk accordion öğesini aç
    if (accordionHeaders.length > 0) {
        accordionHeaders[0].classList.add('active');
        accordionHeaders[0].nextElementSibling.classList.add('active');
    }

    // Projeler listesini doldur (proje açıklamaları + opsiyonel youtube)
    projectsList.innerHTML = '';
    if (data.projects && data.projects.length > 0) {
        data.projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.innerHTML = `
                <div class="project-row">
                    <div class="project-name">${project.name}</div>
                    <div class="project-actions">
                        ${project.link ? `<a href="${project.link}" target="_blank" class="project-link">Repo</a>` : ''}
                        ${project.url ? `<a href="${project.url}" target="_blank" class="project-link">Link</a>` : ''}
                    </div>
                </div>
                <div class="project-description">${project.description || ''}</div>
                ${project.youtube ? `<div class="project-video"><iframe src="${project.youtube}" allowfullscreen loading="lazy"></iframe></div>` : ''}
            `;
            projectsList.appendChild(projectCard);
        });
    }
}

/* ============================================
   SİSTEM VE AĞ YÖNETİMİ BÖLÜMÜ
   ============================================ */

async function loadSystemSection() {
    const data = await fetchData('system');
    if (!data) return;

    allData.system = data;
    // Başlık ve kariyer açıklaması
    const systemHeader = document.getElementById('systemHeader');
    if (systemHeader) {
        systemHeader.innerHTML = `
            <h3 class="section-title">${data.title || ''}</h3>
            <p class="section-desc">${data.subtitle || data.bio || ''}</p>
        `;
    }

    // Estetik GitHub kartı
    const githubCard = document.getElementById('systemGithubCard');
    if (githubCard) {
        githubCard.innerHTML = `
            <a href="${data.github || '#'}" target="_blank" class="github-card">
                <div class="github-card-content">
                    <div class="github-icon">🐙</div>
                    <div class="github-meta">
                        <div class="github-label">GitHub</div>
                        <div class="github-desc">${data.githubNote || 'Projelerimi inceleyin'}</div>
                    </div>
                </div>
            </a>
        `;
    }

    // Bio metni ekle
    const bioSection = document.getElementById('systemBio');
    if (bioSection && data.bio) {
        bioSection.innerHTML = `<p class="section-bio">${data.bio}</p>`;
    }

    // Projeler listesini doldur (kişisel sekme ile uyumlu)
    const projectsList = document.getElementById('systemProjects');
    projectsList.innerHTML = '';
    if (data.projects && data.projects.length > 0) {
        data.projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.innerHTML = `
                <div class="project-row">
                    <div class="project-name">${project.name}</div>
                    <div class="project-actions">
                        ${project.link ? `<a href="${project.link}" target="_blank" class="project-link">Repo</a>` : ''}
                    </div>
                </div>
                <div class="project-description">${project.description || ''}</div>
            `;
            projectsList.appendChild(projectCard);
        });
    }
}

/* ============================================
   GRAFİK TASARIM BÖLÜMÜ
   ============================================ */

async function loadDesignSection() {
    const data = await fetchData('design');
    if (!data) return;

    allData.design = data;

    // Başlık / kariyer açıklaması
    const designHeader = document.getElementById('designHeader');
    if (designHeader) {
        designHeader.innerHTML = `
            <h3 class="section-title">${data.title || ''}</h3>
            <p class="section-desc">${data.subtitle || data.bio || ''}</p>
        `;
    }

    // 2026 Portföy video (opsiyonel)
    const portfolioVideo = document.getElementById('portfolioVideo');
    if (portfolioVideo && data.portfolio2026) {
        portfolioVideo.innerHTML = `<iframe src="${data.portfolio2026}" allowfullscreen loading="lazy"></iframe>`;
    }

    // Galeriyi doldur (9 item, responsive, hover overlay)
    const gallery = document.getElementById('designGallery');
    gallery.innerHTML = '';
    if (data.gallery && data.gallery.length > 0) {
        data.gallery.forEach(item => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.innerHTML = `
                <div class="gallery-item-inner">
                    <img src="${item.image}" alt="${item.title}" loading="lazy">
                    <div class="gallery-overlay">
                        <div class="gallery-overlay-title">${item.title}</div>
                        <div class="gallery-overlay-desc">${item.description}</div>
                    </div>
                </div>
            `;
            gallery.appendChild(galleryItem);
        });
    }

    // Video bölümünü doldur
    const videoContainer = document.getElementById('videoContainer');
    const videoTitle = document.getElementById('videoTitle');
    const videoDescription = document.getElementById('videoDescription');

    if (data.video) {
        videoTitle.textContent = data.video.title;
        videoDescription.textContent = data.video.description;
        videoContainer.innerHTML = `<iframe src="${data.video.embed}" allowfullscreen="" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" loading="lazy"></iframe>`;
    }

    // Yolculuk bölümünü doldur
    const journeyTitle = document.getElementById('journeyTitle');
    const journeyDescription = document.getElementById('journeyDescription');
    const journeySubtitle = document.getElementById('journeySubtitle');

    if (journeyTitle) journeyTitle.textContent = data.title;
    if (journeySubtitle && data.subtitle) journeySubtitle.textContent = data.subtitle;
    if (journeyDescription) journeyDescription.textContent = data.description;
}

/* ============================================
   DİL DEĞİŞTİRME İŞLEVİ
   ============================================ */

/**
 * Dil değiştiğinde tüm içeriği yeniden yükle
 */
async function loadTabContent() {
    await loadPersonalSection();
    await loadSystemSection();
    await loadDesignSection();
}

/* ============================================
   BAŞLANGIC KURULUMU
   ============================================ */

/**
 * Sayfayı başlat
 */
async function initPage() {
    // Sekme butonlarını başlat
    initTabButtons();

    // Tüm bölümleri yükle
    await loadTabContent();

    // Kişisel Hayat sekmesini varsayılan olarak aç
    switchTab('personal');
}

// Sayfa yüklendiğinde başlat
document.addEventListener('DOMContentLoaded', initPage);
