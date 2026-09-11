# Mobil Uygulama Tasarım Belgesi: Expo ile iOS & Android Entegrasyonu

**Tarih:** 11 Eylül 2026  
**Durum:** Taslak / Kullanıcı Onayına Sunuldu  
**Platformlar:** iOS (Öncelikli Test Cihazı) & Android  

---

## 1. Genel Bakış ve Amaç
Mevcut çalışan web tabanlı kişisel bütçe ve borç takip sistemini, tarayıcı kısayolu (PWA bookmark) yerine, doğrudan iPhone ve Android cihazlarda bağımsız olarak çalışan gerçek bir mobil uygulamaya dönüştürmek.

Apple Developer hesabı gerektirmeden hemen iPhone üzerinde test edebilmek için **Expo Go** altyapısı tercih edilmiştir. İleride Apple Developer hesabı alındığında, tek bir komutla (`eas build`) resmi App Store ve TestFlight sürümüne dönüştürülebilecektir.

---

## 2. Mimari Yapı

### 2.1. Çekirdek Mantık ve Arayüz (Zero-Logic Rewrite)
* Mevcut HTML5, Tailwind CSS, saf JavaScript modülleri (`src/`) ve `Chart.js` grafikleri %100 korunur.
* Mevcut matematiksel hesaplama testleri (`tests/calculations.test.js`) bozulmadan çalışmaya devam eder.
* Proje web tarayıcısında da bağımsız çalışabilirliğini korur.

### 2.2. Mobil Katman (Expo Shell)
* Projeye hafif bir Expo mobil kabuğu eklenir.
* `react-native-webview` bileşeni ile mevcut web varlıkları yerel olarak cihaza gömülür (offline-first).
* **Güvenli Alan (Safe Area):** iPhone'un Dinamik Ada (Dynamic Island) / kamera çentiği ve alt gezinme çubuğu ile çakışmaları önlemek için CSS safe-area uyarlamaları yapılır.
* **Splash Screen & App Icon:** Koyu temaya uygun açılış ekranı ve uygulama simgesi tanımlanır.

---

## 3. Test ve Çalıştırma Süreci (iPhone)

1. **Geliştirme Ortamı:**
   * Bilgisayara `Node.js LTS` kurulur (`winget` üzerinden hızlıca).
   * Gerekli bağımlılıklar (`expo`, `react-native-webview`) yüklenir.
2. **iPhone'da Test:**
   * iPhone'a App Store'dan ücretsiz **Expo Go** uygulaması indirilir.
   * Bilgisayarda `npx expo start` çalıştırılır.
   * Terminalde beliren QR kod iPhone kamerası ile taranır.
   * Uygulama, iPhone'da tam ekran, tarayıcı çubuğu olmadan gerçek bir yerel mobil uygulama gibi anında çalışır.
3. **Canlı Güncelleme (Fast Refresh):**
   * Kodda yapılan herhangi bir değişiklik (renk, buton, hesaplama) anında iPhone ekranında yenilenir.

---

## 4. Veri Depolama ve Çevrimdışı Güvenlik

* **Yerel Kalıcılık:** Veriler iPhone'un yerel depolama alanında tutulur; internet kapalıyken bile uygulama eksiksiz çalışır.
* **Yedekleme (JSON Export / Import):**
  * Kullanıcı "Yedek Al" butonuna bastığında iOS Paylaşım Menüsü (Share Sheet) açılarak yedek dosyasını iCloud Drive, Dosyalar veya WhatsApp'a gönderebilir.
  * Bilgisayardaki mevcut `gelir-gider-yedek.json` dosyası iPhone'dan "Yedek Yükle" denilerek içeri aktarılabilir.

---

## 5. Geleceğe Yönelik Yayınlama (Production / Apple Dev Account)

* Kullanıcı Apple Developer hesabı edindiğinde:
  * Expo EAS Build (`npx eas build -p ios`) servisi kullanılarak doğrudan resmi `.ipa` ve TestFlight derlemesi alınacaktır.
  * Kodda veya mimaride herhangi bir değişiklik yapılmasına gerek kalmayacaktır.

---

## 6. Doğrulama ve Kabul Kriterleri

- [ ] Node.js ve Expo ortamının hazır hale gelmesi.
- [ ] Mobil projenin Expo Go ile iPhone'da açılması ve tam ekran çalışması.
- [ ] Safe-area (çentik/alt bar) uyumunun kusursuz olması.
- [ ] Gelir, gider, kart borcu, faiz hesaplamaları ve grafiklerin mobilde sorunsuz işlemesi.
- [ ] JSON yedek alma ve yükleme fonksiyonlarının iPhone'da çalışması.
