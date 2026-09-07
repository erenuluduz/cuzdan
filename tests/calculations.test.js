/**
 * Finansal Hesaplamalar Birim Testi
 */
import {
  calculateMonthlyTotals,
  calculateCumulativeNetWorth,
  calculateCategoryBreakdown,
  calculateSubcategoryBreakdown,
  getMonthKey,
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
  // Toplam Gider: 1200 + 300 + 6000 + 1500 + 500 + 10000 = 19500
  assert(septTotals.expense === 19500, 'Aylık gider 19.500 olmalı');
  assert(septTotals.net === 35500, 'Aylık net fark (55000 - 19500) = 35.500 olmalı');

  // Test 2: calculateCumulativeNetWorth
  // Total Income: 40000 + 55000 = 95000
  // Total Expense: 1000 + 19500 = 20500
  // Cumulative Net Worth: 95000 - 20500 = 74500
  const netWorth = calculateCumulativeNetWorth(sampleTransactions);
  assert(netWorth === 74500, 'Kümülatif Net Varlık 74.500 olmalı');

  // Test 3: calculateCategoryBreakdown for 2026-09
  const breakdown = calculateCategoryBreakdown(sampleTransactions, '2026-09');
  assert(breakdown.length === 3, '2026-09 döneminde 3 gider kategorisi olmalı (Yatırım, Market, Faturalar)');
  
  // Yatırım: 10000 / 19500 = ~51.28%
  const yatirim = breakdown.find(b => b.name === 'Yatırım');
  assert(yatirim && yatirim.total === 10000, 'Yatırım toplamı 10.000 olmalı');
  assert(Math.round(yatirim.percentage * 100) / 100 === 51.28, 'Yatırım yüzdesi %51.28 olmalı');

  // Market: 8000 / 19500 = ~41.03%
  const market = breakdown.find(b => b.name === 'Market');
  assert(market && market.total === 8000, 'Market toplamı 8.000 olmalı');

  // Faturalar: 1500 / 19500 = ~7.69%
  const fatura = breakdown.find(b => b.name === 'Faturalar');
  assert(fatura && fatura.total === 1500, 'Faturalar toplamı 1.500 olmalı');

  // Test 4: calculateSubcategoryBreakdown for Market
  const marketSubs = calculateSubcategoryBreakdown(sampleTransactions, '2026-09', 'Market');
  assert(marketSubs.length === 3, 'Market kategorisinde 3 alt başlık olmalı');
  const mecburi = marketSubs.find(s => s.name.includes('Mecburi'));
  assert(mecburi && mecburi.total === 6000, 'Mecburi market 6.000 olmalı');
  // 6000 / 8000 = 75%
  assert(mecburi.percentage === 75, 'Mecburi market alt başlık yüzdesi %75 olmalı');

  // Test 5: Month key utility
  assert(getMonthKey('2026-09-15') === '2026-09', 'Tarihten ay anahtarı doğru çıkarılmalı');

  return results;
}
