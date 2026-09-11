# Apple VisionOS Tarzı Kristal Buzlu Cam Kart Tasarımı Uygulama Planı

> **For Antigravity:** REQUIRED SUB-SKILL: Load executing-plans to implement this plan task-by-task.

**Goal:** Finansal özet ve KPI bilgi kartlarını opasite, optik bulanıklık (blur), renk doygunluğu (saturate) ve kristal kenar yansımaları (specular rim highlights) ile gerçekçi Apple VisionOS tarzı buzlu cam kartlara dönüştürmek.

**Architecture:** CSS tabanlı glassmorphism kurallarını (`src/styles.css`) derinleştirerek `.glass-panel-card` ve radyal gradyan katmanlarını (`.kpi-gradient-*`) yeniden yapılandırmak. İkon kapsüllerini ve tipografi kontrastını korumak.

**Tech Stack:** CSS Custom Properties, CSS Backdrop Filters, Tailwind CSS, Lucide Icons.

---

### Task 1: CSS Buzlu Cam ve Speküler Işık Katmanlarının Güncellenmesi

**Files:**
- Modify: `src/styles.css:40-76`

**Adımlar:**
1. `.glass-panel-card` sınıfında opasiteyi %85'ten %42-%46 seviyesine çekme (`rgba(15, 23, 42, 0.45)`).
2. `backdrop-filter` değerini `blur(24px) saturate(190%)` seviyesine çıkararak arkadan süzülen renklerin kırılma kalitesini artırma.
3. Üst kenara kristal ışık vurması (`border-top: 1px solid rgba(255, 255, 255, 0.35)`) ve derin iç gölge yansıması (`inset 0 1px 2px rgba(255, 255, 255, 0.25)`) ekleme.
4. `.kpi-gradient-*` radyal gradyanlarında merkez ışıma opaklıklarını %22'den %35-%42 seviyesine çekerek dinamik kaydırma ışığının camın arkasından canlı bir aura gibi süzülmesini sağlama.

---

### Task 2: Kart İçi Kontrast ve Tipografi İnce Ayarları

**Files:**
- Modify: `src/components/KPICards.js:25-152`

**Adımlar:**
1. Saydamlaşan cam zemin üzerinde rakamların (`formatCurrency(...)`) ve başlıkların her koşulda jilet gibi okunabilir kalması için hafif metin gölgesi (`drop-shadow-sm`) ile netliği güvenceye alma.
2. Kart içindeki ikon kutucuklarına daha zengin camsı kenarlıklar (`border-white/20 bg-white/10 backdrop-blur-md`) ekleme.

---

### Task 3: Testler & Doğrulama

**Files:**
- Test: `tests/calculations.test.js`, `tests/touchTracker.test.js`, `tests/sliderHeight.test.js`

**Adımlar:**
1. 35 birim testin tamamını çalıştırma ve sıfır regresyon sağlandığını teyit etme.
2. Değişiklikleri commit edip GitHub reposuna pushlama.
