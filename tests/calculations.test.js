/**
 * Finansal Hesaplamalar Birim Testi
 */
import {
  calculateMonthlyTotals,
  calculateCumulativeNetWorth,
  calculateCategoryBreakdown,
  calculateSubcategoryBreakdown,
  calculateCreditCardDebt,
  calculateCashBalance,
  calculateRealNetWorth,
  getMonthKey,
  formatMonthName,
  formatDateTR,
  formatCurrency,
  formatPercent
} from '../src/utils/calculations.js';

export function runTests() {
  const results = [];
  const assert = (condition, testName) => {
    if (!condition) {
      throw new Error(`TEST FAILED: ${testName}`);
    }
    results.push({ name: testName, status: 'PASSED' });
  };

  const sampleTransactions = [
    // 2026-08 Gelir & Gider
    { id: '1', type: 'income', category: 'Maaş', subcategory: 'Aylık Maaş', amount: 40000, monthKey: '2026-08', date: '2026-08-01' },
    { id: '2', type: 'expense', category: 'Faturalar', subcategory: 'Elektrik Faturası', amount: 1000, monthKey: '2026-08', date: '2026-08-05' },
    
    // 2026-09 Gelirler
    { id: '3', type: 'income', category: 'Maaş', subcategory: 'Aylık Maaş', amount: 50000, monthKey: '2026-09', date: '2026-09-01' },
    { id: '4', type: 'income', category: 'Mesai', subcategory: 'Hafta Sonu Mesai', amount: 5000, monthKey: '2026-09', date: '2026-09-15' },

    // 2026-09 Giderler
    { id: '5', type: 'expense', category: 'Faturalar', subcategory: 'Elektrik Faturası', amount: 1200, monthKey: '2026-09', date: '2026-09-02' },
    { id: '6', type: 'expense', category: 'Faturalar', subcategory: 'Su Faturası', amount: 300, monthKey: '2026-09', date: '2026-09-03' },
    { id: '7', type: 'expense', category: 'Market', subcategory: 'Mecburi Market (Temel Gıda / Temizlik)', amount: 6000, monthKey: '2026-09', date: '2026-09-04' },
    { id: '8', type: 'expense', category: 'Market', subcategory: 'Keyfi Market (Atıştırmalık / Özel)', amount: 1500, monthKey: '2026-09', date: '2026-09-10' },
    { id: '9', type: 'expense', category: 'Market', subcategory: 'Kişisel Bakım & Hijyen', amount: 500, monthKey: '2026-09', date: '2026-09-12' },
    { id: '10', type: 'expense', category: 'Yatırım', subcategory: 'Borsa / Hisse Senedi', amount: 10000, monthKey: '2026-09', date: '2026-09-05' },
  ];

  // Test 1: calculateMonthlyTotals for 2026-09
  const septTotals = calculateMonthlyTotals(sampleTransactions, '2026-09');
  assert(septTotals.income === 55000, 'Aylık gelir 55.000 olmalı');
  assert(septTotals.expense === 19500, 'Aylık gider 19.500 olmalı');
  assert(septTotals.net === 35500, 'Aylık net fark (55000 - 19500) = 35.500 olmalı');

  // Test 2: calculateCumulativeNetWorth
  const netWorth = calculateCumulativeNetWorth(sampleTransactions);
  assert(netWorth === 74500, 'Kümülatif Net Varlık 74.500 olmalı');

  // Test 3: calculateCategoryBreakdown for 2026-09
  const breakdown = calculateCategoryBreakdown(sampleTransactions, '2026-09');
  assert(breakdown.length === 3, '2026-09 döneminde 3 gider kategorisi olmalı (Yatırım, Market, Faturalar)');
  
  const yatirim = breakdown.find(b => b.name === 'Yatırım');
  assert(yatirim && yatirim.total === 10000, 'Yatırım toplamı 10.000 olmalı');
  assert(Math.round(yatirim.percentage * 100) / 100 === 51.28, 'Yatırım yüzdesi %51.28 olmalı');

  const market = breakdown.find(b => b.name === 'Market');
  assert(market && market.total === 8000, 'Market toplamı 8.000 olmalı');

  const fatura = breakdown.find(b => b.name === 'Faturalar');
  assert(fatura && fatura.total === 1500, 'Faturalar toplamı 1.500 olmalı');

  // Test 4: calculateSubcategoryBreakdown for Market
  const marketSubs = calculateSubcategoryBreakdown(sampleTransactions, '2026-09', 'Market');
  assert(marketSubs.length === 3, 'Market kategorisinde 3 alt başlık olmalı');
  const mecburi = marketSubs.find(s => s.name.includes('Mecburi'));
  assert(mecburi && mecburi.total === 6000, 'Mecburi market 6.000 olmalı');
  assert(mecburi.percentage === 75, 'Mecburi market alt başlık yüzdesi %75 olmalı');

  // Test 5: Month key utility
  assert(getMonthKey('2026-09-15') === '2026-09', 'Tarihten ay anahtarı doğru çıkarılmalı');

  // ================= KREDİ KARTI VE ÇİFT SAYMAYI ÖNLEME TESTLERİ =================
  const ccScenarioTransactions = [
    // 50.000 TL Maaş
    { id: 'c1', type: 'income', category: 'Maaş', amount: 50000, monthKey: '2026-09', date: '2026-09-01' },
    // 5.000 TL Kredi Kartıyla Market Harcaması
    { id: 'c2', type: 'expense', paymentMethod: 'credit_card', category: 'Market', amount: 5000, monthKey: '2026-09', date: '2026-09-02' },
    // 1.000 TL Nakit Fatura Harcaması
    { id: 'c3', type: 'expense', paymentMethod: 'cash', category: 'Faturalar', amount: 1000, monthKey: '2026-09', date: '2026-09-03' },
    // 20.000 TL Kredi Kartı Borcu Ödemesi (Maaştan karta yatırıldı)
    { id: 'c4', type: 'cc_payment', category: 'Kredi Kartı', amount: 20000, monthKey: '2026-09', date: '2026-09-15' },
  ];

  const initialDebt = 30000; // Geçmişten kalan 30.000 TL kart borcu

  // Test 6: Güncel Kart Borcu Hesabı
  // Borç = 30.000 (başlangıç) + 5.000 (kart harcaması) - 20.000 (ödeme) = 15.000 TL
  const currentDebt = calculateCreditCardDebt(ccScenarioTransactions, initialDebt);
  assert(currentDebt === 15000, 'Güncel kredi kartı borcu 15.000 TL olmalı');

  // Test 7: Kullanılabilir Nakit Bakiyesi Hesabı
  // Nakit = 50.000 (gelir) - 1.000 (nakit harcama) - 20.000 (karta yatırılan) = 29.000 TL
  const cashBalance = calculateCashBalance(ccScenarioTransactions);
  assert(cashBalance === 29000, 'Kullanılabilir nakit bakiyesi 29.000 TL olmalı');

  // Test 8: Gerçek Net Varlık Hesabı (Çift Sayma Engellendi)
  // Net Varlık = Nakit (29.000) - Kalan Borç (15.000) = 14.000 TL
  // Aynı zamanda = 50.000 (gelir) - 6.000 (tüm harcamalar) - 30.000 (eski borç) = 14.000 TL!
  const realNetWorth = calculateRealNetWorth(ccScenarioTransactions, initialDebt);
  assert(realNetWorth === 14000, 'Gerçek Net Varlık (Nakit - Kalan Borç) 14.000 TL olmalı');

  // Test 9: cc_payment işleminin aylık harcamaları şişirmediğinin teyidi
  const ccMonthTotals = calculateMonthlyTotals(ccScenarioTransactions, '2026-09');
  assert(ccMonthTotals.expense === 6000, 'Aylık gider 6.000 TL olmalı (20.000 TL kart ödemesi gider olarak çift sayılmamalı)');

  // Test 10: formatDateTR (Gün.Ay.Yıl formatı)
  assert(formatDateTR('2026-09-12') === '12.09.2026', '2026-09-12 tarihi 12.09.2026 olarak formatlanmalı');
  assert(formatDateTR('2026-01-05') === '05.01.2026', '2026-01-05 tarihi 05.01.2026 olarak formatlanmalı');
  assert(formatDateTR('') === '', 'Boş tarih boş string dönmeli');

  return results;
}
