# Kredi Kartı Borç Yönetimi ve Sabit Maaş Otomasyonu Tasarım Dokümanı

**Tarih:** 2026-09-08  
**Durum:** Onaylandı (Approved)  

---

## 1. Amaç ve Çözülen Problemler

1. **Kredi Kartı ve Mükerrer Harcama (Çift Sayma) Çıkmazı:**
   * Kullanıcı harcamalarını kredi kartı ile yapmaktadır. Harcama anında Market, Fatura vb. giderler kategorilere ve pasta grafiğine işlenir.
   * Ay sonunda gelirle kart borcu ödendiğinde, bu ödeme sisteme tekrar "Gider" olarak yazılırsa aynı para iki kez harcanmış gibi görünmekte; yazılmazsa gelir fazlaymış gibi görünmektedir.
   * Ayrıca geçmişten gelen birikmiş eski kart borcunun takip edilmesi gerekmektedir.
   * **Çözüm:** Kredi kartı borç havuzu oluşturulur. Harcamalarda varsayılan olarak "Kredi Kartı" seçilir. Ay sonu kart ödemesi yapıldığında bu işlem harcama kategorilerine girmez (çift sayma engellenir); yalnızca kart borcunu eritir ve nakit akışından düşer.

2. **Aylık Tablo Geçişi ve Sabit Maaş:**
   * Sistem aylık periyotlarla çalışır. Her yeni aya geçildiğinde kullanıcı maaşını tekrar tekrar girmek zorunda kalmamalıdır.
   * **Çözüm:** Ayarlar'da bir "Sabit Aylık Maaş" tanımlanır. Yeni bir aya geçildiğinde maaş otomatik olarak o ayın 1'ine eklenmiş gelir; kullanıcı yalnızca o aya ait değişen mesaileri girer.

---

## 2. Genişletilmiş Veri Modelleri

### 2.1. Kullanıcı Finansal Ayarları (`UserSettings`)
```typescript
export interface UserSettings {
  initialCreditCardDebt: number; // Geçmişten kalan birikmiş kart borcu (TL)
  fixedSalaryAmount: number;     // Otomatik eklenecek sabit maaş tutarı (TL)
  salaryDayOfMonth: number;      // Maaşın ekleneceği gün (Varsayılan: 1)
}
```

### 2.2. İşlem Nesnesi (`Transaction`)
```typescript
export type TransactionType = 'income' | 'expense' | 'cc_payment';
export type PaymentMethod = 'credit_card' | 'cash';

export interface Transaction {
  id: string;
  type: TransactionType;
  paymentMethod?: PaymentMethod; // Varsayılan: 'credit_card'
  category: string;
  subcategory?: string;
  amount: number;
  date: string; // YYYY-MM-DD
  monthKey: string; // YYYY-MM
  description?: string;
  createdAt: number;
}
```

---

## 3. Finansal Hesaplama ve Muhasebe Formülleri

1. **Aylık Giderler & Pasta Grafiği:**
   * Tüm `type === 'expense'` kayıtları (ister nakit, ister kredi kartı ile ödenmiş olsun) o ayın harcaması olarak sayılır ve pasta grafiğinde (% yüzdeler) eksiksiz gösterilir.
   * `cc_payment` (kart borcu ödemesi) harcama pasta grafiğine KARIŞMAZ.

2. **Güncel Kredi Kartı Borcu:**
   $$\text{Güncel Borç} = \text{Başlangıç Borcu} + \sum_{t \in \text{Tüm Giderler, } t.\text{paymentMethod} = \text{'credit\_card'}} t.\text{amount} - \sum_{p \in \text{Tüm cc\_payment}} p.\text{amount}$$

3. **Kullanılabilir Nakit / Banka:**
   $$\text{Kullanılabilir Nakit} = \sum \text{Tüm Gelirler} - \sum (\text{Nakit Harcamalar}) - \sum (\text{Karta Yapılan Ödemeler})$$

4. **Gerçek Kümülatif Net Varlık:**
   $$\text{Net Varlık} = \text{Kullanılabilir Nakit} - \text{Güncel Kredi Kartı Borcu}$$

---

## 4. Kullanıcı Arayüzü ve Akışlar

1. **Header (Ayarlar Butonu):**
   * Dişli ikonu ile "Finansal Ayarlar" modalı açılır.
   * Kullanıcı başlangıç kart borcunu ve sabit maaşını belirleyebilir.

2. **KPI Kartları:**
   * "Kredi Kartı Borcu" özel KPI kartı (Kırmızı/Turuncu):
     * Anlık güncel borç tutarı.
     * `[ Borç Öde ]` butonu ile hızlı ödeme modalı.
   * "Net Varlık" kartı: Gerçek varlığı (nakit - borç) yansıtır.

3. **Harcama Ekleme Modalı (TransactionModal):**
   * Gider girilirken "Ödeme Yöntemi" seçeneği (Varsayılan: `[ 💳 Kredi Kartı ]`, Alternatif: `[ 💵 Nakit / Banka ]`).

4. **Kredi Kartı Borç Ödeme Modalı:**
   * Ödenen tutar, tarih ve açıklama alınır.
   * Kaydedildiğinde kart borcu erir ve nakit bakiyesinden düşülür.

5. **Otomatik Sabit Maaş:**
   * Bir aya geçiş yapıldığında veya ay açıldığında sabit maaş tanımlıysa ve o ayda henüz maaş yoksa otomatik maaş oluşturulur.
