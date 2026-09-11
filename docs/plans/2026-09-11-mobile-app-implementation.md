# Mobil Uygulama (Expo & iOS) Implementation Plan

> **For Antigravity:** REQUIRED SUB-SKILL: Load executing-plans to implement this plan task-by-task.

**Goal:** Mevcut bütçe takip web uygulamasını, kod mimarisini ve hesaplama mantığını bozmadan Expo ile iOS (ve Android) cihazlarda bağımsız, yerel çalışan bir mobil uygulamaya dönüştürmek ve Expo Go ile iPhone'da test edilebilir hale getirmek.

**Architecture:** Mevcut HTML5, Tailwind CSS, saf JavaScript modülleri ve Chart.js çekirdeği korunarak, hafif bir Expo React Native WebView kabuğu içine yerleştirilir. Cihaz güvenli alanları (Safe Area) ve mobil dokunmatik etkileşimleri optimize edilir.

**Tech Stack:** JavaScript (ES Modules), Tailwind CSS, Chart.js, Node.js, Expo (~51+), react-native-webview.

---

### Task 1: Node.js LTS Kurulumu ve Geliştirme Ortamı Hazırlığı

**Files:**
- Sistem: Node.js LTS (`winget install OpenJS.NodeJS.LTS`)

**Step 1: Node.js kurulu olup olmadığını kontrol et**
Run: `node -v` ve `npm -v`
Expected: Sürüm bilgisi (v20+ veya v22+) ya da hata

**Step 2: Eğer kurulu değilse winget ile Node.js LTS yükle**
Run: `winget install OpenJS.NodeJS.LTS --silent --accept-package-agreements --accept-source-agreements`
Expected: Başarılı kurulum mesajı

**Step 3: Kurulumu ve ortam değişkenlerini doğrula**
Run: `node -v` ve `npm -v`
Expected: `v20.x.x` veya üzeri sürüm çıktısı

---

### Task 2: Mobil Arayüz ve Güvenli Alan (Safe Area) Uyarlamaları

**Files:**
- Modify: `c:/Users/erenu/Documents/antigravity/gelir-gider/src/styles.css`
- Modify: `c:/Users/erenu/Documents/antigravity/gelir-gider/index.html`

**Step 1: Viewport ve Safe Area CSS tanımlamalarını ekle**
- `index.html` içerisindeki `<meta name="viewport">` etiketine `viewport-fit=cover` ekle.
- `src/styles.css` içerisine iOS Dinamik Ada, çentik ve alt gezinme çubuğu boşlukları için `padding-top: env(safe-area-inset-top)` ve `padding-bottom: env(safe-area-inset-bottom)` sınıfları tanımla.

**Step 2: Dokunmatik kaydırma ve overscroll davranışını düzenle**
- Kazara sayfa yenilemeyi (pull-to-refresh) önlemek için `overscroll-behavior-y: contain` kuralı ekle.
- Buton ve kartlara dokunma hissini artırmak için mobilde seçimi engelleyen `-webkit-tap-highlight-color: transparent` ekle.

**Step 3: Mevcut hesaplama testlerini çalıştır ve hiçbir şeyin bozulmadığını doğrula**
Run: `start.bat` veya test koşumu
Expected: 9 testin tümü geçerli

**Step 4: Değişiklikleri commit et**
Run: `git add src/styles.css index.html; git commit -m "style: add mobile safe-area insets and touch optimizations"`

---

### Task 3: Expo Mobil Projesinin (Kabuk) Oluşturulması ve Yapılandırılması

**Files:**
- Create: `c:/Users/erenu/Documents/antigravity/gelir-gider/mobile/package.json`
- Create: `c:/Users/erenu/Documents/antigravity/gelir-gider/mobile/app.json`
- Create: `c:/Users/erenu/Documents/antigravity/gelir-gider/mobile/App.js`

**Step 1: Mobile dizininde Expo ve react-native-webview bağımlılıklarını kur**
- Proje kökünde veya `mobile/` alt dizininde `npx create-expo-app` veya minimal Expo şablonu oluştur.
- `npx expo install react-native-webview expo-status-bar` çalıştır.

**Step 2: App.js dosyasını tam ekran WebView olarak kodla**
- `App.js` içerisinde `react-native-webview` bileşeniyle yerel `index.html` veya yerel sunucu bağlantısını yükle.
- iOS durum çubuğunu koyu temaya (`status-bar style="light"`) uyarla.

**Step 3: app.json dosyasını yapılandır**
- Uygulama adı: "Bütçe & Net Değer"
- Slug: "gelir-gider"
- Orientation: "portrait"
- iOS bundleIdentifier: "com.erenu.gelirgider"
- Android package: "com.erenu.gelirgider"

**Step 4: Değişiklikleri commit et**
Run: `git add mobile/; git commit -m "feat(mobile): scaffold expo container with webview"`

---

### Task 4: Çevrimdışı Varlıklar ve Veri Kalıcılığının Sağlanması

**Files:**
- Modify: `c:/Users/erenu/Documents/antigravity/gelir-gider/mobile/App.js`
- Test: Yerel depolama (`localStorage`) kalıcılığı

**Step 1: WebView ayarlarını çevrimdışı depolamaya izin verecek şekilde yapılandır**
- `domStorageEnabled={true}`
- `allowFileAccess={true}`
- `originWhitelist={['*']}`

**Step 2: Test verisi ekleyerek uygulamanın kapatılıp açıldığında veriyi koruduğunu doğrula**
Expected: Eklenen harcamalar ve kart borcu sıfırlanmaz, kalıcı olarak saklanır.

**Step 3: Değişiklikleri commit et**
Run: `git add mobile/App.js; git commit -m "feat(mobile): enable persistent local storage in webview"`

---

### Task 5: Expo Go ile iPhone Üzerinde Canlı Test ve Doğrulama

**Files:**
- Test Çalıştırma: `npx expo start`

**Step 1: Expo geliştirme sunucusunu başlat**
Run: `npx expo start` (mobile klasöründe)
Expected: Terminalde QR kodun görüntülenmesi

**Step 2: iPhone'da Expo Go ile QR kodu tara**
Expected: Uygulama iPhone'da tam ekran, şık ve akıcı bir şekilde açılır.

**Step 3: Kullanıcı doğrulama adımları**
- Gelir/gider ekleme
- Grafiklerin açılması ve kategorilere tıklanması
- Kredi kartı borç ödeme ve faiz ekleme pencereleri
- Safe-area ve çentik hizalanmasının kontrolü
