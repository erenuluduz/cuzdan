# Tasarım Belgesi: FAB Küre Buton, Sabit Ay Seçici ve Gelir Kartı Güncellemesi

**Tarih:** 11 Eylül 2026  
**Durum:** Onaylandı  

---

## 1. Kapsam ve Amaç
1. Aylık Gelir KPI kartındaki alt açıklamanın "Eylül ayı Gelirleri" olarak güncellenmesi.
2. Sabit dikey/yatay kaydırmadan bağımsız, ekranın sağ altında tek bir `+` küre butonu (Floating Action Button) ile işlem ekleme deneyimi.
3. Ay seçici bileşeninin Header'dan alınıp kartların üst ortasına taşınması ve `sticky` (yapışkan) olarak sayfa kaydırıldıkça sabit kalması.

---

## 2. Bileşen Değişiklikleri
* `KPICards.js`: "Toplamı" -> "Gelirleri".
* `Header.js`: Ay seçici kaldırılarak sadece "Cüzdanım" ve sağda ayarlar küresi bırakılır.
* `app.js`: Ortalanmış ve sticky ay seçici kapsülü eklenir. Sağ alt köşeye `+` FAB küre butonu eklenir ve tıklanınca işlem modalı açılır.
* `styles.css`: FAB küre butonu için parıltı ve hover efektleri.
