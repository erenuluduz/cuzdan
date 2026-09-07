/**
 * İnteraktif Harcama Pasta/Halka Grafiği (Pie / Donut Chart) ve Alt Kategori Kırılımı (Drill-Down)
 */

import {
  calculateCategoryBreakdown,
  calculateSubcategoryBreakdown,
  formatCurrency,
  formatPercent
} from '../utils/calculations.js';

let chartInstance = null;

/**
 * Pasta Grafiği Kartının HTML şablonunu oluşturur.
 * @param {{
 *   drillDownCategory: string|null,
 *   categoriesBreakdown: Array,
 *   subcategoriesBreakdown: Array,
 *   totalExpense: number
 * }} props
 * @returns {string}
 */
export function renderExpenseChartHTML(props) {
  const { drillDownCategory, categoriesBreakdown, subcategoriesBreakdown, totalExpense } = props;
  const isDrillDown = Boolean(drillDownCategory);
  const dataList = isDrillDown ? subcategoriesBreakdown : categoriesBreakdown;
  const hasData = totalExpense > 0 && dataList.length > 0;

  return `
    <div class="glass-panel rounded-2xl p-5 relative">
      
      <!-- Başlık ve Kontroller -->
      <div class="flex items-center justify-between flex-wrap gap-2 mb-4">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
            <i data-lucide="pie-chart" class="w-4 h-4 text-pink-400"></i>
          </div>
          <div>
            <h3 class="font-bold text-slate-100 text-sm flex items-center gap-2">
              Harcama Dağılımı (%)
              ${isDrillDown ? `
                <span class="text-xs px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
                  ${drillDownCategory} Detayı
                </span>
              ` : `
                <span class="text-xs text-slate-400 font-normal">Kategoriye tıklayarak alt başlıkları görebilirsiniz</span>
              `}
            </h3>
          </div>
        </div>

        ${isDrillDown ? `
          <button id="btn-chart-back" class="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1">
            <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
            <span>Tüm Kategoriler</span>
          </button>
        ` : ''}
      </div>

      <!-- Grafik ve Lejant Alanı -->
      ${!hasData ? `
        <div class="h-64 flex flex-col items-center justify-center text-center p-6 space-y-2">
          <div class="w-12 h-12 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-500">
            <i data-lucide="pie-chart" class="w-6 h-6"></i>
          </div>
          <p class="text-slate-400 font-medium text-sm">Seçili ayda henüz harcama kaydı yok.</p>
          <p class="text-slate-500 text-xs">Yeni harcama eklediğinizde yüzdesel pasta grafiği burada görünecektir.</p>
        </div>
      ` : `
        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          <!-- Canvas Grafik (5 Kolon) -->
          <div class="md:col-span-5 relative flex items-center justify-center h-64">
            <canvas id="expense-pie-chart" class="max-h-60 max-w-full"></canvas>
            
            <!-- Orta Halka Özeti (Doughnut Center) -->
            <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span class="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                ${isDrillDown ? 'Kategori Tutarı' : 'Toplam Gider'}
              </span>
              <span class="text-base font-extrabold text-white mt-0.5">
                ${formatCurrency(isDrillDown ? dataList.reduce((s, i) => s + i.total, 0) : totalExpense)}
              </span>
            </div>
          </div>

          <!-- Yüzdesel Liste / Lejant (7 Kolon) -->
          <div class="md:col-span-7 space-y-2 max-h-64 overflow-y-auto pr-1">
            ${dataList.map((item, index) => {
              const itemColor = item.color || getPaletteColor(index);
              return `
                <div 
                  class="chart-item-row group flex items-center justify-between p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-800/80 transition cursor-pointer"
                  data-category="${item.name}"
                  title="${!isDrillDown ? 'Alt başlık kırılımını görmek için tıklayın' : ''}"
                >
                  <div class="flex items-center space-x-2.5 min-w-0 flex-1">
                    <span class="w-3 h-3 rounded-full flex-shrink-0" style="background-color: ${itemColor}"></span>
                    <span class="font-medium text-xs text-slate-200 truncate group-hover:text-white transition">
                      ${item.name}
                    </span>
                    ${!isDrillDown ? `
                      <i data-lucide="chevron-right" class="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100 transition flex-shrink-0"></i>
                    ` : ''}
                  </div>
                  <div class="flex items-center space-x-3 text-right flex-shrink-0">
                    <span class="text-xs font-semibold text-slate-300">
                      ${formatCurrency(item.total)}
                    </span>
                    <span class="text-xs font-extrabold px-2 py-0.5 rounded-md text-white min-w-[50px] text-center" style="background-color: ${itemColor}33; color: ${itemColor}; border: 1px solid ${itemColor}55;">
                      ${formatPercent(item.percentage)}
                    </span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>

        </div>
      `}

    </div>
  `;
}

/**
 * Chart.js kütüphanesi ile pasta grafiğini çizer.
 * @param {{
 *   categoriesBreakdown: Array,
 *   subcategoriesBreakdown: Array,
 *   drillDownCategory: string|null,
 *   onSelectCategory: Function
 * }} props
 */
export function initExpenseChart(props) {
  const { categoriesBreakdown, subcategoriesBreakdown, drillDownCategory, onSelectCategory } = props;
  const isDrillDown = Boolean(drillDownCategory);
  const dataList = isDrillDown ? subcategoriesBreakdown : categoriesBreakdown;

  const canvas = document.getElementById('expense-pie-chart');
  if (!canvas || dataList.length === 0 || typeof Chart === 'undefined') {
    return;
  }

  // Önceki grafik nesnesini temizle
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  const labels = dataList.map(item => item.name);
  const dataValues = dataList.map(item => item.total);
  const backgroundColors = dataList.map((item, idx) => item.color || getPaletteColor(idx));

  const ctx = canvas.getContext('2d');
  chartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: dataValues,
        backgroundColor: backgroundColors,
        borderWidth: 2,
        borderColor: '#0f172a',
        hoverBorderColor: '#ffffff',
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%',
      plugins: {
        legend: {
          display: false // Özel şık HTML lejantımızı kullanıyoruz
        },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          titleColor: '#ffffff',
          bodyColor: '#e2e8f0',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          padding: 12,
          boxPadding: 6,
          usePointStyle: true,
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.raw || 0;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
              return ` ${label}: ${formatCurrency(value)} (%${percentage})`;
            }
          }
        }
      },
      onClick: (event, elements) => {
        if (!isDrillDown && elements.length > 0) {
          const index = elements[0].index;
          const selectedCategory = labels[index];
          if (onSelectCategory) {
            onSelectCategory(selectedCategory);
          }
        }
      }
    }
  });
}

function getPaletteColor(index) {
  const palette = [
    '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#06B6D4',
    '#3B82F6', '#EF4444', '#14B8A6', '#6366F1', '#D946EF'
  ];
  return palette[index % palette.length];
}
