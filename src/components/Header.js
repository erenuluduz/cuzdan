/**
 * Üst Çubuk (Header) - Cüzdanım & Ay Değiştirici & Küre Ayarlar Butonu
 */

import { formatMonthName, getMonthKey } from '../utils/calculations.js';

/**
 * Header HTML şablonunu oluşturur.
 * @param {{
 *   activeMonth: string,
 *   onPrevMonth: Function,
 *   onNextMonth: Function,
 *   onCurrentMonth: Function,
 *   onOpenSettings: Function
 * }} props
 * @returns {string}
 */
export function renderHeader(props) {
  const { activeMonth } = props;
  const currentMonthKey = getMonthKey(new Date());
  const isCurrentMonth = activeMonth === currentMonthKey;
  const monthName = formatMonthName(activeMonth) || 'Ay Seçilmedi';

  return `
    <header class="border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
        
        <!-- Logo & Sade Başlık: Yalnızca Cüzdanım -->
        <div class="flex items-center space-x-2.5 sm:space-x-3">
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
            <i data-lucide="wallet" class="w-5 h-5 text-white"></i>
          </div>
          <h1 class="font-bold text-xl sm:text-2xl text-white tracking-tight">
            Cüzdanım
          </h1>
        </div>

        <!-- Dönem Değiştirici (Ay Seçici) -->
        <div class="flex items-center space-x-1 sm:space-x-2 bg-slate-950/60 p-1 sm:p-1.5 rounded-2xl border border-slate-800/80 shadow-inner">
          <button id="btn-prev-month" title="Önceki Ay" class="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <i data-lucide="chevron-left" class="w-4 h-4"></i>
          </button>
          
          <div class="flex items-center space-x-1.5 px-2 sm:px-3 py-1">
            <i data-lucide="calendar" class="w-3.5 h-3.5 text-purple-400"></i>
            <span class="font-semibold text-xs sm:text-sm text-slate-200 min-w-[95px] sm:min-w-[110px] text-center capitalize">
              ${monthName}
            </span>
          </div>

          <button id="btn-next-month" title="Sonraki Ay" class="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <i data-lucide="chevron-right" class="w-4 h-4"></i>
          </button>

          ${!isCurrentMonth ? `
            <button id="btn-current-month" class="text-[11px] px-2 py-0.5 sm:py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 transition font-medium">
              Bu Ay
            </button>
          ` : ''}
        </div>

        <!-- Sağ Üst: Küre İçinde Çark Ayarlar Butonu -->
        <div class="flex items-center">
          <button id="btn-open-settings" title="Ayarlar" class="sphere-settings-btn group" aria-label="Ayarlar">
            <i data-lucide="settings" class="w-5 h-5 text-purple-300 group-hover:text-white transition-transform duration-500"></i>
          </button>
        </div>

      </div>
    </header>
  `;
}
