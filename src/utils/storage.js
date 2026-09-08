/**
 * Yerel Depolama (LocalStorage) ve Yedekleme (JSON Export/Import) Yardımcısı
 */

import { ALL_DEFAULT_CATEGORIES } from '../constants/categories.js';

const STORAGE_KEYS = {
  TRANSACTIONS: 'budget_transactions_v1',
  CATEGORIES: 'budget_categories_v1',
  ACTIVE_MONTH: 'budget_active_month_v1',
  SETTINGS: 'budget_settings_v1'
};

export const DEFAULT_USER_SETTINGS = {
  initialCreditCardDebt: 0,
  fixedSalaryAmount: 0,
  salaryDayOfMonth: 1
};

/**
 * Kullanıcı ayarlarını localStorage'dan çeker.
 * @returns {{ initialCreditCardDebt: number, fixedSalaryAmount: number, salaryDayOfMonth: number }}
 */
export function loadUserSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return { ...DEFAULT_USER_SETTINGS };
    const parsed = JSON.parse(raw);
    return {
      initialCreditCardDebt: Number(parsed.initialCreditCardDebt) || 0,
      fixedSalaryAmount: Number(parsed.fixedSalaryAmount) || 0,
      salaryDayOfMonth: Number(parsed.salaryDayOfMonth) || 1
    };
  } catch (err) {
    console.error('Ayarlar yüklenirken hata:', err);
    return { ...DEFAULT_USER_SETTINGS };
  }
}

/**
 * Kullanıcı ayarlarını kaydeder.
 * @param {Object} settings 
 */
export function saveUserSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Ayarlar kaydedilirken hata:', err);
  }
}

/**
 * Kayıtlı işlemleri localStorage'dan çeker.
 * @returns {Array}
 */
export function loadTransactions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('İşlemler yüklenirken hata:', err);
    return [];
  }
}

/**
 * İşlem listesini localStorage'a kaydeder.
 * @param {Array} transactions 
 */
export function saveTransactions(transactions) {
  try {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  } catch (err) {
    console.error('İşlemler kaydedilirken hata:', err);
  }
}

/**
 * Kayıtlı kategorileri localStorage'dan çeker.
 * Eğer henüz kayıt yoksa varsayılan kategorileri döner.
 * @returns {Array}
 */
export function loadCategories() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (!raw) return ALL_DEFAULT_CATEGORIES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : ALL_DEFAULT_CATEGORIES;
  } catch (err) {
    console.error('Kategoriler yüklenirken hata:', err);
    return ALL_DEFAULT_CATEGORIES;
  }
}

/**
 * Kategori listesini localStorage'a kaydeder.
 * @param {Array} categories 
 */
export function saveCategories(categories) {
  try {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  } catch (err) {
    console.error('Kategoriler kaydedilirken hata:', err);
  }
}

/**
 * Son seçili ayı kaydeder ve okur.
 */
export function loadActiveMonth(fallback) {
  return localStorage.getItem(STORAGE_KEYS.ACTIVE_MONTH) || fallback;
}

export function saveActiveMonth(monthKey) {
  localStorage.setItem(STORAGE_KEYS.ACTIVE_MONTH, monthKey);
}

/**
 * Tüm verileri JSON dosyası olarak indirir.
 * @param {Array} transactions 
 * @param {Array} categories 
 */
export function exportBackupJSON(transactions, categories, settings = null) {
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    appName: 'GelirGiderButceTakip',
    transactions: transactions || [],
    categories: categories || [],
    settings: settings || loadUserSettings()
  };

  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const today = new Date().toISOString().split('T')[0];
  const a = document.createElement('a');
  a.href = url;
  a.download = `butce_takip_yedek_${today}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * JSON yedek dosya içeriğini doğrular ve ayrıştırır.
 * @param {string} jsonString 
 * @returns {{ valid: boolean, transactions?: Array, categories?: Array, settings?: Object, error?: string }}
 */
export function parseAndValidateBackup(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object') {
      return { valid: false, error: 'Geçersiz JSON formatı.' };
    }

    if (!Array.isArray(parsed.transactions)) {
      return { valid: false, error: 'Yedek dosyasında işlem (transactions) listesi bulunamadı.' };
    }

    return {
      valid: true,
      transactions: parsed.transactions,
      categories: Array.isArray(parsed.categories) ? parsed.categories : ALL_DEFAULT_CATEGORIES,
      settings: parsed.settings || DEFAULT_USER_SETTINGS
    };
  } catch (err) {
    return { valid: false, error: 'Dosya okuma hatası: ' + err.message };
  }
}
