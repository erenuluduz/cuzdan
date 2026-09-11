/**
 * İşlem Ekleme / Düzenleme Modalı (Gelir & Gider)
 */

import { getMonthKey } from '../utils/calculations.js';

/**
 * Modal HTML şablonunu oluşturur.
 * @param {{
 *   type: 'income' | 'expense',
 *   categories: Array,
 *   activeMonth: string,
 *   editingTransaction?: Object|null
 * }} props
 * @returns {string}
 */
export function renderTransactionModal(props) {
  const { type = 'expense', categories = [], activeMonth, editingTransaction = null, preselectedCategory = null } = props;
  const isEditing = Boolean(editingTransaction);

  const availableCategories = categories.filter(c => c.type === type);
  const defaultCategory = editingTransaction?.category || preselectedCategory || (availableCategories[0]?.name || '');
  const selectedCatObj = availableCategories.find(c => c.name === defaultCategory) || availableCategories[0];
  const subcategories = selectedCatObj?.subcategories || [];
  const defaultSubcategory = editingTransaction?.subcategory || (subcategories[0] || '');

  // Varsayılan tarih: aktif aya ait geçerli bir gün (örn. aktif ay bu aysa bugünün tarihi, değilse ayın 1'i)
  const todayStr = new Date().toISOString().split('T')[0];
  let defaultDate = todayStr;
  if (activeMonth && !todayStr.startsWith(activeMonth)) {
    defaultDate = `${activeMonth}-01`;
  }
  if (editingTransaction?.date) {
    defaultDate = editingTransaction.date;
  }

  const isIncome = type === 'income';

  return `
    <div id="transaction-modal-overlay" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div class="glass-panel w-full max-w-lg rounded-2xl border border-slate-700/80 bg-slate-900/95 shadow-2xl overflow-hidden">
        
        <!-- Modal Başlık & Tip Seçici -->
        <div class="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 class="font-bold text-base text-white">
              ${isEditing ? 'İşlemi Düzenle' : (isIncome ? 'Yeni Gelir Ekle' : 'Yeni Gider Ekle')}
            </h3>
            <p class="text-xs text-slate-400 mt-0.5">
              ${isIncome ? 'Maaş, mesai veya ek gelirlerinizi girin' : 'Harcamalarınızı kategori ve alt başlıklarla kaydedin'}
            </p>
          </div>
          <button id="modal-close-btn" class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <!-- Form İçeriği -->
        <form id="transaction-form" class="p-6 space-y-4">
          
          <!-- Tip Değiştirici Sekmeler (Düzenleme modunda değilse) -->
          ${!isEditing ? `
            <div class="grid grid-cols-2 gap-2 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
              <button 
                type="button" 
                id="tab-income-btn" 
                class="py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${isIncome ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}"
              >
                <i data-lucide="arrow-up-circle" class="w-3.5 h-3.5"></i>
                <span>Gelir Girişi</span>
              </button>
              <button 
                type="button" 
                id="tab-expense-btn" 
                class="py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${!isIncome ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}"
              >
                <i data-lucide="arrow-down-circle" class="w-3.5 h-3.5"></i>
                <span>Gider Girişi</span>
              </button>
            </div>
          ` : ''}

          <input type="hidden" id="trans-type" value="${type}">
          ${isEditing ? `<input type="hidden" id="trans-id" value="${editingTransaction.id}">` : ''}

          <!-- Ödeme Yöntemi (Yalnızca Giderler İçin) -->
          ${!isIncome ? `
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1.5">Ödeme Yöntemi *</label>
              <div class="grid grid-cols-2 gap-2 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
                <label class="cursor-pointer">
                  <input 
                    type="radio" 
                    name="payment-method-radio" 
                    value="credit_card" 
                    class="peer hidden" 
                    ${(editingTransaction?.paymentMethod || 'credit_card') === 'credit_card' ? 'checked' : ''}
                  >
                  <div class="py-1.5 px-3 text-xs font-bold rounded-lg text-center transition flex items-center justify-center gap-1.5 text-slate-400 peer-checked:bg-purple-600 peer-checked:text-white peer-checked:shadow-sm">
                    <i data-lucide="credit-card" class="w-3.5 h-3.5"></i>
                    <span>Kredi Kartı</span>
                  </div>
                </label>
                <label class="cursor-pointer">
                  <input 
                    type="radio" 
                    name="payment-method-radio" 
                    value="cash" 
                    class="peer hidden" 
                    ${editingTransaction?.paymentMethod === 'cash' ? 'checked' : ''}
                  >
                  <div class="py-1.5 px-3 text-xs font-bold rounded-lg text-center transition flex items-center justify-center gap-1.5 text-slate-400 peer-checked:bg-emerald-600 peer-checked:text-white peer-checked:shadow-sm">
                    <i data-lucide="banknote" class="w-3.5 h-3.5"></i>
                    <span>Nakit / Banka</span>
                  </div>
                </label>
              </div>
            </div>
          ` : ''}

          <!-- Tutar Girişi -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">Tutar (TL) *</label>
            <div class="relative rounded-xl overflow-hidden">
              <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold text-sm">₺</span>
              <input 
                type="number" 
                id="trans-amount" 
                step="0.01" 
                min="0.01" 
                required 
                placeholder="0.00" 
                value="${editingTransaction?.amount || ''}"
                class="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-white font-bold text-base focus:border-purple-500 focus:outline-none transition"
              >
            </div>
          </div>

          <!-- Kategori & Alt Kategori Seçimi -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="block text-xs font-semibold text-slate-300">Ana Kategori *</label>
                <button type="button" id="btn-toggle-inline-category" class="text-[11px] text-purple-400 hover:text-purple-300 font-semibold transition flex items-center gap-1">
                  <i data-lucide="plus" class="w-3 h-3"></i>
                  <span>Yeni Kategori</span>
                </button>
              </div>
              <select 
                id="trans-category" 
                required
                class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none transition"
              >
                ${availableCategories.map(cat => `
                  <option value="${cat.name}" ${cat.name === defaultCategory ? 'selected' : ''}>
                    ${cat.name}
                  </option>
                `).join('')}
              </select>

              <!-- Inline Yeni Kategori Ekleme Kutusu -->
              <div id="inline-category-box" class="hidden mt-2 p-2.5 rounded-xl bg-slate-950 border border-purple-500/40 space-y-2 animate-fade-in shadow-lg">
                <input 
                  type="text" 
                  id="inline-category-input" 
                  placeholder="Yeni kategori adı..." 
                  class="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                >
                <div class="flex items-center justify-end gap-1.5">
                  <button type="button" id="btn-cancel-inline-category" class="px-2.5 py-1 text-[11px] text-slate-400 hover:text-white rounded transition">
                    Vazgeç
                  </button>
                  <button type="button" id="btn-save-inline-category" class="px-3 py-1 text-[11px] font-bold bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition shadow-sm">
                    Ekle
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="block text-xs font-semibold text-slate-300">Alt Başlık *</label>
                <button type="button" id="btn-toggle-inline-subcategory" class="text-[11px] text-purple-400 hover:text-purple-300 font-semibold transition flex items-center gap-1">
                  <i data-lucide="plus" class="w-3 h-3"></i>
                  <span>Yeni Alt Başlık</span>
                </button>
              </div>
              <select 
                id="trans-subcategory" 
                required
                class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none transition"
              >
                ${subcategories.map(sub => `
                  <option value="${sub}" ${sub === defaultSubcategory ? 'selected' : ''}>
                    ${sub}
                  </option>
                `).join('')}
              </select>

              <!-- Inline Yeni Alt Başlık Ekleme Kutusu -->
              <div id="inline-subcategory-box" class="hidden mt-2 p-2.5 rounded-xl bg-slate-950 border border-purple-500/40 space-y-2 animate-fade-in shadow-lg">
                <input 
                  type="text" 
                  id="inline-subcategory-input" 
                  placeholder="Yeni alt başlık adı..." 
                  class="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                >
                <div class="flex items-center justify-end gap-1.5">
                  <button type="button" id="btn-cancel-inline-subcategory" class="px-2.5 py-1 text-[11px] text-slate-400 hover:text-white rounded transition">
                    Vazgeç
                  </button>
                  <button type="button" id="btn-save-inline-subcategory" class="px-3 py-1 text-[11px] font-bold bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition shadow-sm">
                    Ekle
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Tarih -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">Tarih *</label>
            <input 
              type="date" 
              id="trans-date" 
              required 
              value="${defaultDate}"
              class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-purple-500 focus:outline-none transition"
            >
          </div>

          <!-- Açıklama / Not -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">Açıklama / Not (İsteğe Bağlı)</label>
            <input 
              type="text" 
              id="trans-description" 
              placeholder="Örn: Elektrik faturası, haftalık manav alışverişi vb." 
              value="${editingTransaction?.description || ''}"
              class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-purple-500 focus:outline-none transition"
            >
          </div>

          <!-- Butonlar -->
          <div class="pt-3 border-t border-slate-800 flex items-center justify-end space-x-2.5">
            <button 
              type="button" 
              id="modal-cancel-btn" 
              class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition"
            >
              İptal
            </button>
            <button 
              type="submit" 
              class="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-lg transition flex items-center gap-1.5 ${isIncome ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20' : 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20'}"
            >
              <i data-lucide="check" class="w-4 h-4"></i>
              <span>${isEditing ? 'Güncelle' : 'Kaydet'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  `;
}
