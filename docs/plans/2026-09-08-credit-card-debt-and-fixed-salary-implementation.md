# Kredi Kartı Borç Yönetimi ve Sabit Maaş Uygulama Planı

> **For Antigravity:** REQUIRED SUB-SKILL: Load executing-plans to implement this plan task-by-task.

**Goal:** Kredi kartı harcamalarının çift sayılmasını önleyen, geçmiş borç takibini sağlayan ve sabit aylık maaşı otomatik ekleyen modülü entegre etmek.

**Architecture:** Vanilla ES modülleri, Tailwind CSS, Chart.js ve LocalStorage tabanlı mimarinin genişletilmesi. `cc_payment` tipi transfer işlemleri, `userSettings` konfigürasyonu ve borç hesaplama algoritmaları.

**Tech Stack:** JavaScript (ES6+), HTML5, Tailwind CSS, Chart.js, LocalStorage.

---

### Task 1: Finansal Hesaplamalar ve Borç / Nakit Akışı Birim Testleri
**Files:**
- Modify: `src/utils/calculations.js`
- Modify: `tests/calculations.test.js`

### Task 2: Veri Saklama ve Finansal Ayarlar (Settings Storage)
**Files:**
- Modify: `src/utils/storage.js`

### Task 3: Finansal Ayarlar Modalı (SettingsModal)
**Files:**
- Create: `src/components/SettingsModal.js`

### Task 4: Kredi Kartı Borç Ödeme Modalı (CCPaymentModal)
**Files:**
- Create: `src/components/CCPaymentModal.js`

### Task 5: Harcama Formuna Ödeme Yöntemi Seçeneği Eklenmesi
**Files:**
- Modify: `src/components/TransactionModal.js`

### Task 6: KPI Kartları ve Kredi Kartı Borç Durum Kartı
**Files:**
- Modify: `src/components/KPICards.js`

### Task 7: Üst Çubuk (Header) Ayarlar Butonu
**Files:**
- Modify: `src/components/Header.js`

### Task 8: Otomatik Sabit Maaş Mekanizması ve Ana Uygulama Orkestrasyonu
**Files:**
- Modify: `src/app.js`

### Task 9: Doğrulama ve Testlerin Koşulması
**Files:**
- Run: `tests/run_tests.py` and DOM verification
