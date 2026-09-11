# Cüzdanım Yeniden Tasarımı ve GitHub Entegrasyonu Tasarım Belgesi

**Tarih:** 11 Eylül 2026  
**Durum:** Onaylandı  
**Kapsam:** GitHub Reposu Açma/Pushlama, Cüzdanım Başlığı, Ayarlar Küresi, Sekmeli/Kaydırmalı Düzen, Dinamik Camsı Kartlar, Satır İçi Kategori/Alt Başlık Ekleme, Metin Temizliği.

---

## 1. Amaç ve Genel Bakış
Uygulamanın mobil öncelikli, modern bir finans arayüzüne kavuşturulması ("Cüzdanım"), ekran karmaşasının giderilmesi, iki sekmeli (Özet vs. Analiz & Tablolar) akıcı bir gezinme sunulması ve projenin GitHub üzerinde `cuzdan` adında bir depoya aktarılması.

---

## 2. Mimari ve Bileşen Değişiklikleri

### 2.1. GitHub Entegrasyonu
* GitHub CLI (`gh`) kurulumu ve `gh auth login` yetkilendirmesi.
* `gh repo create cuzdan --public --source=. --push` ile uzaktaki reponun oluşturulması ve kodların pushlanması.

### 2.2. Üst Bar (Header) ve Ayarlar Küresi
* Üst ortadaki gereksiz açıklamalar ve versiyon bilgisi temizlenecek; sadece sade ve güçlü **"Cüzdanım"** başlığı yer alacak.
* Sağ üst köşeye camsı, küre biçiminde ve içinde dönebilen çark ikonu barındıran **Ayarlar Butonu** eklenecek.
* Ana ekrandaki "Kategori", "Yedekle", "Yükle" ve "Sıfırla" butonları kaldırılarak doğrudan Ayarlar Modalı içerisine taşınacak.

### 2.3. İki Sekmeli Gezinme (Bottom Bar + Parmakla Kaydırma)
* Alt Gezinme Çubuğu (Bottom Navigation Bar):
  * **1. Sekme - Özet:** KPI Kartları (Gelir, Gider, Borç, Net Varlık), Hızlı Gelir & Gider Ekle Butonları.
  * **2. Sekme - Analiz & Tablolar:** Harcama Dağılımı Pasta Grafiği (Drill-Down), Aylık Gelir Tablosu, Aylık Gider Tablosu.
* Dokunmatik Sağa/Sola Kaydırma (Swipe Gesture):
  * Mobil dokunmatik olayları (`touchstart`, `touchmove`, `touchend`) ile sekmeler arası yatay kaydırma animasyonu.

### 2.4. Dinamik Kaydırma Işığı & Camsı Kartlar (Scroll-Driven Glassmorphism)
* Ekran dikeyde kaydırıldıkça KPI kartlarının camsı `backdrop-blur` derinliği ve radyal ışık gradyanlarının (yeşil, kırmızı, kehribar, mor) parıltısı ve konumu dinamik olarak canlandırılacak.

### 2.5. Modal İçi Hızlı Kategori ve Alt Başlık Ekleme (Inline Creation)
* `TransactionModal` içinde:
  * Kategori açılır menüsünün hemen altında `+ Yeni Kategori Ekle` butonu ve inline girdi alanı.
  * Alt başlık açılır menüsünün hemen altında `+ Yeni Alt Başlık Ekle` butonu ve inline girdi alanı.
  * Eklenen yeni değerler anında kategori listesine kaydedilecek ve seçili hale gelecek.

### 2.6. Metin ve Arayüz Temizliği
* "Aylık gelir gider tablosu" -> **"Aylık Gelir Tablosu"** olarak yeniden adlandırılacak.
* En alttaki "Bütçe ve net varlık takip programı..." tanıtım metni kaldırılacak.
* "Toplam işlem sayısı: X" metni kaldırılacak.

---

## 3. Doğrulama ve Kabul Kriterleri
- [ ] `gh` ile GitHub'da `cuzdan` reposunun oluşması ve git push'un başarıyla tamamlanması.
- [ ] Header'da sadece "Cüzdanım" ve sağ üstte küre çark butonunun bulunması.
- [ ] Ayarlar menüsünden yedekleme, yükleme ve sıfırlamanın eksiksiz çalışması.
- [ ] Sekmelerin hem alt bardan hem parmakla kaydırarak sorunsuz geçiş yapması.
- [ ] 2. sekmede grafik ve tabloların tam görünmesi ve "Aylık Gelir Tablosu" adını taşıması.
- [ ] Yeni kategori ve alt başlık eklemenin modal içinden anında yapılabilmesi.
- [ ] Kartların kaydırma ile dinamik parıldaması.
- [ ] Alt kısımdaki gereksiz metinlerin temizlenmiş olması.
- [ ] Mevcut 17 matematiksel birim testinin yeşil (PASS) kalması.
