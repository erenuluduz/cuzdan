# Apple VisionOS Tarzı Kristal Buzlu Cam (Liquid Frosted Glass) Kart Tasarımı

**Tarih:** 2026-09-12  
**Konu:** Bilgi ve KPI kartlarının daha derin, saydam ve kristal cam hissiyatına kavuşturulması.

---

## 1. Problem ve Amaç
Mevcut finansal KPI kartları (`.glass-panel-card`), arka plandaki koyu lacivert/arduvaz rengin opasitesi **%85** (`rgba(30, 41, 59, 0.85)`) olduğu için neredeyse opak durmakta ve cam/derinlik hissi tam olarak yansımamaktaydı. Amaç, kartları Apple VisionOS ve modern iOS tasarım diline uygun, ışığı kıran buzlu kristal cam tabakalarına dönüştürmektir.

---

## 2. Tasarım Bileşenleri

### A. Taban Cam Katmanı (`.glass-panel-card`)
- **Arka Plan:** Saydamlık %85'ten **%40–%48** bandına çekilecek (`rgba(15, 23, 42, 0.45)` ile `rgba(255, 255, 255, 0.07)` harmanlanacak).
- **Optik Cam Kırılması:** `backdrop-filter: blur(24px) saturate(190%)` uygulanarak camın arkasındaki renk doygunluğu ve bulanıklığı kristalize edilecek.
- **Işık Kırılma Kenarı (Specular Highlight):**
  - Üst kenara vuran ışık yansıması için `border-top: 1px solid rgba(255, 255, 255, 0.35)`.
  - Yan ve alt kenarlar için `border: 1px solid rgba(255, 255, 255, 0.12)`.
  - İç yansıma efekti: `box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.25), 0 12px 36px -6px rgba(0, 0, 0, 0.55)`.

### B. Dinamik Renk Parıltıları (Scroll Reactive Glow)
Kaydırma yapıldıkça hareket eden renk kaynakları daha canlı ve parlak bir aydınlatma sunacak:
- **Gelir Kartı:** `rgba(16, 185, 129, 0.35)` canlı zümrüt ışığı.
- **Gider Kartı:** `rgba(239, 68, 68, 0.35)` yakut ışıması.
- **Borç Kartı:** `rgba(245, 158, 11, 0.35)` kehribar parıltısı.
- **Net Fark Kartı:** `rgba(59, 130, 246, 0.35)` safir mavisi.
- **Net Varlık Kartı:** `rgba(168, 85, 247, 0.42)` ametist moru.

### C. Tipografi ve Okunabilirlik Güvencesi
- Saydamlık artırılırken kart içerisindeki yazıların (`text-white`, `font-bold`, `text-slate-300`) kontrastı ve netliği `drop-shadow(0 1px 2px rgba(0,0,0,0.6))` ile korunacaktır.
- İkon rozetleri de camsı parlaklıkla (`bg-white/10 border-white/20`) uyumlu hale getirilecektir.

---

## 3. Doğrulama Kriterleri
- Mevcut 35 adet birim testin (finansal hesaplamalar, yön kilidi, yükseklik) sıfır regresyonla geçmesi.
- Kartların hem dikey kaydırmada renklerinin akıcı oynaması hem de arka planın camdan belirgin bir şekilde süzülmesi.
