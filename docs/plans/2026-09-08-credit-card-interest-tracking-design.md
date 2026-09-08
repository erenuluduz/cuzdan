# Kredi Kartı Faiz Yönetimi Tasarım Dokümanı

**Tarih:** 2026-09-08  
**Durum:** Onaylandı (Approved)  

---

## 1. Amaç
Banka ekstresine yansıyan aylık kredi kartı akdi faizi, gecikme faizi ve KKDF/BSMV vergilerini, kullanıcının ekstre bazında tek tıkla sisteme girmesini sağlamak; bu tutarın hem güncel kart borcunu artırmasını hem de aylık harcama tablosu ile pasta grafiğinde gerçek bir gider olarak gösterilmesini temin etmek.

---

## 2. Finansal Mantık ve Veri Modeli

### 2.1. Faiz İşlemi Nesnesi
Faiz bir finansal kayıp/gider olduğu için `type: 'expense'` olarak kaydedilir:
```typescript
{
  id: string;
  type: 'expense';
  paymentMethod: 'credit_card'; // Kart borcuna eklenmesi için
  category: 'Kredi Kartı';
  subcategory: 'Kart Faizi & Masraflar';
  amount: number; // Ekstredeki net faiz tutarı
  date: string; // YYYY-MM-DD
  monthKey: string; // YYYY-MM
  description: string; // Örn: 'Eylül Ayı Ekstre Faizi & Vergiler'
  createdAt: number;
}
```

### 2.2. Hesaplama ve Grafik Entegrasyonu
* **Kart Borcuna Etkisi:** `paymentMethod: 'credit_card'` olduğundan `calculateCreditCardDebt` fonksiyonunda borç otomatik olarak `+amount` kadar artar.
* **Gider Tablosu ve Pasta Grafiği:** `type: 'expense'` olduğundan seçili ayın giderlerine dahil olur ve Recharts/Chart.js pasta grafiğinde `Kredi Kartı` diliminde görünür.
* **Net Varlık:** Borç arttığı ve gider gerçekleştiği için `calculateRealNetWorth` fonksiyonunda net varlığı doğru oranda azaltır.

---

## 3. Kullanıcı Arayüzü ve Akışlar

1. **"Kart Borcu" KPI Kartı:**
   * Kartın alt kontrol satırında:
     * `[ + Faiz Ekle ]` butonu (Kırmızı/Rose rengi).
     * `[ Borç Öde ]` butonu (Kehribar/Amber rengi).

2. **"Kart Faizi Ekle" Modalı (`CCInterestModal.js`):**
   * Başlık: "Kredi Kartı Faizi Ekle".
   * Alanlar:
     * Faiz Tutarı (TL) - Sayısal pozitif giriş.
     * Ekstre Tarihi - YYYY-MM-DD.
     * Açıklama - İsteğe bağlı not.
   * Bilgilendirme Kutucuğu: *"Bu tutar kart borcunuza eklenecek ve aylık harcamalarınızda 'Kredi Kartı -> Kart Faizi & Masraflar' olarak gösterilecektir."*
