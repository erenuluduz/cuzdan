/**
 * Bütçe ve Net Varlık Takip Uygulaması
 * Kategori ve Alt Kategori Tanımları, Renk Paleti ve Varsayılanlar
 */

export const DEFAULT_INCOME_CATEGORIES = [
  {
    id: 'income-salary',
    name: 'Maaş',
    type: 'income',
    subcategories: ['Aylık Maaş', 'İkramiye / Prim'],
    color: '#10B981', // Emerald 500
    icon: 'wallet'
  },
  {
    id: 'income-overtime',
    name: 'Mesai',
    type: 'income',
    subcategories: ['Hafta İçi Mesai', 'Hafta Sonu Mesai', 'Resmi Tatil Mesai'],
    color: '#06B6D4', // Cyan 500
    icon: 'clock'
  },
  {
    id: 'income-other',
    name: 'Diğer Gelir',
    type: 'income',
    subcategories: ['Ek İş / Freelance', 'Kira Geliri', 'Hediye / Geri Ödeme'],
    color: '#3B82F6', // Blue 500
    icon: 'arrow-down-circle'
  }
];

export const DEFAULT_EXPENSE_CATEGORIES = [
  {
    id: 'exp-investment',
    name: 'Yatırım',
    type: 'expense',
    subcategories: [
      'Borsa / Hisse Senedi',
      'Altın / Döviz',
      'Bireysel Emeklilik (BES)',
      'Kripto Para',
      'Diğer Yatırımlar'
    ],
    color: '#8B5CF6', // Purple 500
    icon: 'trending-up'
  },
  {
    id: 'exp-bills',
    name: 'Faturalar',
    type: 'expense',
    subcategories: [
      'Su Faturası',
      'Elektrik Faturası',
      'Doğalgaz Faturası',
      'Telefon Faturası',
      'İnternet / TV'
    ],
    color: '#F59E0B', // Amber 500
    icon: 'receipt'
  },
  {
    id: 'exp-market',
    name: 'Market',
    type: 'expense',
    subcategories: [
      'Mecburi Market (Temel Gıda / Temizlik)',
      'Keyfi Market (Atıştırmalık / Özel)',
      'Kişisel Bakım & Hijyen'
    ],
    color: '#EC4899', // Pink 500
    icon: 'shopping-cart'
  },
  {
    id: 'exp-credit-card',
    name: 'Kredi Kartı',
    type: 'expense',
    subcategories: [
      'Ekstre Ödemesi',
      'Taksitli Harcama',
      'Kart Aidatı / Masraf'
    ],
    color: '#EF4444', // Red 500
    icon: 'credit-card'
  },
  {
    id: 'exp-entertainment',
    name: 'Eğlence',
    type: 'expense',
    subcategories: [
      'Yeme-İçme & Kafe',
      'Sinema, Tiyatro & Konser',
      'Dijital Abonelikler (Netflix, Spotify vb.)',
      'Tatil & Gezi',
      'Hobi & Oyun'
    ],
    color: '#14B8A6', // Teal 500
    icon: 'smile'
  },
  {
    id: 'exp-transport',
    name: 'Ulaşım',
    type: 'expense',
    subcategories: [
      'Toplu Taşıma (Akbil / Metro)',
      'Akaryakıt (Benzin / Dizel / LPG)',
      'Taksi & Araç Paylaşımı',
      'Araç Bakım, Sigorta & Muayene'
    ],
    color: '#6366F1', // Indigo 500
    icon: 'navigation'
  }
];

export const ALL_DEFAULT_CATEGORIES = [
  ...DEFAULT_INCOME_CATEGORIES,
  ...DEFAULT_EXPENSE_CATEGORIES
];
