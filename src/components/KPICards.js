/**
 * Finansal KPI Özet Kartları Bileşeni
 */

import { formatCurrency, formatPercent } from '../utils/calculations.js';

/**
 * KPI Kartları HTML şablonunu döner.
 * @param {{
 *   monthlyTotals: { income: number, expense: number, net: number, savingsRate: number },
 *   cumulativeNetWorth: number,
 *   activeMonthName: string
 * }} props
 * @returns {string}
 */
export function renderKPICards(props) {
  const { monthlyTotals, cumulativeNetWorth, activeMonthName } = props;
  const isNetPositive = monthlyTotals.net >= 0;
  const isNetWorthPositive = cumulativeNetWorth >= 0;

  return `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      <!-- 1. Aylık Toplam Gelir -->
      <div class="glass-panel kpi-gradient-income rounded-2xl p-5 relative overflow-hidden transition duration-200 hover:border-emerald-500/30">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Aylık Gelir</span>
          <div class="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <i data-lucide="arrow-up-right" class="w-4 h-4 text-emerald-400"></i>
          </div>
        </div>
        <div class="mt-3">
          <div class="text-2xl font-bold text-white tracking-tight">
            ${formatCurrency(monthlyTotals.income)}
          </div>
          <div class="text-xs text-emerald-400/80 mt-1 flex items-center gap-1 font-medium">
            <span>${activeMonthName} Toplamı</span>
          </div>
        </div>
      </div>

      <!-- 2. Aylık Toplam Gider -->
      <div class="glass-panel kpi-gradient-expense rounded-2xl p-5 relative overflow-hidden transition duration-200 hover:border-rose-500/30">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Aylık Gider</span>
          <div class="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
            <i data-lucide="arrow-down-right" class="w-4 h-4 text-rose-400"></i>
          </div>
        </div>
        <div class="mt-3">
          <div class="text-2xl font-bold text-white tracking-tight">
            ${formatCurrency(monthlyTotals.expense)}
          </div>
          <div class="text-xs text-rose-400/80 mt-1 flex items-center gap-1 font-medium">
            <span>${activeMonthName} Harcamaları</span>
          </div>
        </div>
      </div>

      <!-- 3. Aylık Net Tasarruf / Akış -->
      <div class="glass-panel kpi-gradient-net rounded-2xl p-5 relative overflow-hidden transition duration-200 hover:border-blue-500/30">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Aylık Net Tasarruf</span>
          <div class="w-8 h-8 rounded-lg ${isNetPositive ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'} border flex items-center justify-center">
            <i data-lucide="${isNetPositive ? 'trending-up' : 'trending-down'}" class="w-4 h-4"></i>
          </div>
        </div>
        <div class="mt-3">
          <div class="text-2xl font-bold ${isNetPositive ? 'text-blue-400' : 'text-amber-400'} tracking-tight">
            ${formatCurrency(monthlyTotals.net)}
          </div>
          <div class="text-xs text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
            <span>Tasarruf Oranı:</span>
            <span class="font-bold ${isNetPositive ? 'text-blue-300' : 'text-amber-300'}">
              ${formatPercent(monthlyTotals.savingsRate)}
            </span>
          </div>
        </div>
      </div>

      <!-- 4. Toplam Kümülatif Net Varlık -->
      <div class="glass-panel kpi-gradient-wealth rounded-2xl p-5 relative overflow-hidden transition duration-200 hover:border-purple-500/40 shadow-xl shadow-purple-950/20">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-purple-300">Toplam Net Varlık</span>
          <div class="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
            <i data-lucide="gem" class="w-4 h-4 text-purple-300"></i>
          </div>
        </div>
        <div class="mt-3">
          <div class="text-2xl font-black ${isNetWorthPositive ? 'text-purple-200' : 'text-rose-300'} tracking-tight">
            ${formatCurrency(cumulativeNetWorth)}
          </div>
          <div class="text-xs text-purple-300/80 mt-1 flex items-center gap-1 font-medium">
            <i data-lucide="layers" class="w-3.5 h-3.5"></i>
            <span>Tüm Zamanlar Kümülatif Birikim</span>
          </div>
        </div>
      </div>

    </div>
  `;
}
