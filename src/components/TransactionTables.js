/**
 * İki Kolonlu Gelir ve Gider Tabloları Listesi Bileşeni
 */

import { formatCurrency } from '../utils/calculations.js';

/**
 * Gelir ve Gider tablolarının HTML şablonunu oluşturur.
 * @param {{
 *   incomeTransactions: Array,
 *   expenseTransactions: Array,
 *   categories: Array,
 *   activeMonthName: string
 * }} props
 * @returns {string}
 */
export function renderTransactionTables(props) {
  const { incomeTransactions = [], expenseTransactions = [], categories = [], activeMonthName } = props;

  const totalIncome = incomeTransactions.reduce((s, t) => s + (Number(t.amount) || 0), 0);
  const totalExpense = expenseTransactions.reduce((s, t) => s + (Number(t.amount) || 0), 0);

  // Gelirleri Kategorilere Göre Ayır (Maaş her zaman Mesai'nin üstünde)
  const salaryTransactions = incomeTransactions.filter(t => t.category === 'Maaş');
  const overtimeTransactions = incomeTransactions.filter(t => t.category === 'Mesai');
  const otherIncomeTransactions = incomeTransactions.filter(t => t.category !== 'Maaş' && t.category !== 'Mesai');

  const salaryTotal = salaryTransactions.reduce((s, t) => s + (Number(t.amount) || 0), 0);
  const overtimeTotal = overtimeTransactions.reduce((s, t) => s + (Number(t.amount) || 0), 0);
  const otherIncomeTotal = otherIncomeTransactions.reduce((s, t) => s + (Number(t.amount) || 0), 0);

  return `
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      
      <!-- ================= SOL KOLON: GELİRLER ================= -->
      <div class="glass-panel rounded-2xl p-5 flex flex-col space-y-4">
        
        <!-- Gelir Ana Başlığı -->
        <div class="flex items-center justify-between pb-3 border-b border-slate-800">
          <div class="flex items-center space-x-2.5">
            <div class="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <i data-lucide="arrow-down-left" class="w-4 h-4 text-emerald-400"></i>
            </div>
            <div>
              <h3 class="font-bold text-slate-100 text-sm">Aylık Gelir Tablosu</h3>
              <p class="text-xs text-slate-400">${activeMonthName} Gelirleri</p>
            </div>
          </div>
          <div class="text-right">
            <span class="text-xs text-slate-400 block font-medium">Toplam Gelir</span>
            <span class="text-base font-extrabold text-emerald-400">${formatCurrency(totalIncome)}</span>
          </div>
        </div>

        <!-- 1. BÖLÜM (ÜSTTE): MAAŞ KISMI -->
        <div class="rounded-xl bg-slate-950/50 border border-slate-800/80 p-3.5 space-y-2.5">
          <div class="flex items-center justify-between pb-2 border-b border-slate-800/60">
            <div class="flex items-center space-x-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <h4 class="font-bold text-xs text-emerald-300 uppercase tracking-wider">Maaş Gelirleri</h4>
              <span class="text-[11px] text-slate-400 font-semibold">(${formatCurrency(salaryTotal)})</span>
            </div>
            <button 
              id="btn-add-salary-quick" 
              class="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 transition flex items-center gap-1"
            >
              <i data-lucide="plus" class="w-3 h-3"></i>
              <span>Maaş Ekle</span>
            </button>
          </div>

          <!-- Maaş Kayıtları Listesi -->
          <div class="space-y-2 max-h-48 overflow-y-auto pr-1">
            ${salaryTransactions.length === 0 ? `
              <div class="py-3 px-2 text-center text-slate-500 text-xs">
                Bu ay henüz maaş eklenmemiş.
              </div>
            ` : salaryTransactions.map(item => renderIncomeRow(item, '#10B981')).join('')}
          </div>
        </div>

        <!-- 2. BÖLÜM (ALTTA): MESAİ KISMI -->
        <div class="rounded-xl bg-slate-950/50 border border-slate-800/80 p-3.5 space-y-2.5">
          <div class="flex items-center justify-between pb-2 border-b border-slate-800/60">
            <div class="flex items-center space-x-2">
              <span class="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
              <h4 class="font-bold text-xs text-cyan-300 uppercase tracking-wider">Mesai Gelirleri</h4>
              <span class="text-[11px] text-slate-400 font-semibold">(${formatCurrency(overtimeTotal)})</span>
            </div>
            <button 
              id="btn-add-overtime-quick" 
              class="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-500/30 transition flex items-center gap-1"
            >
              <i data-lucide="plus" class="w-3 h-3"></i>
              <span>Mesai Ekle</span>
            </button>
          </div>

          <!-- Mesai Kayıtları Listesi -->
          <div class="space-y-2 max-h-48 overflow-y-auto pr-1">
            ${overtimeTransactions.length === 0 ? `
              <div class="py-3 px-2 text-center text-slate-500 text-xs">
                Bu ay henüz mesai eklenmemiş.
              </div>
            ` : overtimeTransactions.map(item => renderIncomeRow(item, '#06B6D4')).join('')}
          </div>
        </div>

        <!-- 3. BÖLÜM: DİĞER GELİRLER (Varsa veya eklemek için) -->
        ${(otherIncomeTransactions.length > 0 || incomeTransactions.length === 0) ? `
          <div class="rounded-xl bg-slate-950/40 border border-slate-800/60 p-3 space-y-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <span class="w-2 h-2 rounded-full bg-blue-500"></span>
                <span class="text-xs font-semibold text-slate-300">Diğer / Ek Gelirler (${formatCurrency(otherIncomeTotal)})</span>
              </div>
              <button 
                id="btn-add-other-income-quick" 
                class="text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition flex items-center gap-1"
              >
                <i data-lucide="plus" class="w-3 h-3"></i>
                <span>Ek Gelir</span>
              </button>
            </div>
            ${otherIncomeTransactions.length > 0 ? `
              <div class="space-y-1.5 pt-1">
                ${otherIncomeTransactions.map(item => renderIncomeRow(item, '#3B82F6')).join('')}
              </div>
            ` : ''}
          </div>
        ` : ''}

      </div>

      <!-- ================= SAĞ KOLON: GİDERLER ================= -->
      <div class="glass-panel rounded-2xl p-5 flex flex-col">
        
        <!-- Gider Tablo Başlığı -->
        <div class="flex items-center justify-between pb-3 border-b border-slate-800">
          <div class="flex items-center space-x-2.5">
            <div class="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
              <i data-lucide="arrow-up-right" class="w-4 h-4 text-rose-400"></i>
            </div>
            <div>
              <h3 class="font-bold text-slate-100 text-sm">Aylık Gider Tablosu</h3>
              <p class="text-xs text-slate-400">${activeMonthName} Giderleri</p>
            </div>
          </div>
          <div class="text-right">
            <span class="text-xs text-slate-400 block font-medium">Toplam Gider</span>
            <span class="text-base font-extrabold text-rose-400">${formatCurrency(totalExpense)}</span>
          </div>
        </div>

        <!-- Gider Listesi -->
        <div class="mt-4 space-y-2 flex-1 max-h-[530px] overflow-y-auto pr-1">
          ${expenseTransactions.length === 0 ? `
            <div class="h-44 flex flex-col items-center justify-center text-center p-6 space-y-2">
              <div class="w-10 h-10 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-500">
                <i data-lucide="shopping-bag" class="w-5 h-5"></i>
              </div>
              <p class="text-slate-400 font-medium text-xs">Bu ay henüz harcama kaydı eklenmemiş.</p>
              <button class="btn-quick-add-expense text-xs text-rose-400 hover:text-rose-300 font-semibold underline decoration-dotted">
                + Harcama Ekle
              </button>
            </div>
          ` : expenseTransactions.map(item => {
            const cat = categories.find(c => c.name === item.category);
            const badgeColor = cat?.color || '#EF4444';
            return `
              <div class="group flex items-center justify-between p-2.5 rounded-xl bg-slate-800/30 hover:bg-slate-800/60 border border-slate-800/80 transition">
                <div class="flex items-center space-x-3 min-w-0 flex-1">
                  <div class="w-1.5 self-stretch rounded-full flex-shrink-0" style="background-color: ${badgeColor}"></div>
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center space-x-2 flex-wrap">
                      <span class="font-bold text-xs text-slate-100">${item.category}</span>
                      ${item.subcategory ? `
                        <span class="text-[11px] font-medium text-slate-300 px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60">
                          ${item.subcategory}
                        </span>
                      ` : ''}
                    </div>
                    ${item.description ? `
                      <p class="text-xs text-slate-400 truncate mt-0.5">${item.description}</p>
                    ` : ''}
                    <span class="text-[10px] text-slate-500 block mt-0.5">${item.date}</span>
                  </div>
                </div>

                <div class="flex items-center space-x-2.5 text-right flex-shrink-0 ml-3">
                  <span class="font-extrabold text-xs sm:text-sm text-rose-400">
                    -${formatCurrency(item.amount)}
                  </span>
                  
                  <div class="flex items-center space-x-1 opacity-80 group-hover:opacity-100 transition">
                    <button 
                      class="btn-edit-transaction p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition" 
                      data-id="${item.id}"
                      title="Düzenle"
                    >
                      <i data-lucide="edit-2" class="w-3.5 h-3.5"></i>
                    </button>
                    <button 
                      class="btn-delete-transaction p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition" 
                      data-id="${item.id}"
                      title="Sil"
                    >
                      <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                    </button>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

      </div>

    </div>
  `;
}

/**
 * Gelir satırı render yardımcısı
 */
function renderIncomeRow(item, color) {
  return `
    <div class="group flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 transition">
      <div class="flex items-center space-x-2.5 min-w-0 flex-1">
        <div class="w-1.5 self-stretch rounded-full flex-shrink-0" style="background-color: ${color}"></div>
        <div class="min-w-0 flex-1">
          <div class="flex items-center space-x-2 flex-wrap">
            <span class="font-bold text-xs text-slate-100">${item.subcategory || item.category}</span>
          </div>
          ${item.description ? `<p class="text-[11px] text-slate-400 truncate mt-0.5">${item.description}</p>` : ''}
          <span class="text-[10px] text-slate-500 block mt-0.5">${item.date}</span>
        </div>
      </div>

      <div class="flex items-center space-x-2.5 text-right flex-shrink-0 ml-2">
        <span class="font-extrabold text-xs sm:text-sm text-emerald-400">
          +${formatCurrency(item.amount)}
        </span>
        
        <div class="flex items-center space-x-1 opacity-80 group-hover:opacity-100 transition">
          <button 
            class="btn-edit-transaction p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition" 
            data-id="${item.id}"
            title="Düzenle"
          >
            <i data-lucide="edit-2" class="w-3.5 h-3.5"></i>
          </button>
          <button 
            class="btn-delete-transaction p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition" 
            data-id="${item.id}"
            title="Sil"
          >
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      </div>
    </div>
  `;
}
