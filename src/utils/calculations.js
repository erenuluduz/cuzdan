/**
 * Bütçe ve Finansal Hesaplama Fonksiyonları
 */

/**
 * Sayıyı Türk Lirası para birimi formatına dönüştürür.
 * @param {number} amount
 * @returns {string} Örn: "₺12.450,00"
 */
export function formatCurrency(amount) {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
}

/**
 * Sayıyı yüzde formatına dönüştürür.
 * @param {number} value
 * @returns {string} Örn: "%34,2"
 */
export function formatPercent(value) {
  const num = Number(value) || 0;
  return `%${num.toLocaleString('tr-TR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`;
}

/**
 * Belirli bir ay için toplam gelir, toplam gider ve net tasarruf farkını hesaplar.
 * @param {Array} transactions 
 * @param {string} monthKey 'YYYY-MM'
 * @returns {{ income: number, expense: number, net: number, savingsRate: number }}
 */
export function calculateMonthlyTotals(transactions = [], monthKey = '') {
  const filtered = monthKey 
    ? transactions.filter(t => t.monthKey === monthKey)
    : transactions;

  let income = 0;
  let expense = 0;

  for (const item of filtered) {
    const amount = Number(item.amount) || 0;
    if (item.type === 'income') {
      income += amount;
    } else if (item.type === 'expense') {
      expense += amount;
    }
  }

  const net = income - expense;
  const savingsRate = income > 0 ? (net / income) * 100 : 0;

  return {
    income,
    expense,
    net,
    savingsRate
  };
}

/**
 * Sisteme girilmiş tüm zamanların kümülatif net varlığını hesaplar.
 * Eğer başlangıç kart borcu varsa bunu da düşer.
 * @param {Array} transactions
 * @param {number} initialDebt
 * @returns {number}
 */
export function calculateCumulativeNetWorth(transactions = [], initialDebt = 0) {
  return calculateRealNetWorth(transactions, initialDebt);
}

/**
 * Güncel Kredi Kartı Borcunu hesaplar.
 * Borç = Başlangıç Borcu + Kredi Kartıyla Yapılan Harcamalar - Kart Borcuna Yapılan Ödemeler
 * @param {Array} transactions 
 * @param {number} initialDebt 
 * @returns {number}
 */
export function calculateCreditCardDebt(transactions = [], initialDebt = 0) {
  let debt = Number(initialDebt) || 0;

  for (const item of transactions) {
    const amount = Number(item.amount) || 0;
    if (item.type === 'expense' && item.paymentMethod !== 'cash') {
      // paymentMethod === 'credit_card' veya belirtilmemişse varsayılan karttır
      debt += amount;
    } else if (item.type === 'cc_payment') {
      debt -= amount;
    }
  }

  return Math.max(0, debt); // Borç negatif olamaz (fazla ödeme hariç)
}

/**
 * Kullanıcının elindeki kullanılabilir net nakit/banka bakiyesini hesaplar.
 * Nakit = Toplam Gelirler - Nakit Harcamalar - Karta Yapılan Ödemeler
 * @param {Array} transactions 
 * @returns {number}
 */
export function calculateCashBalance(transactions = []) {
  let balance = 0;

  for (const item of transactions) {
    const amount = Number(item.amount) || 0;
    if (item.type === 'income') {
      balance += amount;
    } else if (item.type === 'expense' && item.paymentMethod === 'cash') {
      balance -= amount;
    } else if (item.type === 'cc_payment') {
      balance -= amount;
    }
  }

  return balance;
}

/**
 * Gerçek Net Varlık Hesabı (Kullanılabilir Nakit - Kalan Kredi Kartı Borcu).
 * Bu formül çift saymayı %100 önler ve geçmiş birikmiş borcu da hesaba katar.
 * @param {Array} transactions 
 * @param {number} initialDebt 
 * @returns {number}
 */
export function calculateRealNetWorth(transactions = [], initialDebt = 0) {
  let totalIncome = 0;
  let totalExpenses = 0;

  for (const item of transactions) {
    const amount = Number(item.amount) || 0;
    if (item.type === 'income') {
      totalIncome += amount;
    } else if (item.type === 'expense') {
      totalExpenses += amount;
    }
    // cc_payment burada tekrar düşülmez çünkü borç transferidir
  }

  return totalIncome - totalExpenses - (Number(initialDebt) || 0);
}

/**
 * Belirtilen ay için harcamaların ana kategori bazında yüzdesel ve tutarsal dağılımını hesaplar.
 * @param {Array} transactions 
 * @param {string} monthKey 
 * @param {Array} categoryDefinitions 
 * @returns {Array<{ name: string, total: number, percentage: number, color: string, count: number }>}
 */
export function calculateCategoryBreakdown(transactions = [], monthKey = '', categoryDefinitions = []) {
  const filtered = transactions.filter(t => 
    t.type === 'expense' && (!monthKey || t.monthKey === monthKey)
  );

  const totalExpense = filtered.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  if (totalExpense === 0) return [];

  const map = new Map();

  for (const item of filtered) {
    const catName = item.category || 'Diğer';
    const amount = Number(item.amount) || 0;
    
    if (!map.has(catName)) {
      const def = categoryDefinitions.find(c => c.name === catName);
      map.set(catName, {
        name: catName,
        total: 0,
        count: 0,
        color: def?.color || '#94A3B8'
      });
    }

    const catObj = map.get(catName);
    catObj.total += amount;
    catObj.count += 1;
  }

  const result = Array.from(map.values()).map(cat => ({
    ...cat,
    percentage: (cat.total / totalExpense) * 100
  }));

  // Tutara göre azalan sırala
  return result.sort((a, b) => b.total - a.total);
}

/**
 * Belirtilen ay ve seçili ana kategori için harcamaların alt kategori dağılımını hesaplar.
 * @param {Array} transactions 
 * @param {string} monthKey 
 * @param {string} categoryName 
 * @returns {Array<{ name: string, total: number, percentage: number, count: number }>}
 */
export function calculateSubcategoryBreakdown(transactions = [], monthKey = '', categoryName = '') {
  if (!categoryName) return [];

  const filtered = transactions.filter(t => 
    t.type === 'expense' && 
    t.category === categoryName &&
    (!monthKey || t.monthKey === monthKey)
  );

  const categoryTotal = filtered.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  if (categoryTotal === 0) return [];

  const map = new Map();

  for (const item of filtered) {
    const subName = item.subcategory || 'Genel / Belirtilmemiş';
    const amount = Number(item.amount) || 0;

    if (!map.has(subName)) {
      map.set(subName, {
        name: subName,
        total: 0,
        count: 0
      });
    }

    const subObj = map.get(subName);
    subObj.total += amount;
    subObj.count += 1;
  }

  const result = Array.from(map.values()).map(sub => ({
    ...sub,
    percentage: (sub.total / categoryTotal) * 100
  }));

  return result.sort((a, b) => b.total - a.total);
}

/**
 * Ay anahtarı (YYYY-MM) oluşturur veya tarih stringinden ay anahtarını döner.
 * @param {Date|string} date 
 * @returns {string} Örn: '2026-09'
 */
export function getMonthKey(date = new Date()) {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  }
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * YYYY-MM formatındaki ay anahtarını Türkçe okunabilir metne dönüştürür.
 * @param {string} monthKey '2026-09'
 * @returns {string} Örn: 'Eylül 2026'
 */
export function formatMonthName(monthKey) {
  if (!monthKey || !monthKey.includes('-')) return '';
  const [year, month] = monthKey.split('-');
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
}

/**
 * YYYY-MM-DD veya Date nesnesini Gün.Ay.Yıl (GG.AA.YYYY) sıralamasına dönüştürür.
 * @param {string|Date} dateStr Örn: '2026-09-12'
 * @returns {string} Örn: '12.09.2026'
 */
export function formatDateTR(dateStr) {
  if (!dateStr) return '';
  if (typeof dateStr === 'string' && dateStr.includes('-')) {
    const parts = dateStr.trim().split('T')[0].split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day.padStart(2, '0')}.${month.padStart(2, '0')}.${year}`;
    }
  }
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return String(dateStr);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}
