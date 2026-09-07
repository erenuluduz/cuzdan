/**
 * Ana Uygulama Orkestrasyonu ve Durum Yönetimi (App Controller)
 */

import { ALL_DEFAULT_CATEGORIES } from './constants/categories.js';
import {
  calculateMonthlyTotals,
  calculateCumulativeNetWorth,
  calculateCategoryBreakdown,
  calculateSubcategoryBreakdown,
  getMonthKey,
  formatMonthName
} from './utils/calculations.js';
import {
  loadTransactions,
  saveTransactions,
  loadCategories,
  saveCategories,
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

// Uygulama Durumu (State)
const state = {
  transactions: [],
  categories: [],
  activeMonth: getMonthKey(new Date()),
  drillDownCategory: null,
  modal: {
    isOpen: false,
    type: 'expense', // 'income' | 'expense'
    editingTransaction: null
  },
  isCategoryModalOpen: false
};

/**
 * Uygulamayı başlatır
 */
function initApp() {
  state.transactions = loadTransactions();
  state.categories = loadCategories();
  state.activeMonth = loadActiveMonth(getMonthKey(new Date()));

  // Test veya demo tohum verileri varsa tamamen temizle
  if (state.transactions.some(t => String(t.id).startsWith('seed-'))) {
    state.transactions = state.transactions.filter(t => !String(t.id).startsWith('seed-'));
    saveTransactions(state.transactions);
  }

  renderApp();
  setupGlobalEvents();
}

/**
 * Ana Arayüzü Çizer (Main Render Loop)
 */
function renderApp() {
  const appContainer = document.getElementById('app');
  if (!appContainer) return;

  const activeMonthName = formatMonthName(state.activeMonth);
  const monthlyTotals = calculateMonthlyTotals(state.transactions, state.activeMonth);
  const cumulativeNetWorth = calculateCumulativeNetWorth(state.transactions);

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
      <!-- 1. KPI Kartları -->
      ${renderKPICards({
        monthlyTotals,
        cumulativeNetWorth,
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
      editingTransaction: state.modal.editingTransaction
    });
    attachTransactionModalListeners();
  } else if (state.isCategoryModalOpen) {
    modalRoot.innerHTML = renderCategoryModal({
      categories: state.categories
    });
    attachCategoryModalListeners();
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
    renderApp();
  });

  // Header Aksiyonları
  document.getElementById('btn-add-income')?.addEventListener('click', () => openTransactionModal('income'));
  document.getElementById('btn-add-expense')?.addEventListener('click', () => openTransactionModal('expense'));
  document.getElementById('btn-manage-categories')?.addEventListener('click', () => {
    state.isCategoryModalOpen = true;
    renderModals();
  });
  document.getElementById('btn-export-backup')?.addEventListener('click', () => {
    exportBackupJSON(state.transactions, state.categories);
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

  // Hızlı Ekleme Butonları (Boş tablodaki butonlar)
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
          editingTransaction: item
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
  state.drillDownCategory = null; // Ay değiştiğinde kategori filtresini sıfırla
  saveActiveMonth(state.activeMonth);
  renderApp();
}

/**
 * İşlem Modalı Aç
 */
function openTransactionModal(type = 'expense') {
  state.modal = {
    isOpen: true,
    type,
    editingTransaction: null
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
    state.modal = { isOpen: false, type: 'expense', editingTransaction: null };
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

    // Aktif ayı eklenen işlemin ayına güncelle ki kullanıcı hemen görsün
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
    renderApp(); // Güncellenen kategorilerle ana ekranı yenile
  };

  closeBtn?.addEventListener('click', closeCategoryModal);
  doneBtn?.addEventListener('click', closeCategoryModal);
  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) closeCategoryModal();
  });

  // Yeni Ana Kategori Ekle
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

  // Yeni Alt Kategori Ekle
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

// Uygulamayı Başlat
document.addEventListener('DOMContentLoaded', initApp);
