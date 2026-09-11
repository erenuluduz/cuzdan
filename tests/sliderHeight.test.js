/**
 * Sekme Kapsayıcı Yüksekliği (Slider Height / No Blank Space) Birim Testleri
 */
import { calculateSliderHeight } from '../src/utils/sliderHeight.js';

export function runTests() {
  const results = [];
  const assert = (condition, testName) => {
    if (!condition) {
      throw new Error(`TEST FAILED: ${testName}`);
    }
    results.push({ name: testName, status: 'PASSED' });
  };

  // Test 1: Özet sekmesindeyken yükseklik kesinlikle özet sekmesinin boyutu kadar olmalı
  const summaryH = 650;
  const analyticsH = 1900;
  const h1 = calculateSliderHeight('summary', summaryH, analyticsH);
  assert(h1 === 650, 'Özet sekmesinde yükseklik sadece özet içeriği (650px) kadar olmalı');

  // Test 2: Analiz sekmesindeyken yükseklik tabloları içeren analiz sekmesinin boyutu kadar olmalı
  const h2 = calculateSliderHeight('analytics', summaryH, analyticsH);
  assert(h2 === 1900, 'Analiz sekmesinde yükseklik analiz içeriği (1900px) kadar olmalı');

  // Test 3: Sürükleme veya genel durumda maksimum yükseklik alınabilmeli
  const h3 = calculateSliderHeight('dragging', summaryH, analyticsH);
  assert(h3 === 1900, 'Sürükleme anında maksimum yükseklik (1900px) sağlanmalı');

  // Test 4: Sıfır veya geçersiz girdilerde güvenli fallback (0) dönmeli
  assert(calculateSliderHeight('summary', 0, 1000) === 0, 'Sıfır yükseklikte 0 dönmeli');
  assert(calculateSliderHeight('summary', null, undefined) === 0, 'Null/undefined girdilerde 0 dönmeli');

  return results;
}
