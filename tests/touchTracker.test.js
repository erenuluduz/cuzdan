/**
 * Dokunmatik Yön Kilitleme (TouchDirectionTracker) Birim Testleri
 */
import { TouchDirectionTracker } from '../src/utils/touchTracker.js';

export function runTests() {
  const results = [];
  const assert = (condition, testName) => {
    if (!condition) {
      throw new Error(`TEST FAILED: ${testName}`);
    }
    results.push({ name: testName, status: 'PASSED' });
  };

  const tracker = new TouchDirectionTracker(8);

  // Test 1: Başlangıçta yön tanımsız (null) olmalı
  tracker.start(100, 100);
  assert(tracker.getDirection() === null, 'Başlangıçta yön null olmalı');

  // Test 2: Eşik altındaki küçük titreşimlerde (jitter) yön kilitlenmemeli
  let moveResult = tracker.move(103, 102); // diffX = 3, diffY = 2
  assert(moveResult.direction === null, 'Eşik altındaki mikro hareketlerde yön kilitlenmemeli');
  assert(tracker.getDirection() === null, 'Tracker durumu null kalmalı');

  // Test 3: Yatay hareket baskın olduğunda yön "horizontal" olarak kilitlenmeli
  moveResult = tracker.move(120, 104); // diffX = 20, diffY = 4
  assert(moveResult.direction === 'horizontal', 'Yatay hareket baskın olduğunda yön horizontal olmalı');
  assert(tracker.getDirection() === 'horizontal', 'Tracker yönü horizontal olmalı');

  // Test 4: Yatay kilitlendikten sonra dikey hareket gelse bile yön kilitli kalmalı (Tek seferde tek yön)
  moveResult = tracker.move(122, 180); // diffX = 22, diffY = 80
  assert(moveResult.direction === 'horizontal', 'Yatay kilitlendikten sonra yön horizontal kalmalı');
  assert(tracker.getDirection() === 'horizontal', 'Kilit yatayda sabit kalmalı');

  // Test 5: Reset sonrası sıfırlanmalı
  tracker.reset();
  assert(tracker.getDirection() === null, 'Reset sonrası yön null olmalı');

  // Test 6: Dikey hareket baskın olduğunda yön "vertical" olarak kilitlenmeli
  tracker.start(100, 100);
  moveResult = tracker.move(102, 130); // diffX = 2, diffY = 30
  assert(moveResult.direction === 'vertical', 'Dikey hareket baskın olduğunda yön vertical olmalı');
  assert(tracker.getDirection() === 'vertical', 'Tracker yönü vertical olmalı');

  // Test 7: Dikey kilitlendikten sonra yatay hareket gelse bile yön dikeyde kilitli kalmalı
  moveResult = tracker.move(190, 135); // diffX = 90, diffY = 35
  assert(moveResult.direction === 'vertical', 'Dikey kilitlendikten sonra yön vertical kalmalı');
  assert(tracker.getDirection() === 'vertical', 'Kilit dikeyde sabit kalmalı');

  // Test 8: Köşegenel/diyagonal hareketlerde hafif yatay fark dahi ekseni tek bir yöne kilitlemeli
  tracker.reset();
  tracker.start(50, 50);
  moveResult = tracker.move(65, 60); // diffX = 15, diffY = 10 -> diffX > diffY
  assert(moveResult.direction === 'horizontal', 'Diyagonal harekette daha büyük olan eksen kilitlenmeli (horizontal)');

  return results;
}
