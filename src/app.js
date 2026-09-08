/**
 * Ana Uygulama Orkestrasyonu ve Durum Yönetimi (App Controller)
 */

import { ALL_DEFAULT_CATEGORIES } from './constants/categories.js';
import {
  calculateMonthlyTotals,
  calculateCumulativeNetWorth,
  calculateCategoryBreakdown,
  calculateSubcategoryBreakdown,
  calculateCreditCardDebt,
  calculateCashBalance,
  calculateRealNetWorth,
  getMonthKey,
  formatMonthName
} from './utils/calculations.js';
import {
  loadTransactions,
  saveTransactions,
  loadCategories,
  saveCategories,
  loadUserSettings,
  saveUserSettings,
  DEFAULT_USER_SETTINGS,
  loadActiveMonth,
  saveActiveMonth,
  exportBackupJSON,
  parseAndValidateBackup
} from './utils/storage.js';

import { renderHeader } from './components/Header.js';
import { renderKPICards } from './components/KPICards.js';
import { renderExpenseChartHTML, initExpenseChart } from './components/ExpenseChart.js';
import { renderTransactionTables } from './components/TransactionTables.js';
import { renderTransactionModal } from './components/TransactionModal.js';
import { renderCategoryModal } from './components/CategoryModal.js';
import { renderSettingsModal } from './components/SettingsModal.js';
import { renderCCPaymentModal } from './components/CCPaymentModal.js';
import { renderCCInterestModal } from './components/CCInterestModal.js';

// Uygulama Durumu (State)
const state = {
  transactions: [],
  categories: [],
  settings: { ...DEFAULT_USER_SETTINGS },
  activeMonth: getMonthKey(new Date()),
  drillDownCategory: null,
  modal: {
    isOpen: false,
    type: 'expense', // 'income' | 'expense'
    editingTransaction: null,
    preselectedCategory: null
  },
  isCategoryModalOpen: false,
  isSettingsModalOpen: false,
  isCCPaymentModalOpen: false,
  isCCInterestModalOpen: false
};

/**
 * Uygulamayı başlatır
 */
function initApp() {
  state.transactions = loadTransactions();
  state.categories = loadCategories();
  state.settings = loadUserSettings();
  state.activeMonth = loadActiveMonth(getMonthKey(new Date()));

  // Test veya demo tohum verileri varsa tamamen temizle
  if (state.transactions.some(t => String(t.id).startsWith('seed-'))) {
    state.transactions = state.transactions.filter(t => !String(t.id).startsWith('seed-'));
    saveTransactions(state.transactions);
  }

  // Aktif ay için sabit maaş kuralını kontrol et
  ensureFixedSalaryForMonth(state.activeMonth);

  renderApp();
  setupGlobalEvents();
}

/**
 * Eğer kullanıcı sabit maaş tanımlamışsa ve ilgili ayda henüz maaş yoksa otomatik ekler.
 * @param {string} monthKey 'YYYY-MM'
 */
function ensureFixedSalaryForMonth(monthKey) {
  if (!state.settings || !state.settings.fixedSalaryAmount || state.settings.fixedSalaryAmount <= 0) {
    return;
  }

  const hasSalary = state.transactions.some(
    t => t.type === 'income' && t.category === 'Maaş' && t.monthKey === monthKey
  );

  if (!hasSalary) {
    const day = String(state.settings.salaryDayOfMonth || 1).padStart(2, '0');
    const autoSalary = {
      id: 'fixed_sal_' + monthKey,
      type: 'income',
      category: 'Maaş',
      subcategory: 'Aylık Maaş',
      amount: Number(state.settings.fixedSalaryAmount),
      date: `${monthKey}-${day}`,
      monthKey: monthKey,
      description: 'Otomatik Sabit Maaş',
      createdAt: Date.now()
    };
    state.transactions.unshift(autoSalary);
    saveTransactions(state.transactions);
  }
}

/**
 * Ana Arayüzü Çizer (Main Render Loop)
 */
function renderApp() {
  const appContainer = document.getElementById('app');
  if (!appContainer) return;

  const activeMonthName = formatMonthName(state.activeMonth);
  const monthlyTotals = calculateMonthlyTotals(state.transactions, state.activeMonth);
  const creditCardDebt = calculateCreditCardDebt(state.transactions, state.settings.initialCreditCardDebt);
  const cumulativeNetWorth = calculateCumulativeNetWorth(state.transactions, state.settings.initialCreditCardDebt);

  const categoriesBreakdown = calculateCategoryBreakdown(
    state.transactions,
    state.activeMonth,
    state.categories
  );

  const subcategoriesBreakdown = state.drillDownCategory
    ? calculateSubcategoryBreakdown(state.transactions, state.activeMonth, state.drillDownCategory)
    : [];

  const incomeTransactions = state.transactions
    .filter(t => t.type === 'income' && t.monthKey === state.activeMonth)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const expenseTransactions = state.transactions
    .filter(t => t.type === 'expense' && t.monthKey === state.activeMonth)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // Ana Sayfa Şablonu
  appContainer.innerHTML = `
    ${renderHeader({ activeMonth: state.activeMonth })}

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1 w-full">
      <!-- 1. KPI Kartları (5 Kolon) -->
      ${renderKPICards({
        monthlyTotals,
        cumulativeNetWorth,
        creditCardDebt,
        activeMonthName
      })}

      <!-- 2. Harcama Pasta Grafiği & Yüzdesel Dağılım -->
      ${renderExpenseChartHTML({
        drillDownCategory: state.drillDownCategory,
        categoriesBreakdown,
        subcategoriesBreakdown,
        totalExpense: monthlyTotals.expense
      })}

      <!-- 3. İki Kolonlu Gelir ve Gider Tabloları -->
      ${renderTransactionTables({
        incomeTransactions,
        expenseTransactions,
        categories: state.categories,
        activeMonthName
      })}
    </main>

    <!-- Footer -->
    <footer class="border-t border-slate-800/80 py-4 text-center text-xs text-slate-500">
      <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>Bütçe ve Net Varlık Takip Programı • Verileriniz tarayıcınızda güvendedir</span>
        <span class="text-purple-400 font-medium">Toplam İşlem Sayısı: ${state.transactions.length}</span>
      </div>
    </footer>
  `;

  // Lucide İkonlarını Başlat
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Pasta Grafiğini Çiz (Chart.js)
  initExpenseChart({
    categoriesBreakdown,
    subcategoriesBreakdown,
    drillDownCategory: state.drillDownCategory,
    onSelectCategory: (categoryName) => {
      state.drillDownCategory = categoryName;
      renderApp();
    }
  });

  // Modal Render
  renderModals();

  // Etkinlik Dinleyicilerini Bağla
  attachAppListeners();
}

/**
 * Modalların çizimi
 */
function renderModals() {
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return;

  if (state.modal.isOpen) {
    modalRoot.innerHTML = renderTransactionModal({
      type: state.modal.type,
      categories: state.categories,
      activeMonth: state.activeMonth,
      editingTransaction: state.modal.editingTransaction,
      preselectedCategory: state.modal.preselectedCategory
    });
    attachTransactionModalListeners();
  } else if (state.isCategoryModalOpen) {
    modalRoot.innerHTML = renderCategoryModal({
      categories: state.categories
    });
    attachCategoryModalListeners();
  } else if (state.isSettingsModalOpen) {
    modalRoot.innerHTML = renderSettingsModal({
      settings: state.settings
    });
    attachSettingsModalListeners();
  } else if (state.isCCPaymentModalOpen) {
    const currentDebt = calculateCreditCardDebt(state.transactions, state.settings.initialCreditCardDebt);
    modalRoot.innerHTML = renderCCPaymentModal({
      currentDebt,
      activeMonth: state.activeMonth
    });
    attachCCPaymentModalListeners();
  } else if (state.isCCInterestModalOpen) {
    modalRoot.innerHTML = renderCCInterestModal({
      activeMonth: state.activeMonth
    });
    attachCCInterestModalListeners();
  } else {
    modalRoot.innerHTML = '';
  }

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

/**
 * Global Olay Dinleyicileri
 */
function setupGlobalEvents() {
  const fileInput = document.getElementById('backup-file-input');
  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
        const result = parseAndValidateBackup(content);
        if (result.valid) {
          if (confirm(`Yedek dosyasında ${result.transactions.length} işlem bulundu. Mevcut kayıtların üzerine yazılsın mı?`)) {
            state.transactions = result.transactions;
            state.categories = result.categories;
            if (result.settings) {
              state.settings = result.settings;
              saveUserSettings(state.settings);
            }
            saveTransactions(state.transactions);
            saveCategories(state.categories);
            renderApp();
            alert('Yedek başarıyla geri yüklendi!');
          }
        } else {
          alert('Geçersiz yedek dosyası: ' + result.error);
        }
        fileInput.value = '';
      };
      reader.readAsText(file);
    });
  }
}

/**
 * Sayfa İçi Dinleyicileri Bağlama
 */
function attachAppListeners() {
  // Ay Değiştirme
  document.getElementById('btn-prev-month')?.addEventListener('click', () => changeMonth(-1));
  document.getElementById('btn-next-month')?.addEventListener('click', () => changeMonth(1));
  document.getElementById('btn-current-month')?.addEventListener('click', () => {
    state.activeMonth = getMonthKey(new Date());
    state.drillDownCategory = null;
    saveActiveMonth(state.activeMonth);
    ensureFixedSalaryForMonth(state.activeMonth);
    renderApp();
  });

  // Header Aksiyonları
  document.getElementById('btn-add-income')?.addEventListener('click', () => openTransactionModal('income'));
  document.getElementById('btn-add-expense')?.addEventListener('click', () => openTransactionModal('expense'));
  document.getElementById('btn-manage-categories')?.addEventListener('click', () => {
    state.isCategoryModalOpen = true;
    renderModals();
  });
  document.getElementById('btn-open-settings')?.addEventListener('click', () => {
    state.isSettingsModalOpen = true;
    renderModals();
  });
  document.getElementById('btn-kpi-pay-cc')?.addEventListener('click', () => {
    state.isCCPaymentModalOpen = true;
    renderModals();
  });
  document.getElementById('btn-kpi-add-interest')?.addEventListener('click', () => {
    state.isCCInterestModalOpen = true;
    renderModals();
  });
  document.getElementById('btn-export-backup')?.addEventListener('click', () => {
    exportBackupJSON(state.transactions, state.categories, state.settings);
  });
  document.getElementById('btn-import-backup')?.addEventListener('click', () => {
    document.getElementById('backup-file-input')?.click();
  });
  document.getElementById('btn-clear-all')?.addEventListener('click', () => {
    if (confirm('Tüm gelir ve gider kayıtlarını sıfırlamak istediğinize emin misiniz? Bu işlem geri alınamaz.')) {
      state.transactions = [];
      saveTransactions([]);
      state.drillDownCategory = null;
      renderApp();
    }
  });

  // Hızlı Ekleme Butonları
  document.getElementById('btn-add-salary-quick')?.addEventListener('click', () => openTransactionModal('income', 'Maaş'));
  document.getElementById('btn-add-overtime-quick')?.addEventListener('click', () => openTransactionModal('income', 'Mesai'));
  document.getElementById('btn-add-other-income-quick')?.addEventListener('click', () => openTransactionModal('income', 'Diğer Gelir'));

  document.querySelectorAll('.btn-quick-add-income').forEach(b => {
    b.addEventListener('click', () => openTransactionModal('income'));
  });
  document.querySelectorAll('.btn-quick-add-expense').forEach(b => {
    b.addEventListener('click', () => openTransactionModal('expense'));
  });

  // Grafik Drill-Down Geri Butonu
  document.getElementById('btn-chart-back')?.addEventListener('click', () => {
    state.drillDownCategory = null;
    renderApp();
  });

  // Grafik Lejant Satırına Tıklama (Alt başlık kırılımını açar)
  document.querySelectorAll('.chart-item-row').forEach(row => {
    row.addEventListener('click', () => {
      const cat = row.getAttribute('data-category');
      if (!state.drillDownCategory && cat) {
        state.drillDownCategory = cat;
        renderApp();
      }
    });
  });

  // İşlem Düzenleme & Silme
  document.querySelectorAll('.btn-edit-transaction').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      const item = state.transactions.find(t => t.id === id);
      if (item) {
        state.modal = {
          isOpen: true,
          type: item.type,
          editingTransaction: item,
          preselectedCategory: item.category
        };
        renderModals();
      }
    });
  });

  document.querySelectorAll('.btn-delete-transaction').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      const item = state.transactions.find(t => t.id === id);
      if (item && confirm(`"${item.category} (${item.amount} TL)" işlemini silmek istediğinize emin misiniz?`)) {
        state.transactions = state.transactions.filter(t => t.id !== id);
        saveTransactions(state.transactions);
        renderApp();
      }
    });
  });
}

/**
 * Ay Değiştirici (+1 veya -1)
 */
function changeMonth(delta) {
  const [yearStr, monthStr] = state.activeMonth.split('-');
  let year = parseInt(yearStr, 10);
  let month = parseInt(monthStr, 10) + delta;

  if (month > 12) {
    month = 1;
    year += 1;
  } else if (month < 1) {
    month = 12;
    year -= 1;
  }

  state.activeMonth = `${year}-${String(month).padStart(2, '0')}`;
  state.drillDownCategory = null;
  saveActiveMonth(state.activeMonth);
  ensureFixedSalaryForMonth(state.activeMonth);
  renderApp();
}

/**
 * İşlem Modalı Aç
 */
function openTransactionModal(type = 'expense', preselectedCategory = null) {
  state.modal = {
    isOpen: true,
    type,
    editingTransaction: null,
    preselectedCategory
  };
  renderModals();
}

/**
 * İşlem Modalı Dinleyicileri
 */
function attachTransactionModalListeners() {
  const closeBtn = document.getElementById('modal-close-btn');
  const cancelBtn = document.getElementById('modal-cancel-btn');
  const overlay = document.getElementById('transaction-modal-overlay');
  const form = document.getElementById('transaction-form');
  const catSelect = document.getElementById('trans-category');
  const subcatSelect = document.getElementById('trans-subcategory');
  const incomeTabBtn = document.getElementById('tab-income-btn');
  const expenseTabBtn = document.getElementById('tab-expense-btn');

  const closeModal = () => {
    state.modal = { isOpen: false, type: 'expense', editingTransaction: null, preselectedCategory: null };
    renderModals();
  };

  closeBtn?.addEventListener('click', closeModal);
  cancelBtn?.addEventListener('click', closeModal);
  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // Tip Değiştirici Sekmeler
  incomeTabBtn?.addEventListener('click', () => {
    state.modal.type = 'income';
    renderModals();
  });
  expenseTabBtn?.addEventListener('click', () => {
    state.modal.type = 'expense';
    renderModals();
  });

  // Kategori değiştiğinde alt kategorileri dinamik güncelle
  catSelect?.addEventListener('change', () => {
    const selectedCatName = catSelect.value;
    const catObj = state.categories.find(c => c.name === selectedCatName);
    const subs = catObj?.subcategories || [];

    if (subcatSelect) {
      subcatSelect.innerHTML = subs.map(s => `<option value="${s}">${s}</option>`).join('');
    }
  });

  // Form Gönderimi (Ekle / Güncelle)
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const transType = document.getElementById('trans-type').value;
    const amount = parseFloat(document.getElementById('trans-amount').value);
    const category = document.getElementById('trans-category').value;
    const subcategory = document.getElementById('trans-subcategory')?.value || '';
    const date = document.getElementById('trans-date').value;
    const description = document.getElementById('trans-description').value.trim();
    const monthKey = getMonthKey(date);

    // Giderler için ödeme yöntemi
    let paymentMethod = undefined;
    if (transType === 'expense') {
      paymentMethod = document.querySelector('input[name="payment-method-radio"]:checked')?.value || 'credit_card';
    }

    if (isNaN(amount) || amount <= 0) {
      alert('Lütfen geçerli bir pozitif tutar girin.');
      return;
    }

    if (!category || !date) {
      alert('Lütfen zorunlu alanları doldurun.');
      return;
    }

    if (state.modal.editingTransaction) {
      // Güncelleme
      const id = state.modal.editingTransaction.id;
      state.transactions = state.transactions.map(t => {
        if (t.id === id) {
          return {
            ...t,
            type: transType,
            paymentMethod,
            category,
            subcategory,
            amount,
            date,
            monthKey,
            description
          };
        }
        return t;
      });
    } else {
      // Yeni Ekleme
      const newTransaction = {
        id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        type: transType,
        paymentMethod,
        category,
        subcategory,
        amount,
        date,
        monthKey,
        description,
        createdAt: Date.now()
      };
      state.transactions.unshift(newTransaction);
    }

    state.activeMonth = monthKey;
    saveTransactions(state.transactions);
    saveActiveMonth(state.activeMonth);

    closeModal();
    renderApp();
  });
}

/**
 * Kategori Modalı Dinleyicileri
 */
function attachCategoryModalListeners() {
  const closeBtn = document.getElementById('category-modal-close');
  const doneBtn = document.getElementById('category-modal-done-btn');
  const overlay = document.getElementById('category-modal-overlay');
  const addCatForm = document.getElementById('add-category-form');
  const addSubcatForm = document.getElementById('add-subcategory-form');

  const closeCategoryModal = () => {
    state.isCategoryModalOpen = false;
    renderModals();
    renderApp();
  };

  closeBtn?.addEventListener('click', closeCategoryModal);
  doneBtn?.addEventListener('click', closeCategoryModal);
  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) closeCategoryModal();
  });

  addCatForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('new-cat-name').value.trim();
    const type = document.getElementById('new-cat-type').value;
    const color = document.getElementById('new-cat-color').value;

    if (!name) return;

    if (state.categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
      alert('Bu isimde bir kategori zaten mevcut!');
      return;
    }

    const newCategory = {
      id: 'cat_' + Date.now(),
      name,
      type,
      subcategories: ['Genel'],
      color
    };

    state.categories.push(newCategory);
    saveCategories(state.categories);
    renderModals();
  });

  addSubcatForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const parentName = document.getElementById('subcat-parent-name').value;
    const subName = document.getElementById('new-subcat-name').value.trim();

    if (!parentName || !subName) return;

    state.categories = state.categories.map(c => {
      if (c.name === parentName) {
        const subs = c.subcategories || [];
        if (!subs.includes(subName)) {
          return { ...c, subcategories: [...subs, subName] };
        }
      }
      return c;
    });

    saveCategories(state.categories);
    renderModals();
  });
}

/**
 * Finansal Ayarlar Modalı Dinleyicileri
 */
function attachSettingsModalListeners() {
  const closeBtn = document.getElementById('settings-modal-close');
  const cancelBtn = document.getElementById('settings-cancel-btn');
  const overlay = document.getElementById('settings-modal-overlay');
  const form = document.getElementById('settings-form');

  const closeSettingsModal = () => {
    state.isSettingsModalOpen = false;
    renderModals();
  };

  closeBtn?.addEventListener('click', closeSettingsModal);
  cancelBtn?.addEventListener('click', closeSettingsModal);
  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) closeSettingsModal();
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const initialCreditCardDebt = parseFloat(document.getElementById('setting-cc-debt').value) || 0;
    const fixedSalaryAmount = parseFloat(document.getElementById('setting-fixed-salary').value) || 0;
    const salaryDayOfMonth = parseInt(document.getElementById('setting-salary-day').value, 10) || 1;

    state.settings = {
      initialCreditCardDebt,
      fixedSalaryAmount,
      salaryDayOfMonth: Math.min(31, Math.max(1, salaryDayOfMonth))
    };

    saveUserSettings(state.settings);
    ensureFixedSalaryForMonth(state.activeMonth);
    closeSettingsModal();
    renderApp();
  });
}

/**
 * Kredi Kartı Borç Ödeme Modalı Dinleyicileri
 */
function attachCCPaymentModalListeners() {
  const closeBtn = document.getElementById('cc-modal-close');
  const cancelBtn = document.getElementById('cc-modal-cancel');
  const overlay = document.getElementById('cc-payment-modal-overlay');
  const form = document.getElementById('cc-payment-form');

  const closeCCModal = () => {
    state.isCCPaymentModalOpen = false;
    renderModals();
  };

  closeBtn?.addEventListener('click', closeCCModal);
  cancelBtn?.addEventListener('click', closeCCModal);
  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) closeCCModal();
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const amount = parseFloat(document.getElementById('cc-payment-amount').value);
    const date = document.getElementById('cc-payment-date').value;
    const description = document.getElementById('cc-payment-description').value.trim() || 'Kredi Kartı Borç Ödemesi';
    const monthKey = getMonthKey(date);

    if (isNaN(amount) || amount <= 0) {
      alert('Lütfen geçerli bir pozitif ödeme tutarı girin.');
      return;
    }

    const paymentTx = {
      id: 'cc_pay_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      type: 'cc_payment',
      category: 'Kredi Kartı',
      amount,
      date,
      monthKey,
      description,
      createdAt: Date.now()
    };

    state.transactions.unshift(paymentTx);
    saveTransactions(state.transactions);

    closeCCModal();
    renderApp();
  });
}

/**
 * Kredi Kartı Faizi Ekleme Modalı Dinleyicileri
 */
function attachCCInterestModalListeners() {
  const closeBtn = document.getElementById('cc-interest-modal-close');
  const cancelBtn = document.getElementById('cc-interest-modal-cancel');
  const overlay = document.getElementById('cc-interest-modal-overlay');
  const form = document.getElementById('cc-interest-form');

  const closeInterestModal = () => {
    state.isCCInterestModalOpen = false;
    renderModals();
  };

  closeBtn?.addEventListener('click', closeInterestModal);
  cancelBtn?.addEventListener('click', closeInterestModal);
  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) closeInterestModal();
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const amount = parseFloat(document.getElementById('cc-interest-amount').value);
    const date = document.getElementById('cc-interest-date').value;
    const description = document.getElementById('cc-interest-description').value.trim() || 'Kredi Kartı Ekstre Faizi & Vergiler';
    const monthKey = getMonthKey(date);

    if (isNaN(amount) || amount <= 0) {
      alert('Lütfen geçerli bir pozitif faiz tutarı girin.');
      return;
    }

    const interestTx = {
      id: 'cc_int_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      type: 'expense',
      paymentMethod: 'credit_card',
      category: 'Kredi Kartı',
      subcategory: 'Kart Faizi & Masraflar',
      amount,
      date,
      monthKey,
      description,
      createdAt: Date.now()
    };

    state.transactions.unshift(interestTx);
    saveTransactions(state.transactions);

    closeInterestModal();
    renderApp();
  });
}

// Uygulamayı Başlat
document.addEventListener('DOMContentLoaded', initApp);
