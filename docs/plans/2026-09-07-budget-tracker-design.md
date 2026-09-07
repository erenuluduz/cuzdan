# Bütçe ve Net Varlık Takip Uygulaması Tasarım Dokümanı

**Tarih:** 2026-09-07  
**Durum:** Onaylandı (Approved)  

---

## 1. Proje Amacı ve Kapsamı
Kullanıcının aylık periyotlar halinde gelir ve giderlerini hiyerarşik kategorilerle takip edebileceği, harcamalarını yüzdesel olarak interaktif bir pasta grafiği (Pie Chart) ile analiz edebileceği ve kümülatif net varlığını (tüm zamanların toplam gelir - gider birikimi) anlık olarak görebileceği modern, hızlı ve responsive bir web uygulaması.

---

## 2. Teknoloji Yığını
* **Ön Yüz (Frontend):** React (Vite) + TypeScript
* **Stil & Arayüz:** Tailwind CSS + Lucide React İkon Kütüphanesi
* **Grafik Motoru:** Recharts (Etkileşimli Pasta / Donut Grafiği ve araç ipuçları)
* **Veri Saklama:** Tarayıcı Yerel Hafızası (LocalStorage)
* **Yedekleme & Taşıma:** JSON Formatında Dışa / İçe Aktarım (Export / Import)

---

## 3. Veri Modeli ve Kategori Hiyerarşisi

### 3.1. Gelir Kategorileri
* **Maaş (Salary)**
* **Mesai (Overtime)**
* **Diğer / Ek Gelir (Other)**

### 3.2. Gider Kategorileri ve Alt Başlıkları
* **Yatırım:**
  * Borsa / Hisse Senedi
  * Altın / Döviz
  * Bireysel Emeklilik (BES)
  * Diğer Yatırımlar
* **Faturalar:**
  * Su Faturası
  * Elektrik Faturası
  * Doğalgaz Faturası
  * Telefon Faturası
  * İnternet / Diğer Faturalar
* **Market:**
  * Mecburi Market (Temel gıda, zorunlu ev ihtiyaçları)
  * Keyfi Market (Atıştırmalık, özel lezzetler)
  * Kişisel Bakım (Kozmetik, hijyen, kişisel bakım)
* **Kredi Kartı:**
  * Ekstre Ödemesi / Taksitler
* **Eğlence:**
  * Dışarıda Yeme-İçme, Kafe, Sinema, Konser, Dijital Abonelikler
* **Ulaşım:**
  * Toplu Taşıma, Akaryakıt, Taksi, Araç Bakım/Sigorta
* **Özel Kategori Desteği:** Kullanıcı dilediğinde yeni kategori ve alt kategori tanımlayabilir.

### 3.3. Veri Tipleri (TypeScript)
```typescript
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: string;
  subcategory?: string;
  amount: number;
  date: string; // YYYY-MM-DD
  monthKey: string; // YYYY-MM
  description?: string;
  createdAt: number;
}

export interface CategoryDefinition {
  id: string;
  name: string;
  type: TransactionType;
  subcategories: string[];
  color: string;
  icon?: string;
}
```

---

## 4. Kullanıcı Arayüzü ve Bileşen Mimarisi

### 4.1. Üst Kontrol Alanı (Header)
* **Dönem Değiştirici:** Bulunulan ayı gösterir (Örn: *Mart 2026*), önceki/sonraki ay geçiş butonları ve tek tıkla "Bu Ay"a dönme.
* **Hızlı İşlem Butonları:** `+ Gelir Ekle` ve `- Gider Ekle` modal butonları.
* **Yedekleme Aksiyonları:** `JSON Yedek İndir` ve `JSON Yükle`.

### 4.2. Finansal KPI Özet Kartları
1. **Aylık Toplam Gelir:** Seçili ayın toplam geliri (Yeşil vurgulu).
2. **Aylık Toplam Gider:** Seçili ayın toplam harcaması (Kırmızı vurgulu).
3. **Aylık Net Tasarruf / Fark:** `Aylık Gelir - Aylık Gider` (Pozitif: Yeşil/Mavi, Negatif: Kırmızı).
4. **Toplam Kümülatif Net Varlık:** Başlangıçtan bugüne tüm ayların birikimli genel bakiyesi ($\sum Gelir - \sum Gider$).

### 4.3. İnteraktif Pasta Grafiği (Pie / Donut Chart)
* Recharts kütüphanesi ile harcamaların kategorisel dağılımı.
* Dilimlerin üzerinde yüzdesel (%) oranlar ve üzerine gelindiğinde (Tooltip) harcama tutarı ve yüzde bilgisi.
* **İki Aşamalı İnceleme (Drill-Down):** Bir kategoriye tıklandığında (örn. *Market* veya *Faturalar*), grafikte o kategorinin alt başlıklarının yüzdesel dağılımı listelenir.

### 4.4. Çift Kolonlu İşlem Tabloları
* **Sol Kolon (Gelirler):** Gelir girişi ve aya ait gelirlerin detaylı listesi (tarih, kategori, açıklama, tutar, düzenle/sil).
* **Sağ Kolon (Giderler):** Gider girişi ve aya ait harcamaların hiyerarşik listesi (kategori ve alt kategori rozetleri, tutar, düzenle/sil).

---

## 5. Finansal Hesaplama Kuralları

1. **Aylık Toplam Gelir:**
   $$\text{Gelir}_{\text{ay}} = \sum_{t \in \text{İşlemler}, t.\text{ay} = \text{seçiliAy}, t.\text{tip} = \text{'income'}} t.\text{tutar}$$

2. **Aylık Toplam Gider:**
   $$\text{Gider}_{\text{ay}} = \sum_{t \in \text{İşlemler}, t.\text{ay} = \text{seçiliAy}, t.\text{tip} = \text{'expense'}} t.\text{tutar}$$

3. **Aylık Net Tasarruf:**
   $$\text{Net}_{\text{ay}} = \text{Gelir}_{\text{ay}} - \text{Gider}_{\text{ay}}$$

4. **Kümülatif Net Varlık:**
   $$\text{Net Varlık} = \sum_{\text{Tüm Gelirler}} \text{Tutar} - \sum_{\text{Tüm Giderler}} \text{Tutar}$$

5. **Kategori Yüzdesi:**
   $$\% = \left( \frac{\text{Kategori Harcaması}}{\text{Aylık Toplam Gider}} \right) \times 100$$

---

## 6. Depolama, Yedekleme ve Doğrulama
* **LocalStorage:** Tüm veriler `budget_transactions` ve `budget_categories` anahtarları altında JSON olarak saklanır.
* **Export (Dışa Aktarım):** `gelir_gider_yedek_YYYY-MM-DD.json` adıyla tüm kayıtlar tek tıkla indirilebilir.
* **Import (İçe Aktarım):** Yüklenen dosyanın şema ve veri doğrulaması yapılır, mevcut veriler üzerine yazılmadan önce onay istenir.
* **Doğrulama:** Pozitif tutar zorunluluğu, geçerli tarih formatı kontrolü ve silme onayları.
