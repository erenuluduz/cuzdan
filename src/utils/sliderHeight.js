/**
 * Sekme Kapsayıcı Yüksekliği Hesaplayıcısı (Slider AutoHeight)
 * Özet sekmesinde alttaki boşlukları tamamen yok eder.
 */
export function calculateSliderHeight(activeTab, summaryHeight, analyticsHeight) {
  const sHeight = Math.max(0, Number(summaryHeight) || 0);
  const aHeight = Math.max(0, Number(analyticsHeight) || 0);

  if (activeTab === 'summary') {
    return sHeight;
  } else if (activeTab === 'analytics') {
    return aHeight;
  }
  return Math.max(sHeight, aHeight);
}
