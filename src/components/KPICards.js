/**
 * Finansal KPI Özet Kartları Bileşeni
 */

import { formatCurrency, formatPercent } from '../utils/calculations.js';

/**
 * KPI Kartları HTML şablonunu döner.
 * @param {{
 *   monthlyTotals: { income: number, expense: number, net: number, savingsRate: number },
 *   cumulativeNetWorth: number,
 *   creditCardDebt: number,
 *   activeMonthName: string
 * }} props
 * @returns {string}
 */
export function renderKPICards(props) {
  const { monthlyTotals, cumulativeNetWorth, creditCardDebt = 0, activeMonthName } = props;
  const isNetPositive = monthlyTotals.net >= 0;
  const isNetWorthPositive = cumulativeNetWorth >= 0;
  const hasDebt = creditCardDebt > 0;

  return `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      
      <!-- 1. Aylık Toplam Gelir -->
      <div class="glass-panel-card kpi-gradient-income rounded-2xl p-4 sm:p-5 relative overflow-hidden flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-semibold uppercase tracking-wider text-slate-300">Aylık Gelir</span>
            <div class="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-400/30 shadow-inner flex items-center justify-center backdrop-blur-sm">
              <i data-lucide="arrow-up-right" class="w-4 h-4 text-emerald-400"></i>
            </div>
          </div>
          <div class="mt-2.5">
            <div class="text-xl sm:text-2xl font-bold text-white tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              ${formatCurrency(monthlyTotals.income)}
            </div>
          </div>
        </div>
        <div class="text-[11px] text-emerald-300/90 mt-2 flex items-center gap-1 font-medium">
          <span>${activeMonthName} Gelirleri</span>
        </div>
      </div>

      <!-- 2. Aylık Toplam Gider -->
      <div class="glass-panel-card kpi-gradient-expense rounded-2xl p-4 sm:p-5 relative overflow-hidden flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-semibold uppercase tracking-wider text-slate-300">Aylık Gider</span>
            <div class="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-400/30 shadow-inner flex items-center justify-center backdrop-blur-sm">
              <i data-lucide="arrow-down-right" class="w-4 h-4 text-rose-400"></i>
            </div>
          </div>
          <div class="mt-2.5">
            <div class="text-xl sm:text-2xl font-bold text-white tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              ${formatCurrency(monthlyTotals.expense)}
            </div>
          </div>
        </div>
        <div class="text-[11px] text-rose-300/90 mt-2 flex items-center gap-1 font-medium">
          <span>${activeMonthName} Harcamaları</span>
        </div>
      </div>

      <!-- 3. Kredi Kartı Güncel Borç Durumu -->
      <div class="glass-panel-card kpi-gradient-debt rounded-2xl p-4 sm:p-5 relative overflow-hidden flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-semibold uppercase tracking-wider text-amber-300 flex items-center gap-1">
              <span>Kart Borcu</span>
            </span>
            <div class="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/30 shadow-inner flex items-center justify-center backdrop-blur-sm">
              <i data-lucide="credit-card" class="w-4 h-4 text-amber-400"></i>
            </div>
          </div>
          <div class="mt-2.5">
            <div class="text-xl sm:text-2xl font-bold ${hasDebt ? 'text-amber-300' : 'text-emerald-400'} tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              ${formatCurrency(creditCardDebt)}
            </div>
          </div>
        </div>

        <div class="mt-2 pt-2 border-t border-white/10 flex items-center justify-between gap-1.5 flex-wrap">
          <span class="text-[10px] text-slate-300 font-medium">
            ${hasDebt ? 'Aktif Borç' : 'Borç Yok'}
          </span>
          <div class="flex items-center gap-1.5">
            <button 
              id="btn-kpi-add-interest" 
              class="px-2 py-1 text-[11px] font-bold rounded-lg bg-rose-600/25 hover:bg-rose-600 text-rose-200 hover:text-white border border-rose-400/40 backdrop-blur-sm transition shadow-sm flex items-center gap-1"
              title="Ekstreye yansıyan kart faizini ekleyin"
            >
              <i data-lucide="percent" class="w-3 h-3"></i>
              <span>+ Faiz</span>
            </button>
            <button 
              id="btn-kpi-pay-cc" 
              class="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 transition shadow-md shadow-amber-500/20 border border-amber-300/50 flex items-center gap-1"
              title="Kredi kartı borcunuza ödeme yapın"
            >
              <i data-lucide="corner-down-right" class="w-3 h-3"></i>
              <span>Borç Öde</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 4. Aylık Net Tasarruf / Akış -->
      <div class="glass-panel-card kpi-gradient-net rounded-2xl p-4 sm:p-5 relative overflow-hidden flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-semibold uppercase tracking-wider text-slate-300">Aylık Net Fark</span>
            <div class="w-8 h-8 rounded-xl ${isNetPositive ? 'bg-blue-500/15 border-blue-400/30 text-blue-400' : 'bg-amber-500/15 border-amber-400/30 text-amber-400'} border shadow-inner flex items-center justify-center backdrop-blur-sm">
              <i data-lucide="${isNetPositive ? 'trending-up' : 'trending-down'}" class="w-4 h-4"></i>
            </div>
          </div>
          <div class="mt-2.5">
            <div class="text-xl sm:text-2xl font-bold ${isNetPositive ? 'text-blue-400' : 'text-amber-400'} tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              ${formatCurrency(monthlyTotals.net)}
            </div>
          </div>
        </div>
        <div class="text-[11px] text-slate-300 mt-2 flex items-center gap-1.5 font-medium">
          <span>Tasarruf Oranı:</span>
          <span class="font-bold ${isNetPositive ? 'text-blue-300' : 'text-amber-300'}">
            ${formatPercent(monthlyTotals.savingsRate)}
          </span>
        </div>
      </div>

      <!-- 5. Toplam Kümülatif Net Varlık -->
      <div class="glass-panel-card kpi-gradient-wealth rounded-2xl p-4 sm:p-5 relative overflow-hidden flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-semibold uppercase tracking-wider text-purple-200">Toplam Net Varlık</span>
            <div class="w-8 h-8 rounded-xl bg-purple-500/25 border border-purple-400/40 shadow-inner flex items-center justify-center backdrop-blur-sm">
              <i data-lucide="gem" class="w-4 h-4 text-purple-300"></i>
            </div>
          </div>
          <div class="mt-2.5">
            <div class="text-xl sm:text-2xl font-black ${isNetWorthPositive ? 'text-purple-100' : 'text-rose-300'} tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              ${formatCurrency(cumulativeNetWorth)}
            </div>
          </div>
        </div>
        <div class="text-[11px] text-purple-200/90 mt-2 flex items-center gap-1 font-medium">
          <i data-lucide="layers" class="w-3 h-3"></i>
          <span>Nakit - Kalan Kart Borcu</span>
        </div>
      </div>

    </div>
  `;
}
