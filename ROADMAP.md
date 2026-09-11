# 🚀 Cüzdanım - Gelecek Özellikler (Roadmap) & Kullanım Rehberi (Tutorial)

Bu doküman, **Cüzdanım** uygulamasının gelecekte geliştirilmesi planlanan özelliklerini ve uygulamayı ilk kez açan kullanıcılar için adım adım başlangıç rehberini içerir.

---

## 🧭 Bölüm 1: Yeni Başlayanlar İçin Hızlı Başlangıç Rehberi (Tutorial)

Cüzdanım, kişisel bütçenizi, nakit akışınızı ve net varlığınızı en zahmetsiz şekilde yönetmeniz için tasarlandı. İlk kez açtığınızda şu adımları takip edebilirsiniz:

### 1. Adım: İlk Finansal Ayarlarınızı Yapın ⚙️
* Ekranın sağ üst köşesindeki **küre içindeki çark (Ayarlar)** butonuna dokunun.
* **Geçmişten Kalan Kart Borcu:** Varsa mevcut kredi kartı borcunuzu yazın.
* **Sabit Aylık Maaş:** Her ay otomatik olarak gelir tablonuza yansıtılacak maaş tutarınızı ve maaş gününüzü belirleyip kaydedin.

### 2. Adım: Hızlıca Gelir veya Gider Ekleyin ➕
* Ekranın sağ alt köşesinde havada duran **mor `+` küre butonuna** dokunun.
* **İşlem Tipi:** Üstten "Gider" veya "Gelir" seçin.
* **Ödeme Yöntemi:** Gider ekliyorsanız *"Kredi Kartı"* veya *"Nakit / Banka"* seçeneğini belirleyin. Kart harcamalarınız otomatik olarak Kart Borcu kartına eklenir.

### 3. Adım: Pratik Kategori ve Alt Başlık Yönetimi 🏷️
* Kategoriyi seçerken aradığınız başlık listede yoksa, açılır listenin (dropdown) en altına inin.
* **`➕ + Yeni Kategori Ekle...`** veya **`➕ + Yeni Alt Başlık Ekle...`** seçeneğini seçtiğinizde anında yeni kutu açılır; adını yazıp kaydedin.

### 4. Adım: Camsı Bilgi Kartlarını Yorumlama 💎
* **Aylık Gelir & Gider:** O ayki toplam nakit giriş ve çıkışlarınızı gösterir.
* **Kart Borcu:** Aktif kredi kartı bakiyenizi takip eder. 
  - Kartınıza ekstre faizi yansıdığında kartın üzerindeki **`+ Faiz`** butonuna basabilirsiniz.
  - Karta ödeme yaptığınızda **`Borç Öde`** butonuna basarak nakit bakiyenizden düşüp borcu azaltabilirsiniz.
* **Aylık Net Fark:** Ay içindeki tasarruf tutarınızı ve tasarruf oranınızı (%) belirtir.
* **Toplam Net Varlık:** *Kullanılabilir Nakit - Kalan Kart Borcu* formülüyle gerçek kümülatif servetinizi gösterir.

### 5. Adım: Sekmeler Arası Akıcı Geçiş & Analiz 📊
* Ekranı parmağınızla **sağa veya sola kaydırarak** (veya alttaki "Analiz & Tablolar" butonuna dokunarak) 2. sekmeye geçin.
* Burada harcamalarınızın **interaktif pasta grafiğini** görebilir, bir kategoriye dokunarak alt başlıkların yüzdesel dağılımını inceleyebilirsiniz.
* Sayfanın alt kısmında o ayki tüm gelir ve gider kayıtlarınız kronolojik sırayla listelenir; dilediğiniz işlemi düzenleyebilir veya silebilirsiniz.

### 6. Adım: Veri Güvenliği ve Yedekleme 🔒
* Verileriniz hiçbir sunucuya gönderilmez, yalnızca telefonunuzun/tarayıcınızın kendi hafızasında saklanır.
* İstediğiniz zaman Ayarlar menüsünden **"Yedek İndir (JSON)"** diyerek finansal kayıtlarınızı tek tıkla cihazınıza indirebilir veya başka bir cihaza **"Yedek Yükle"** ile aktarabilirsiniz.

---

## 🔮 Bölüm 2: Gelecekte Eklenecek Özellikler (Feature Roadmap & Backlog)

Uygulamanın ilerleyen sürümlerinde eklenmesi hedeflenen inovatif özellikler:

### 📱 1. Bağımsız Mobil Uygulama & Çevrimdışı PWA Desteği
- [ ] `manifest.json`, Service Worker ve iOS WebClip ikonları eklenerek Safari/Chrome üzerinden "Ana Ekrana Ekle" ile tam bağımsız, adres çubuğu olmayan yerel uygulama deneyimi.
- [ ] İnternet bağlantısı olmasa dahi %100 çevrimdışı (offline) çalışabilme.

### ☁️ 2. Bulut Senkronizasyonu & Çoklu Cihaz Desteği
- [ ] Opsiyonel Google Drive veya iCloud entegrasyonu ile telefon, tablet ve bilgisayar arasında otomatik arka plan senkronizasyonu.
- [ ] İsteğe bağlı şifreli uçtan uca (E2EE) bulut veritabanı desteği.

### 🎯 3. Bütçe Limitleri ve Harcama Alarmları
- [ ] Kategori bazlı aylık bütçe hedefi belirleme (Örn: *"Market harcamaları bu ay 15.000 TL'yi geçmesin"*).
- [ ] Bütçenin %80'ine ve %100'üne ulaşıldığında kart üzerinde renkli uyarılar ve ilerleme (progress) barları.

### 📈 4. Gelişmiş Zaman Serisi & Yıllık Trend Analizi
- [ ] Aylık karşılaştırmalı gelir-gider çubuk grafikleri (Geçen aya göre % kaç arttı/azaldı?).
- [ ] Net varlığın son 12 aydaki büyüme eğrisi (zaman serisi çizgi grafiği).
- [ ] Yıllık toplam tasarruf ve vergi/harcama özeti.

### 🧾 5. Yapay Zeka ile Fiş/Fatura Tarama (OCR Desteği)
- [ ] Telefon kamerasıyla alışveriş fişinin veya faturanın fotoğrafını çekerek tutar, tarih ve kategoriyi yapay zeka ile otomatik doldurma.

### 🔄 6. Yinelenen & Otomatik İşlemler (Recurring Transactions)
- [ ] Her ayın belirli günlerinde otomatik olarak işlenen kira, aidat, internet faturası ve abonelik (Netflix, Spotify vb.) tanımlama.

### 📄 7. PDF ve Excel (CSV) Rapor Dışa Aktarma
- [ ] Aylık veya yıllık gelir-gider tablosunu tek tıkla şık bir PDF raporu veya Excel tablosu (.xlsx / .csv) olarak indirme.

### 🔐 8. Biyometrik Kilit & Gizlilik Modu (Face ID / PIN)
- [ ] Uygulamayı açarken Face ID, Touch ID veya 4 haneli PIN kodu doğrulama.
- [ ] Toplu taşımada veya kalabalık ortamlarda tutarları tek dokunuşla gizleyen **"Göz / Gizlilik Modu"** (`•••• ₺`).

### 💱 9. Çoklu Para Birimi & Yatırım Portföyü
- [ ] USD, EUR, Altın (Gram/Çeyrek), BES ve Kripto varlıkların anlık kurlarla Türk Lirası karşılıklarının hesaplanarak Toplam Net Varlık kartına yansıtılması.
