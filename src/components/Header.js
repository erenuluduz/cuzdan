/**
 * Üst Çubuk (Header) & Ay Değiştirici Bileşeni
 */

import { formatMonthName, getMonthKey } from '../utils/calculations.js';

/**
 * Header HTML şablonunu oluşturur.
 * @param {{
 *   activeMonth: string,
 *   onPrevMonth: Function,
 *   onNextMonth: Function,
 *   onCurrentMonth: Function,
 *   onOpenIncomeModal: Function,
 *   onOpenExpenseModal: Function,
 *   onOpenCategoryModal: Function,
 *   onExportBackup: Function,
 *   onImportBackup: Function
 * }} props
 * @returns {string}
 */
export function renderHeader(props) {
  const { activeMonth } = props;
  const currentMonthKey = getMonthKey(new Date());
  const isCurrentMonth = activeMonth === currentMonthKey;
  const monthName = formatMonthName(activeMonth) || 'Ay Seçilmedi';

  return `
    <header class="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        
        <!-- Logo & Başlık -->
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <i data-lucide="wallet-cards" class="w-5 h-5 text-white"></i>
          </div>
          <div>
            <h1 class="font-bold text-lg text-white tracking-tight flex items-center gap-2">
              Bütçe & Net Varlık
              <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">v1.0</span>
            </h1>
            <p class="text-xs text-slate-400">Kişisel Finans ve Harcama Takibi</p>
          </div>
        </div>

        <!-- Dönem Değiştirici (Ay Seçici) -->
        <div class="flex items-center space-x-2 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800">
          <button id="btn-prev-month" title="Önceki Ay" class="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <i data-lucide="chevron-left" class="w-4 h-4"></i>
          </button>
          
          <div class="flex items-center space-x-2 px-3 py-1">
            <i data-lucide="calendar" class="w-4 h-4 text-purple-400"></i>
            <span class="font-semibold text-sm text-slate-200 min-w-[110px] text-center capitalize">
              ${monthName}
            </span>
          </div>

          <button id="btn-next-month" title="Sonraki Ay" class="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <i data-lucide="chevron-right" class="w-4 h-4"></i>
          </button>

          ${!isCurrentMonth ? `
            <button id="btn-current-month" class="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 transition font-medium ml-1">
              Bu Ay
            </button>
          ` : ''}
        </div>

        <!-- Aksiyon Butonları -->
        <div class="flex items-center flex-wrap gap-2">
          <!-- Yedek Menüsü -->
          <button id="btn-export-backup" title="Verileri JSON olarak yedekle" class="px-3 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition flex items-center gap-1.5">
            <i data-lucide="download" class="w-3.5 h-3.5"></i>
            <span>Yedek Al</span>
          </button>
          
          <button id="btn-import-backup" title="JSON yedeği geri yükle" class="px-3 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition flex items-center gap-1.5">
            <i data-lucide="upload" class="w-3.5 h-3.5"></i>
            <span>Yükle</span>
          </button>

          <button id="btn-manage-categories" title="Kategori ve Alt Başlıkları Yönet" class="px-3 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition flex items-center gap-1.5">
            <i data-lucide="tag" class="w-3.5 h-3.5"></i>
            <span>Kategoriler</span>
          </button>

          <button id="btn-open-settings" title="Finansal Ayarlar (Kart Borcu & Sabit Maaş)" class="px-3 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-purple-300 hover:text-white border border-purple-500/30 transition flex items-center gap-1.5">
            <i data-lucide="settings" class="w-3.5 h-3.5 text-purple-400"></i>
            <span>Ayarlar</span>
          </button>

          <button id="btn-clear-all" title="Tüm İşlem Kayıtlarını Sıfırla" class="px-2.5 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-rose-900/30 text-slate-400 hover:text-rose-300 border border-slate-700/60 transition flex items-center gap-1.5">
            <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>
            <span>Sıfırla</span>
          </button>

          <!-- Gelir Ekle -->
          <button id="btn-add-income" class="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 transition flex items-center gap-1.5">
            <i data-lucide="plus-circle" class="w-4 h-4"></i>
            <span>+ Gelir</span>
          </button>

          <!-- Gider Ekle -->
          <button id="btn-add-expense" class="px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20 transition flex items-center gap-1.5">
            <i data-lucide="minus-circle" class="w-4 h-4"></i>
            <span>- Gider</span>
          </button>
        </div>

      </div>
    </header>
  `;
}
