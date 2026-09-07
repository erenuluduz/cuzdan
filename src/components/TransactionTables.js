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

  return `
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <!-- ================= SOL KOLON: GELİRLER ================= -->
      <div class="glass-panel rounded-2xl p-5 flex flex-col">
        
        <!-- Gelir Tablo Başlığı -->
        <div class="flex items-center justify-between pb-4 border-b border-slate-800">
          <div class="flex items-center space-x-2.5">
            <div class="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <i data-lucide="arrow-down-left" class="w-4 h-4 text-emerald-400"></i>
            </div>
            <div>
              <h3 class="font-bold text-slate-100 text-sm">Aylık Gelirler</h3>
              <p class="text-xs text-slate-400">${activeMonthName} • ${incomeTransactions.length} kayıt</p>
            </div>
          </div>
          <div class="text-right">
            <span class="text-xs text-slate-400 block font-medium">Toplam</span>
            <span class="text-sm font-extrabold text-emerald-400">${formatCurrency(totalIncome)}</span>
          </div>
        </div>

        <!-- Gelir Listesi -->
        <div class="mt-4 space-y-2 flex-1 max-h-[480px] overflow-y-auto pr-1">
          ${incomeTransactions.length === 0 ? `
            <div class="h-44 flex flex-col items-center justify-center text-center p-6 space-y-2">
              <div class="w-10 h-10 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-500">
                <i data-lucide="wallet" class="w-5 h-5"></i>
              </div>
              <p class="text-slate-400 font-medium text-xs">Bu ay henüz gelir kaydı eklenmemiş.</p>
              <button class="btn-quick-add-income text-xs text-emerald-400 hover:text-emerald-300 font-semibold underline decoration-dotted">
                + Maaş veya Mesai Ekle
              </button>
            </div>
          ` : incomeTransactions.map(item => {
            const cat = categories.find(c => c.name === item.category);
            const badgeColor = cat?.color || '#10B981';
            return `
              <div class="group flex items-center justify-between p-3 rounded-xl bg-slate-800/30 hover:bg-slate-800/60 border border-slate-800/80 transition">
                <div class="flex items-center space-x-3 min-w-0 flex-1">
                  <div class="w-2 self-stretch rounded-full flex-shrink-0" style="background-color: ${badgeColor}"></div>
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center space-x-2 flex-wrap">
                      <span class="font-bold text-xs text-slate-100">${item.category}</span>
                      ${item.subcategory ? `
                        <span class="text-[11px] font-medium text-slate-400 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700/50">
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

                <div class="flex items-center space-x-3 text-right flex-shrink-0 ml-3">
                  <span class="font-extrabold text-sm text-emerald-400">
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
          }).join('')}
        </div>

      </div>

      <!-- ================= SAĞ KOLON: GİDERLER ================= -->
      <div class="glass-panel rounded-2xl p-5 flex flex-col">
        
        <!-- Gider Tablo Başlığı -->
        <div class="flex items-center justify-between pb-4 border-b border-slate-800">
          <div class="flex items-center space-x-2.5">
            <div class="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
              <i data-lucide="arrow-up-right" class="w-4 h-4 text-rose-400"></i>
            </div>
            <div>
              <h3 class="font-bold text-slate-100 text-sm">Aylık Giderler</h3>
              <p class="text-xs text-slate-400">${activeMonthName} • ${expenseTransactions.length} kayıt</p>
            </div>
          </div>
          <div class="text-right">
            <span class="text-xs text-slate-400 block font-medium">Toplam</span>
            <span class="text-sm font-extrabold text-rose-400">${formatCurrency(totalExpense)}</span>
          </div>
        </div>

        <!-- Gider Listesi -->
        <div class="mt-4 space-y-2 flex-1 max-h-[480px] overflow-y-auto pr-1">
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
              <div class="group flex items-center justify-between p-3 rounded-xl bg-slate-800/30 hover:bg-slate-800/60 border border-slate-800/80 transition">
                <div class="flex items-center space-x-3 min-w-0 flex-1">
                  <div class="w-2 self-stretch rounded-full flex-shrink-0" style="background-color: ${badgeColor}"></div>
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

                <div class="flex items-center space-x-3 text-right flex-shrink-0 ml-3">
                  <span class="font-extrabold text-sm text-rose-400">
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
