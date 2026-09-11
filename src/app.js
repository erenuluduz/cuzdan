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
import { TouchDirectionTracker } from './utils/touchTracker.js';
import { calculateSliderHeight } from './utils/sliderHeight.js';

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
  activeTab: 'summary', // 'summary' | 'analytics'
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

  const isSummaryTab = state.activeTab === 'summary';
  const currentMonthKey = getMonthKey(new Date());
  const isCurrentMonth = state.activeMonth === currentMonthKey;

  // Ana Sayfa Şablonu
  appContainer.innerHTML = `
    ${renderHeader()}

    <!-- Sabit ve Ortalanmış Ay Seçici Kapsülü (Sticky Header-Below) -->
    <div class="sticky top-[64px] z-20 py-2.5 px-4 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/40 flex justify-center">
      <div class="flex items-center space-x-1 sm:space-x-2 bg-slate-900/95 p-1 sm:p-1.5 rounded-2xl border border-slate-700/70 shadow-lg shadow-black/40">
        <button id="btn-prev-month" title="Önceki Ay" class="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition">
          <i data-lucide="chevron-left" class="w-4 h-4"></i>
        </button>
        
        <div class="flex items-center space-x-1.5 px-2 sm:px-3 py-1">
          <i data-lucide="calendar" class="w-3.5 h-3.5 text-purple-400"></i>
          <span class="font-bold text-xs sm:text-sm text-slate-100 min-w-[100px] sm:min-w-[115px] text-center capitalize">
            ${activeMonthName}
          </span>
        </div>

        <button id="btn-next-month" title="Sonraki Ay" class="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition">
          <i data-lucide="chevron-right" class="w-4 h-4"></i>
        </button>

        ${!isCurrentMonth ? `
          <button id="btn-current-month" class="text-[11px] px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 transition font-semibold ml-1">
            Bu Ay
          </button>
        ` : ''}
      </div>
    </div>

    <main class="max-w-7xl mx-auto pb-24 flex-1 w-full overflow-hidden">
      <!-- İki Sekmeli Kaydırılabilir Alan (Tabs Slider) -->
      <div id="tabs-slider" class="flex items-start transition-transform duration-300 ease-out w-[200%] overflow-hidden" style="transform: translateX(${isSummaryTab ? '0%' : '-50%'});">
        
        <!-- 1. SEKME: ÖZET -->
        <div id="tab-pane-summary" class="w-1/2 px-4 sm:px-6 lg:px-8 py-4 space-y-6">
          <!-- KPI Kartları (5 Kolon) -->
          ${renderKPICards({
            monthlyTotals,
            cumulativeNetWorth,
            creditCardDebt,
            activeMonthName
          })}
        </div>

        <!-- 2. SEKME: ANALİZ & TABLOLAR -->
        <div id="tab-pane-analytics" class="w-1/2 px-4 sm:px-6 lg:px-8 py-4 space-y-6">
          <!-- Harcama Pasta Grafiği & Yüzdesel Dağılım -->
          ${renderExpenseChartHTML({
            drillDownCategory: state.drillDownCategory,
            categoriesBreakdown,
            subcategoriesBreakdown,
            totalExpense: monthlyTotals.expense
          })}

          <!-- İki Kolonlu Gelir ve Gider Tabloları -->
          ${renderTransactionTables({
            incomeTransactions,
            expenseTransactions,
            categories: state.categories,
            activeMonthName
          })}
        </div>

      </div>
    </main>

    <!-- Ekrandan Bağımsız Sabit '+' Küre Buton (Floating Action Button - FAB) -->
    <button id="btn-fab-add" title="Yeni İşlem Ekle" class="fixed bottom-[78px] right-5 z-40 w-14 h-14 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 shadow-2xl shadow-purple-600/40 text-white flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-all border border-white/20">
      <i data-lucide="plus" class="w-7 h-7"></i>
    </button>

    <!-- Sabit Alt Gezinme Çubuğu (Bottom Navigation Bar) -->
    <nav class="fixed bottom-0 inset-x-0 z-40 bg-slate-900/90 backdrop-blur-xl border-t border-slate-800/80 px-6 py-2.5 pb-[max(0.6rem,env(safe-area-inset-bottom))] flex items-center justify-around shadow-2xl">
      <button id="nav-tab-summary" class="flex flex-col items-center gap-1 py-1 px-6 rounded-2xl transition ${isSummaryTab ? 'text-purple-400 font-bold bg-purple-500/10 shadow-sm' : 'text-slate-400 hover:text-slate-200'}">
        <i data-lucide="layout-grid" class="w-5 h-5"></i>
        <span class="text-[11px]">Özet</span>
      </button>
      <button id="nav-tab-analytics" class="flex flex-col items-center gap-1 py-1 px-6 rounded-2xl transition ${!isSummaryTab ? 'text-purple-400 font-bold bg-purple-500/10 shadow-sm' : 'text-slate-400 hover:text-slate-200'}">
        <i data-lucide="pie-chart" class="w-5 h-5"></i>
        <span class="text-[11px]">Analiz & Tablolar</span>
      </button>
    </nav>
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

  // Sekme Yüksekliğini Aktif Sekmeye Göre Dinamik Olarak Güncelle
  window.requestAnimationFrame(() => {
    updateSliderHeight();
  });
}

/**
 * Sekme Kapsayıcısının Yüksekliğini Aktif Sekmeye Göre Dinamik Olarak Günceller
 * (Özet sekmesinde altta gereksiz devasa boşluk kalmasını engeller)
 */
function updateSliderHeight(tabName = state.activeTab) {
  const slider = document.getElementById('tabs-slider');
  const summaryPane = document.getElementById('tab-pane-summary');
  const analyticsPane = document.getElementById('tab-pane-analytics');
  if (!slider || !summaryPane || !analyticsPane) return;

  const sHeight = Math.ceil(summaryPane.offsetHeight || summaryPane.getBoundingClientRect().height);
  const aHeight = Math.ceil(analyticsPane.offsetHeight || analyticsPane.getBoundingClientRect().height);
  const targetHeight = calculateSliderHeight(tabName, sHeight, aHeight);

  if (targetHeight > 0) {
    slider.style.height = `${targetHeight}px`;
  }
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
 * Global Olay Dinleyicileri (Dosya yükleme, Dokunmatik Kaydırma ve Dinamik Parıltı)
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

  // Parmakla Sağa / Sola Kaydırarak Canlı Sekme Takibi & Eksen Kilitleme (Directional Lock)
  const touchTracker = new TouchDirectionTracker(8);
  let initialTranslate = 0;

  window.addEventListener('touchstart', (e) => {
    const isModalOpen = state.modal.isOpen || state.isCategoryModalOpen || state.isSettingsModalOpen || state.isCCPaymentModalOpen || state.isCCInterestModalOpen;
    if (isModalOpen || !e.touches || e.touches.length !== 1) {
      touchTracker.reset();
      return;
    }

    touchTracker.start(e.touches[0].clientX, e.touches[0].clientY);
    initialTranslate = state.activeTab === 'summary' ? 0 : -50;
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!e.touches || e.touches.length !== 1) return;
    const moveResult = touchTracker.move(e.touches[0].clientX, e.touches[0].clientY);
    if (!moveResult) return;

    if (moveResult.direction === 'horizontal') {
      // Yön yatay kilitlendiğinde dikey sayfa kaydırmasını (çapraz hareketi) engelle
      if (e.cancelable) {
        e.preventDefault();
      }

      const slider = document.getElementById('tabs-slider');
      if (slider) {
        slider.style.transition = 'none'; // Parmakla anında milimetrik hareket et

        // Sürükleme anında iki sekmenin içeriği de kırpılmasın diye yüksekliği genişlet
        const summaryPane = document.getElementById('tab-pane-summary');
        const analyticsPane = document.getElementById('tab-pane-analytics');
        if (summaryPane && analyticsPane) {
          const maxDragH = calculateSliderHeight('dragging', summaryPane.offsetHeight, analyticsPane.offsetHeight);
          if (maxDragH > 0) slider.style.height = `${maxDragH}px`;
        }

        const dragPercent = (moveResult.diffX / window.innerWidth) * 50;
        let targetPercent = initialTranslate + dragPercent;
        // Uç sınırlarda elastik direnç
        if (targetPercent > 0) targetPercent = targetPercent * 0.2;
        if (targetPercent < -50) targetPercent = -50 + (targetPercent - (-50)) * 0.2;
        slider.style.transform = `translateX(${targetPercent}%)`;
      }
    } else if (moveResult.direction === 'vertical') {
      // Yön dikey kilitlendiğinde yatay sekme kaydırmasını engelle, doğal dikey kaydırmaya bırak
      return;
    }
  }, { passive: false });

  const handleTouchEndOrCancel = (e) => {
    const lockedDirection = touchTracker.getDirection();
    const startX = touchTracker.startX;

    if (lockedDirection === 'horizontal' && startX !== null && e.changedTouches && e.changedTouches.length > 0) {
      const touchEndX = e.changedTouches[0].clientX;
      const diffX = touchEndX - startX;
      const threshold = window.innerWidth * 0.16; // Ekranın %16'sı kadar çekilmiş olması yeterli

      if (diffX < -threshold && state.activeTab === 'summary') {
        switchTab('analytics');
      } else if (diffX > threshold && state.activeTab === 'analytics') {
        switchTab('summary');
      } else {
        // Eski konumuna yaylanarak geri dön
        switchTab(state.activeTab);
      }
    } else {
      updateSliderHeight();
    }
    touchTracker.reset();
  };

  window.addEventListener('touchend', handleTouchEndOrCancel, { passive: true });
  window.addEventListener('touchcancel', handleTouchEndOrCancel, { passive: true });

  // Ekran Yeniden Boyutlandırıldığında Sekme Yüksekliğini Güncelle
  window.addEventListener('resize', () => {
    updateSliderHeight();
  });
  window.addEventListener('orientationchange', () => {
    setTimeout(updateSliderHeight, 150);
  });

  // Ekran Kaydırıldıkça Camsı Kartların Renklerinin Dinamik Parıldaması (rAF Throttled Scroll Glow)
  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const scrollPercent = Math.min(scrollY / 300, 1);
        const glowX = 100 - Math.sin(scrollY * 0.012) * 45;
        const glowY = Math.cos(scrollY * 0.012) * 35;
        const blur = 16 + scrollPercent * 8;

        document.documentElement.style.setProperty('--scroll-glow-x', `${glowX}%`);
        document.documentElement.style.setProperty('--scroll-glow-y', `${glowY}%`);
        document.documentElement.style.setProperty('--scroll-blur', `${blur}px`);
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });
}

/**
 * Sekmeler Arası Geçiş Yardımcısı (Apple Spring Yaylanma Animasyonu & Dinamik Yükseklik)
 */
function switchTab(tabName) {
  state.activeTab = tabName;
  const slider = document.getElementById('tabs-slider');
  if (slider) {
    slider.style.transition = 'transform 420ms cubic-bezier(0.16, 1, 0.3, 1), height 420ms cubic-bezier(0.16, 1, 0.3, 1)';
    slider.style.transform = tabName === 'summary' ? 'translateX(0%)' : 'translateX(-50%)';
    updateSliderHeight(tabName);
  }

  // Özet sekmesine dönüldüyse ve sayfa aşağıda kaldıysa tepeye yumuşak kaydır
  if (tabName === 'summary' && window.scrollY > 80) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  const navSummary = document.getElementById('nav-tab-summary');
  const navAnalytics = document.getElementById('nav-tab-analytics');
  if (navSummary && navAnalytics) {
    if (tabName === 'summary') {
      navSummary.className = 'flex flex-col items-center gap-1 py-1 px-6 rounded-2xl transition text-purple-400 font-bold bg-purple-500/10 shadow-sm';
      navAnalytics.className = 'flex flex-col items-center gap-1 py-1 px-6 rounded-2xl transition text-slate-400 hover:text-slate-200';
    } else {
      navSummary.className = 'flex flex-col items-center gap-1 py-1 px-6 rounded-2xl transition text-slate-400 hover:text-slate-200';
      navAnalytics.className = 'flex flex-col items-center gap-1 py-1 px-6 rounded-2xl transition text-purple-400 font-bold bg-purple-500/10 shadow-sm';
    }
  }
}

/**
 * Sayfa İçi Dinleyicileri Bağlama
 */
function attachAppListeners() {
  // Sekme Butonları
  document.getElementById('nav-tab-summary')?.addEventListener('click', () => switchTab('summary'));
  document.getElementById('nav-tab-analytics')?.addEventListener('click', () => switchTab('analytics'));

  // Sabit '+' Küre Butonu (FAB)
  document.getElementById('btn-fab-add')?.addEventListener('click', () => openTransactionModal('expense'));

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

  // Küre Ayarlar Butonu
  document.getElementById('btn-open-settings')?.addEventListener('click', () => {
    state.isSettingsModalOpen = true;
    renderModals();
  });

  // KPI Kartı Aksiyonları
  document.getElementById('btn-kpi-pay-cc')?.addEventListener('click', () => {
    state.isCCPaymentModalOpen = true;
    renderModals();
  });
  document.getElementById('btn-kpi-add-interest')?.addEventListener('click', () => {
    state.isCCInterestModalOpen = true;
    renderModals();
  });

  // Hızlı Ekleme Butonları (Tablo İçi)
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

  // Kategori & Alt Başlık Dropdown Kontrolü
  let lastValidCategory = catSelect?.value !== '__NEW_CATEGORY__' ? catSelect?.value : (state.categories.find(c => c.type === state.modal.type)?.name || '');
  let lastValidSubcategory = subcatSelect?.value !== '__NEW_SUBCATEGORY__' ? subcatSelect?.value : 'Genel';

  const catBox = document.getElementById('inline-category-box');
  const catInput = document.getElementById('inline-category-input');
  const saveCatBtn = document.getElementById('btn-save-inline-category');
  const cancelCatBtn = document.getElementById('btn-cancel-inline-category');

  const subcatBox = document.getElementById('inline-subcategory-box');
  const subcatInput = document.getElementById('inline-subcategory-input');
  const saveSubcatBtn = document.getElementById('btn-save-inline-subcategory');
  const cancelSubcatBtn = document.getElementById('btn-cancel-inline-subcategory');

  // Kategori Seçimi Değiştiğinde
  catSelect?.addEventListener('change', () => {
    if (catSelect.value === '__NEW_CATEGORY__') {
      catBox?.classList.remove('hidden');
      if (catInput) {
        catInput.value = '';
        catInput.focus();
      }
      return;
    }

    lastValidCategory = catSelect.value;
    catBox?.classList.add('hidden');

    const selectedCatName = catSelect.value;
    const catObj = state.categories.find(c => c.name === selectedCatName);
    const subs = catObj?.subcategories || ['Genel'];

    if (subcatSelect) {
      subcatSelect.innerHTML = `
        ${subs.map(s => `<option value="${s}">${s}</option>`).join('')}
        <option disabled>──────────</option>
        <option value="__NEW_SUBCATEGORY__" class="font-bold text-purple-400">➕ + Yeni Alt Başlık Ekle...</option>
      `;
      lastValidSubcategory = subs[0] || 'Genel';
    }
  });

  cancelCatBtn?.addEventListener('click', () => {
    catBox?.classList.add('hidden');
    if (catSelect && lastValidCategory) {
      catSelect.value = lastValidCategory;
    }
  });

  saveCatBtn?.addEventListener('click', () => {
    const newName = catInput?.value.trim();
    if (!newName) return;
    const transType = document.getElementById('trans-type')?.value || 'expense';

    let cat = state.categories.find(c => c.name.toLowerCase() === newName.toLowerCase() && c.type === transType);
    if (!cat) {
      cat = {
        name: newName,
        type: transType,
        color: transType === 'income' ? '#10B981' : '#8B5CF6',
        subcategories: ['Genel']
      };
      state.categories.push(cat);
      saveCategories(state.categories);
    }

    if (catSelect) {
      const availableCategories = state.categories.filter(c => c.type === transType);
      catSelect.innerHTML = `
        ${availableCategories.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}
        <option disabled>──────────</option>
        <option value="__NEW_CATEGORY__" class="font-bold text-purple-400">➕ + Yeni Kategori Ekle...</option>
      `;
      catSelect.value = cat.name;
      lastValidCategory = cat.name;

      if (subcatSelect) {
        subcatSelect.innerHTML = `
          <option value="Genel">Genel</option>
          <option disabled>──────────</option>
          <option value="__NEW_SUBCATEGORY__" class="font-bold text-purple-400">➕ + Yeni Alt Başlık Ekle...</option>
        `;
        subcatSelect.value = 'Genel';
        lastValidSubcategory = 'Genel';
      }
    }
    catBox?.classList.add('hidden');
    if (catInput) catInput.value = '';
  });

  // Alt Başlık Seçimi Değiştiğinde
  subcatSelect?.addEventListener('change', () => {
    if (subcatSelect.value === '__NEW_SUBCATEGORY__') {
      subcatBox?.classList.remove('hidden');
      if (subcatInput) {
        subcatInput.value = '';
        subcatInput.focus();
      }
      return;
    }
    lastValidSubcategory = subcatSelect.value;
    subcatBox?.classList.add('hidden');
  });

  cancelSubcatBtn?.addEventListener('click', () => {
    subcatBox?.classList.add('hidden');
    if (subcatSelect && lastValidSubcategory) {
      subcatSelect.value = lastValidSubcategory;
    }
  });

  saveSubcatBtn?.addEventListener('click', () => {
    const newSubName = subcatInput?.value.trim();
    if (!newSubName) return;
    const currentCatName = catSelect?.value;
    const cat = state.categories.find(c => c.name === currentCatName);
    if (cat) {
      if (!cat.subcategories.includes(newSubName)) {
        cat.subcategories.push(newSubName);
        saveCategories(state.categories);
      }
      if (subcatSelect) {
        subcatSelect.innerHTML = `
          ${cat.subcategories.map(s => `<option value="${s}">${s}</option>`).join('')}
          <option disabled>──────────</option>
          <option value="__NEW_SUBCATEGORY__" class="font-bold text-purple-400">➕ + Yeni Alt Başlık Ekle...</option>
        `;
        subcatSelect.value = newSubName;
        lastValidSubcategory = newSubName;
      }
    }
    subcatBox?.classList.add('hidden');
    if (subcatInput) subcatInput.value = '';
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

    if (category === '__NEW_CATEGORY__' || subcategory === '__NEW_SUBCATEGORY__') {
      alert('Lütfen geçerli bir kategori veya alt başlık seçin ya da kutudan yeni bir isim ekleyin.');
      return;
    }

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

  // Taşınan Veri & Yedekleme Butonları
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
      closeSettingsModal();
      renderApp();
    }
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
