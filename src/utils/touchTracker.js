/**
 * Dokunmatik jest yön kilitleme (Directional Lock) yardımcısı
 * Yatay ve dikey hareketlerin aynı anda gerçekleşmesini (çapraz kaymayı) önler.
 */
export class TouchDirectionTracker {
  constructor(threshold = 8) {
    this.threshold = threshold;
    this.startX = null;
    this.startY = null;
    this.direction = null; // null | 'horizontal' | 'vertical'
  }

  /**
   * Jest başlangıç koordinatlarını kaydeder ve kilidi sıfırlar
   */
  start(x, y) {
    this.startX = x;
    this.startY = y;
    this.direction = null;
  }

  /**
   * Yeni parmak koordinatlarına göre yönü belirler veya kilitli yönü döndürür
   */
  move(currentX, currentY) {
    if (this.startX === null || this.startY === null) {
      return { direction: null, diffX: 0, diffY: 0 };
    }

    const diffX = currentX - this.startX;
    const diffY = currentY - this.startY;
    const absX = Math.abs(diffX);
    const absY = Math.abs(diffY);

    // Henüz yön kilitlenmediyse ve eşik aşıldıysa yönü kilitle
    if (this.direction === null) {
      if (absX > this.threshold || absY > this.threshold) {
        if (absX > absY) {
          this.direction = 'horizontal';
        } else {
          this.direction = 'vertical';
        }
      }
    }

    return {
      direction: this.direction,
      diffX,
      diffY
    };
  }

  /**
   * Geçerli kilitli yönü döndürür ('horizontal', 'vertical' veya null)
   */
  getDirection() {
    return this.direction;
  }

  /**
   * Kilidi ve başlangıç koordinatlarını sıfırlar
   */
  reset() {
    this.startX = null;
    this.startY = null;
    this.direction = null;
  }
}
