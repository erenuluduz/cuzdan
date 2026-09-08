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
      <div class="glass-panel kpi-gradient-income rounded-2xl p-4 sm:p-5 relative overflow-hidden transition duration-200 hover:border-emerald-500/30 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Aylık Gelir</span>
            <div class="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <i data-lucide="arrow-up-right" class="w-3.5 h-3.5 text-emerald-400"></i>
            </div>
          </div>
          <div class="mt-2.5">
            <div class="text-xl sm:text-2xl font-bold text-white tracking-tight">
              ${formatCurrency(monthlyTotals.income)}
            </div>
          </div>
        </div>
        <div class="text-[11px] text-emerald-400/80 mt-2 flex items-center gap-1 font-medium">
          <span>${activeMonthName} Toplamı</span>
        </div>
      </div>

      <!-- 2. Aylık Toplam Gider -->
      <div class="glass-panel kpi-gradient-expense rounded-2xl p-4 sm:p-5 relative overflow-hidden transition duration-200 hover:border-rose-500/30 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Aylık Gider</span>
            <div class="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
              <i data-lucide="arrow-down-right" class="w-3.5 h-3.5 text-rose-400"></i>
            </div>
          </div>
          <div class="mt-2.5">
            <div class="text-xl sm:text-2xl font-bold text-white tracking-tight">
              ${formatCurrency(monthlyTotals.expense)}
            </div>
          </div>
        </div>
        <div class="text-[11px] text-rose-400/80 mt-2 flex items-center gap-1 font-medium">
          <span>${activeMonthName} Harcamaları</span>
        </div>
      </div>

      <!-- 3. Kredi Kartı Güncel Borç Durumu -->
      <div class="glass-panel kpi-gradient-debt rounded-2xl p-4 sm:p-5 relative overflow-hidden transition duration-200 hover:border-amber-500/40 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-semibold uppercase tracking-wider text-amber-300 flex items-center gap-1">
              <span>Kart Borcu</span>
            </span>
            <div class="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <i data-lucide="credit-card" class="w-3.5 h-3.5 text-amber-400"></i>
            </div>
          </div>
          <div class="mt-2.5">
            <div class="text-xl sm:text-2xl font-bold ${hasDebt ? 'text-amber-300' : 'text-emerald-400'} tracking-tight">
              ${formatCurrency(creditCardDebt)}
            </div>
          </div>
        </div>

        <div class="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1.5 flex-wrap">
          <span class="text-[10px] text-slate-400 font-medium">
            ${hasDebt ? 'Aktif Borç' : 'Borç Yok'}
          </span>
          <div class="flex items-center gap-1.5">
            <button 
              id="btn-kpi-add-interest" 
              class="px-2 py-1 text-[11px] font-bold rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 transition shadow-sm flex items-center gap-1"
              title="Ekstreye yansıyan kart faizini ekleyin"
            >
              <i data-lucide="percent" class="w-3 h-3"></i>
              <span>+ Faiz</span>
            </button>
            <button 
              id="btn-kpi-pay-cc" 
              class="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition shadow-sm flex items-center gap-1"
              title="Kredi kartı borcunuza ödeme yapın"
            >
              <i data-lucide="corner-down-right" class="w-3 h-3"></i>
              <span>Borç Öde</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 4. Aylık Net Tasarruf / Akış -->
      <div class="glass-panel kpi-gradient-net rounded-2xl p-4 sm:p-5 relative overflow-hidden transition duration-200 hover:border-blue-500/30 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Aylık Net Fark</span>
            <div class="w-7 h-7 rounded-lg ${isNetPositive ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'} border flex items-center justify-center">
              <i data-lucide="${isNetPositive ? 'trending-up' : 'trending-down'}" class="w-3.5 h-3.5"></i>
            </div>
          </div>
          <div class="mt-2.5">
            <div class="text-xl sm:text-2xl font-bold ${isNetPositive ? 'text-blue-400' : 'text-amber-400'} tracking-tight">
              ${formatCurrency(monthlyTotals.net)}
            </div>
          </div>
        </div>
        <div class="text-[11px] text-slate-400 mt-2 flex items-center gap-1.5 font-medium">
          <span>Tasarruf Oranı:</span>
          <span class="font-bold ${isNetPositive ? 'text-blue-300' : 'text-amber-300'}">
            ${formatPercent(monthlyTotals.savingsRate)}
          </span>
        </div>
      </div>

      <!-- 5. Toplam Kümülatif Net Varlık -->
      <div class="glass-panel kpi-gradient-wealth rounded-2xl p-4 sm:p-5 relative overflow-hidden transition duration-200 hover:border-purple-500/40 shadow-xl shadow-purple-950/20 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-semibold uppercase tracking-wider text-purple-300">Toplam Net Varlık</span>
            <div class="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
              <i data-lucide="gem" class="w-3.5 h-3.5 text-purple-300"></i>
            </div>
          </div>
          <div class="mt-2.5">
            <div class="text-xl sm:text-2xl font-black ${isNetWorthPositive ? 'text-purple-200' : 'text-rose-300'} tracking-tight">
              ${formatCurrency(cumulativeNetWorth)}
            </div>
          </div>
        </div>
        <div class="text-[11px] text-purple-300/80 mt-2 flex items-center gap-1 font-medium">
          <i data-lucide="layers" class="w-3 h-3"></i>
          <span>Nakit - Kalan Kart Borcu</span>
        </div>
      </div>

    </div>
  `;
}
