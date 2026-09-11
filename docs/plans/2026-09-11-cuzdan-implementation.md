# Cüzdanım Yeniden Tasarımı ve GitHub Entegrasyonu Implementation Plan

> **For Antigravity:** REQUIRED SUB-SKILL: Load executing-plans to implement this plan task-by-task.

**Goal:** Projeyi GitHub üzerinde `cuzdan` reposuna aktarmak ve uygulamayı mobil öncelikli, modern, iki sekmeli (Özet vs. Analiz & Tablolar), küre çark ayarlar butonlu ve dinamik camsı kartlara sahip "Cüzdanım" arayüzüne dönüştürmek.

**Architecture:** Vanilla ES Modules mimarisi korunur. `Header.js`, `SettingsModal.js`, `TransactionModal.js`, `TransactionTables.js`, `KPICards.js`, `styles.css` ve `index.html` modüler şekilde güncellenir; dokunmatik sağa/sola kaydırma (swipe gesture) ve alt navigasyon çubuğu eklenir.

**Tech Stack:** JavaScript (ES Modules), Tailwind CSS, Chart.js, GitHub CLI (`gh`), Git.

---

### Task 1: GitHub CLI Kurulumu ve `cuzdan` Reposuna Pushlama

**Files:**
- Sistem: GitHub CLI (`winget install GitHub.cli`)
- Git: Uzak repo bağlantısı (`origin`)

**Step 1: GitHub CLI kurulu olup olmadığını kontrol et, yoksa kur**
Run: `winget install --id GitHub.cli --source winget --silent --accept-package-agreements --accept-source-agreements`
Expected: Başarılı kurulum mesajı

**Step 2: GitHub hesabına oturum aç**
Run: `gh auth login`
Expected: Tarayıcı yetkilendirmesi ile başarılı giriş

**Step 3: `cuzdan` reposunu oluştur ve pushla**
Run: `gh repo create cuzdan --public --source=. --push`
Expected: Reponun oluşturulup kodların GitHub'a gönderilmesi

---

### Task 2: Header Yenilemesi: "Cüzdanım" Başlığı & Küre Çark Ayarlar Butonu

**Files:**
- Modify: `c:/Users/erenu/Documents/antigravity/gelir-gider/src/components/Header.js`
- Modify: `c:/Users/erenu/Documents/antigravity/gelir-gider/src/styles.css`

**Step 1: Header bileşenini sadeleştir**
- Orta alandaki uzun alt başlığı ve versiyon etiketini kaldır.
- Başlığı doğrudan ve sadece `Cüzdanım` olarak konumlandır.
- Ana ekrandaki "Kategori", "Yedekle", "Yükle" ve "Sıfırla" butonlarını header'dan kaldır.

**Step 2: Sağ üst köşeye camsı küre çark butonu ekle**
- Yuvarlak, gölgeli, camsı (`glass-sphere`) buton stili tanımla.
- İçine `settings` ikonunu yerleştir ve tıklandığında `onOpenSettings` callback'ini tetikle.

**Step 3: Değişiklikleri commit et**
Run: `git add src/components/Header.js src/styles.css; git commit -m "feat(ui): redesign header with Cuzdanim title and sphere settings button"`

---

### Task 3: Ayarlar Modalı: Yedekleme, Yükleme ve Sıfırlama Butonlarının Taşınması

**Files:**
- Modify: `c:/Users/erenu/Documents/antigravity/gelir-gider/src/components/SettingsModal.js`
- Modify: `c:/Users/erenu/Documents/antigravity/gelir-gider/src/app.js`

**Step 1: SettingsModal içerisine "Veri Yönetimi & Yedekleme" bölümü ekle**
- "📥 Yedek Al (JSON İndir)" butonu
- "📤 Yedek Yükle (JSON Dosyası Seç)" butonu
- "🗑️ Tüm Verileri Sıfırla" butonu

**Step 2: `src/app.js` içerisinde buton olaylarını bağla**
- Yedekleme, yükleme ve sıfırlama işlemlerini SettingsModal callback'leri ile yönet.

**Step 3: Değişiklikleri commit et**
Run: `git add src/components/SettingsModal.js src/app.js; git commit -m "feat(ui): relocate backup, restore, and reset actions into settings modal"`

---

### Task 4: İki Sekmeli Gezinme (Bottom Bar & Swipe) ve Tablo Düzeni

**Files:**
- Modify: `c:/Users/erenu/Documents/antigravity/gelir-gider/index.html`
- Modify: `c:/Users/erenu/Documents/antigravity/gelir-gider/src/app.js`
- Modify: `c:/Users/erenu/Documents/antigravity/gelir-gider/src/components/TransactionTables.js`
- Modify: `c:/Users/erenu/Documents/antigravity/gelir-gider/src/styles.css`

**Step 1: Alt Gezinme Çubuğu (Bottom Navigation Bar) ekle**
- Sabit alt bar (`fixed bottom-0`):
  - 🏠 **Özet:** 1. Sekme
  - 📊 **Analiz & Tablolar:** 2. Sekme

**Step 2: Sekmelerin içeriklerini ayır**
- **1. Sekme (Özet):** KPI Kartları, Net Varlık, Hızlı Gelir/Gider Ekleme Butonları.
- **2. Sekme (Analiz & Tablolar):** Harcama Dağılımı (Pasta Grafiği), Aylık Gelir Tablosu, Aylık Gider Tablosu.

**Step 3: Dokunmatik kaydırma (Touch Swipe) ekle**
- Ekranda parmakla sola kaydırınca 2. sekmeye, sağa kaydırınca 1. sekmeye geçiş sağla.

**Step 4: Tablo başlığını güncelle**
- "Aylık gelir gider tablosu" başlığını **"Aylık Gelir Tablosu"** olarak değiştir.

**Step 5: Değişiklikleri commit et**
Run: `git add index.html src/app.js src/components/TransactionTables.js src/styles.css; git commit -m "feat(ui): add bottom navigation bar, swipeable tabs, and rename income table"`

---

### Task 5: Dinamik Kaydırma Işığı & Camsı Kartlar (Scroll-Driven Glassmorphism)

**Files:**
- Modify: `c:/Users/erenu/Documents/antigravity/gelir-gider/src/styles.css`
- Modify: `c:/Users/erenu/Documents/antigravity/gelir-gider/src/components/KPICards.js`

**Step 1: CSS scroll değişkenleri ve camsı derinlik efektlerini tanımla**
- Kaydırma mesafesine göre dinamik yansıma ve radyal ışıma sağlayan sınıflar ekle.

**Step 2: KPICards bileşeninde kaydırma dinleyicisi (scroll listener) ekle**
- Ekran aşağı kaydırıldıkça kartların ışık gradyanlarının yumuşakça canlanmasını sağla.

**Step 3: Değişiklikleri commit et**
Run: `git add src/styles.css src/components/KPICards.js; git commit -m "style: implement dynamic scroll-driven glassmorphism for KPI cards"`

---

### Task 6: Modal İçi Hızlı Kategori ve Alt Başlık Ekleme (Inline Creation)

**Files:**
- Modify: `c:/Users/erenu/Documents/antigravity/gelir-gider/src/components/TransactionModal.js`
- Modify: `c:/Users/erenu/Documents/antigravity/gelir-gider/src/utils/storage.js`

**Step 1: Kategori seçim alanının altına "+ Yeni Kategori Ekle" butonu ve satır içi input ekle**
- Tıklandığında küçük bir metin alanı açılsın; isim girilip onaylanınca listeye eklensin ve seçilsin.

**Step 2: Alt başlık seçim alanının altına "+ Yeni Alt Başlık Ekle" butonu ve satır içi input ekle**
- Tıklandığında o kategoriye ait yeni alt başlık eklensin ve anında seçilsin.

**Step 3: Özel kategorileri localStorage'da sakla ve yükle**

**Step 4: Değişiklikleri commit et**
Run: `git add src/components/TransactionModal.js src/utils/storage.js; git commit -m "feat(ui): support inline category and subcategory creation inside transaction modal"`

---

### Task 7: Alt Bilgi (Footer) ve İşlem Sayısı Metinlerinin Temizliği

**Files:**
- Modify: `c:/Users/erenu/Documents/antigravity/gelir-gider/index.html`
- Modify: `c:/Users/erenu/Documents/antigravity/gelir-gider/src/components/TransactionTables.js`

**Step 1: Gereksiz tanıtım ve sayaç yazılarını kaldır**
- En alttaki "Bütçe ve net varlık takip programı..." metnini kaldır.
- "Toplam işlem sayısı: X" metnini kaldır.

**Step 2: Değişiklikleri commit et**
Run: `git add index.html src/components/TransactionTables.js; git commit -m "chore(ui): clean up redundant footer and transaction count texts"`

---

### Task 8: Testler, Doğrulama ve GitHub `cuzdan` Push

**Files:**
- Testler: `tests/calculations.test.js`

**Step 1: Tüm birim testlerini çalıştır**
Run: `node -e "import('./tests/calculations.test.js').then(m => m.runTests())"`
Expected: 17/17 PASSED

**Step 2: Tüm değişiklikleri GitHub `cuzdan` reposuna pushla**
Run: `git push -u origin feature/budget-tracker` veya `main`
Expected: Kodların GitHub'da güncellenmesi
