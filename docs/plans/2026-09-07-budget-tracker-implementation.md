# Bütçe ve Net Varlık Takip Uygulaması Uygulama Planı

> **For Antigravity:** REQUIRED SUB-SKILL: Load executing-plans to implement this plan task-by-task.

**Goal:** Kullanıcının aylık gelir-giderlerini hiyerarşik kategorilerle takip edebileceği, harcamalarını yüzdesel olarak interaktif bir pasta grafiği ile görebileceği ve kümülatif net varlığını izleyebileceği modern bir web uygulaması geliştirmek.

**Architecture:** Sıfır derleme ve sunucu gereksinimi olmaksızın doğrudan tarayıcıda çalışan modern modüler ES Web Uygulaması. Veriler tarayıcının yerel hafızasında (LocalStorage) şifresiz ve güvenle saklanır, tek tıkla JSON yedek alma ve geri yükleme imkanı sunar.

**Tech Stack:** HTML5, Modern Vanilla/ES Modules, Tailwind CSS, Lucide Icons, Chart.js.

---

### Task 1: Kategori Sabitleri ve Veri Modeli Tanımı
**Files:**
- Create: `src/constants/categories.js`

### Task 2: Finansal Hesaplamalar ve Birim Testleri
**Files:**
- Create: `src/utils/calculations.js`
- Test: `tests/calculations.test.js`

### Task 3: Veri Saklama ve Yedekleme (LocalStorage & JSON Export/Import)
**Files:**
- Create: `src/utils/storage.js`

### Task 4: Ana HTML İskeleti ve Stil Entegrasyonu
**Files:**
- Create: `index.html`
- Create: `src/styles.css`

### Task 5: Üst Çubuk (Header) & Ay Değiştirici Bileşeni
**Files:**
- Create: `src/components/Header.js`

### Task 6: Finansal KPI Özet Kartları Bileşeni
**Files:**
- Create: `src/components/KPICards.js`

### Task 7: İnteraktif Pasta Grafiği (Pie / Donut Chart) ve Kırılım (Drill-Down)
**Files:**
- Create: `src/components/ExpenseChart.js`

### Task 8: İşlem Ekleme / Düzenleme Modalı (Gelir & Gider Formları)
**Files:**
- Create: `src/components/TransactionModal.js`

### Task 9: İki Kolonlu Gelir ve Gider Tabloları Listesi
**Files:**
- Create: `src/components/TransactionTables.js`

### Task 10: Yeni Kategori / Alt Kategori Yönetim Modalı
**Files:**
- Create: `src/components/CategoryModal.js`

### Task 11: Ana Uygulama Orkestrasyonu ve Durum Yönetimi
**Files:**
- Create: `src/app.js`

### Task 12: Kolay Başlatıcı Script ve Doğrulama
**Files:**
- Create: `start.bat`
- Run: Tarayıcıda uçtan uca fonksiyonel testler ve git commit
