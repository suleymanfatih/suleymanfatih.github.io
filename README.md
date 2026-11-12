# Süleyman Fatih - CV & Portfolyo Web Sitesi

Profesyonel CV ve portföy web siteniz için tam özellikli bir web uygulaması.

## 📁 Proje Yapısı

```
portfolio/
├── index.html                 # Ana sayfa
├── assets/
│   ├── css/
│   │   └── style.css         # Tüm stil ve tema ayarları
│   ├── js/
│   │   └── main.js           # JavaScript işlevselliği
│   ├── data/
│   │   ├── tr.json           # Türkçe içerik
│   │   ├── en.json           # İngilizce içerik
│   │   └── zh.json           # Çince içerik
│   ├── img/
│   │   └── gallery/          # Grafik tasarım galeri görselleri
│   └── video/
│       └── sample.mp4        # Örnek video dosyası
└── README.md                 # Bu dosya
```

## ✨ Özellikler

### 🌍 Dil Desteği
- **Türkçe (TR)**
- **İngilizce (EN)**
- **Çince (ZH)**

Dil seçimi sol üst köşedeki **🌐** butonundan yapılır.

### 🎨 Tema Desteği
- **Açık Mod** (Gündüz)
- **Koyu Mod** (Gece)

Tema değiştirme sağ üst köşedeki **🌙/☀️** butonundan yapılır.

### 📑 Ana Sekmeler

#### 1. **Kişisel Hayat** (👤)
- Hakkımda bölümü (3 konu başlığı)
- Proje gösterimi (linkler ile)

#### 2. **Grafik Tasarım** (🎨)
- Ortada video oynatma alanı
- Kariyer açıklaması
- Estetik galeri (6 örnek görsel)

#### 3. **Sistem & Ağ Yönetimi** (⚙️)
- GitHub profil bağlantısı
- Proje gösterimi

### 🔗 Footer (Sosyal Medya)
- **GitHub** - Profilinize yönlendirir
- **YouTube** - YouTube kanalınıza yönlendirir
- **Mail** - E-posta göndermek için
- **Instagram** - Instagram profilinize yönlendirir

## 🔧 Kurulum ve Kullanım

### 1. **Dosyaları İndirin**
Tüm dosyaları bir klasöre kaydedin.

### 2. **Web Sunucusunda Çalıştırın**
```bash
# Python 3 ile
python -m http.server 8000

# Node.js http-server ile
npx http-server
```

Tarayıcıda `http://localhost:8000/portfolio/` adresini ziyaret edin.

### 3. **İçeriği Güncelleyin**

#### JSON Dosyalarını Düzenle
`assets/data/` klasöründeki JSON dosyalarını açıp özelleştirin:

**Örnek yapı:**
```json
{
  "name": "Süleyman Fatih",
  "tabs": {
    "personal": {
      "sections": [...],
      "projects": [...]
    },
    "design": {
      "gallery": [...],
      "video": {...}
    },
    "systems": {
      "github": {...},
      "projects": [...]
    }
  },
  "footer": {...}
}
```

#### Galeri Görsellerini Ekleyin
1. `assets/img/gallery/` klasörüne görsellerinizi kaydedin
2. JSON dosyasında görsel yollarını güncelleyin

#### Video Ekleyin
1. `assets/video/` klasörüne video dosyası kaydedin
2. JSON dosyasında video yolunu güncelleyin

#### Sosyal Medya Linklerini Güncelleyin
JSON dosyasındaki footer kısmında:
```json
"footer": {
  "github": {
    "url": "https://github.com/kullanıcıadınız"
  },
  "youtube": {
    "url": "https://youtube.com/c/kanalınız"
  },
  "email": {
    "url": "mailto:email@example.com"
  },
  "instagram": {
    "url": "https://instagram.com/kullanıcıadınız"
  }
}
```

## 📱 Responsive Design
- Masaüstü (1200px+)
- Tablet (768px - 1199px)
- Mobil (< 768px)

## 🎯 Özel Özellikler

✅ **Dil Değiştirme** - Tüm içerik anında güncellenir
✅ **Tema Geçişi** - Sorunsuz ışık/koyu mod değişimi
✅ **Yerel Depolama** - Tema ve dil seçimi tarayıcıda kaydedilir
✅ **Animasyonlar** - Yumuşak geçişler ve hover efektleri
✅ **Modern Tasarım** - Gradient başlıklar ve ikonlar
✅ **SEO Hazır** - Semantic HTML ve meta tagları

## 📝 Notlar

- Tüm içerik JSON dosyalarından yönetilir
- HTML dosyası değiştirilmesine gerek yoktur
- CSS dosyası tüm stilleri içerir
- JavaScript otomatik olarak JSON verilerini yükler

## 🚀 Geliştirme Önerileri

1. **Galeri Görsellerini Ekleyin** - `assets/img/gallery/` klasörüne kaydedin
2. **Video Dosyası Ekleyin** - `assets/video/sample.mp4` dosyasını değiştirin
3. **Sosyal Medya Profillerini Güncelleyin** - JSON dosyalarını düzenleyin
4. **Proje Linklerini Değiştirin** - GitHub/portföy URL'lerini güncelleyin
5. **Favicon Ekleyin** - `index.html` `<head>` bölümüne şu satırı ekleyin:
   ```html
   <link rel="icon" type="image/x-icon" href="assets/img/favicon.ico">
   ```
