# Tasarım Belgesi: Akıcı Kaydırma, Canlı Parmak Takibi ve Açılır Menü İçi Kategori Ekleme

**Tarih:** 11 Eylül 2026  
**Durum:** Onaylandı  

---

## 1. Amaç ve Kapsam
1. Dikey ve yatay kaydırma deneyiminin en üst düzey mobil standartlarına getirilmesi (canlı parmak takibi + Apple spring yaylanma eğrisi + 60/120 FPS momentum dikey kaydırma).
2. Yeni kategori ve alt başlık ekleme eylemlerinin, açılır seçim listelerinin (`<select>`) en altına yerleştirilerek arayüzün sadeleştirilmesi ve sezgisel hale getirilmesi.

---

## 2. Mimari ve Uygulama Detayları

### 2.1. Ultra Yumuşak Kaydırma & Canlı Parmak Takibi (Smooth Physics)
* **Dikey:** CSS `scroll-behavior: smooth`, `-webkit-overflow-scrolling: touch` ve `requestAnimationFrame` throttled scroll listener.
* **Yatay Canlı Takip:**
  * `touchstart`: Başlangıç koordinatları ve aktif sekmenin başlangıç yüzdesi kaydedilir.
  * `touchmove`: Parmağın yatay sürükleme mesafesi hesaplanır; `tabs-slider` transform değeri canlı olarak parmakla eşzamanlı hareket ettirilir (`translateX(calc(...))`).
  * `touchend`: Sürükleme mesafesi eşiği (ekranın %20'si) ve hareket yönüne göre hedef sekmeye `cubic-bezier(0.16, 1, 0.3, 1)` yaylanma animasyonuyla geçiş yapılır.

### 2.2. Açılır Menü İçi Kategori ve Alt Başlık Ekleme (Dropdown Integration)
* `TransactionModal.js`:
  * `<select id="trans-category">` listesinin en sonuna `<option value="__NEW_CAT__">➕ + Yeni Kategori Ekle...</option>` eklenir.
  * `<select id="trans-subcategory">` listesinin en sonuna `<option value="__NEW_SUBCAT__">➕ + Yeni Alt Başlık Ekle...</option>` eklenir.
  * Bu seçenek seçildiğinde inline metin kutusu belirir; onaylandığında kategori kaydedilip seçilir, iptal edilirse eski seçime dönülür.
