/**
 * Kategori ve Alt Kategori Yönetim Modalı
 */

/**
 * Kategori Yönetim Modalı HTML şablonunu oluşturur.
 * @param {{
 *   categories: Array
 * }} props
 * @returns {string}
 */
export function renderCategoryModal(props) {
  const { categories = [] } = props;

  const incomeCategories = categories.filter(c => c.type === 'income');
  const expenseCategories = categories.filter(c => c.type === 'expense');

  return `
    <div id="category-modal-overlay" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div class="glass-panel w-full max-w-2xl max-h-[90vh] rounded-2xl border border-slate-700/80 bg-slate-900/95 shadow-2xl overflow-hidden flex flex-col">
        
        <!-- Modal Başlık -->
        <div class="p-5 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
          <div class="flex items-center space-x-2.5">
            <div class="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <i data-lucide="tags" class="w-4 h-4 text-purple-400"></i>
            </div>
            <div>
              <h3 class="font-bold text-base text-white">Kategori ve Alt Başlık Yönetimi</h3>
              <p class="text-xs text-slate-400">Mevcut kategorileri görüntüleyin, yeni kategori veya alt başlık ekleyin</p>
            </div>
          </div>
          <button id="category-modal-close" class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <!-- Kaydırılabilir İçerik -->
        <div class="p-6 overflow-y-auto space-y-6 flex-1">
          
          <!-- Yeni Kategori Ekleme Formu -->
          <div class="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <h4 class="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <i data-lucide="plus-circle" class="w-3.5 h-3.5"></i>
              <span>Yeni Ana Kategori Ekle</span>
            </h4>
            <form id="add-category-form" class="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div class="sm:col-span-4">
                <label class="block text-[11px] font-semibold text-slate-400 mb-1">Kategori Adı *</label>
                <input 
                  type="text" 
                  id="new-cat-name" 
                  required 
                  placeholder="Örn: Sağlık & Sigorta" 
                  class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                >
              </div>

              <div class="sm:col-span-3">
                <label class="block text-[11px] font-semibold text-slate-400 mb-1">Tür *</label>
                <select id="new-cat-type" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white focus:border-purple-500 focus:outline-none">
                  <option value="expense">Gider (-)</option>
                  <option value="income">Gelir (+)</option>
                </select>
              </div>

              <div class="sm:col-span-2">
                <label class="block text-[11px] font-semibold text-slate-400 mb-1">Renk</label>
                <input 
                  type="color" 
                  id="new-cat-color" 
                  value="#8B5CF6" 
                  class="w-full h-8 bg-slate-900 border border-slate-700 rounded-lg p-1 cursor-pointer"
                >
              </div>

              <div class="sm:col-span-3">
                <button type="submit" class="w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1">
                  <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                  <span>Kategori Ekle</span>
                </button>
              </div>
            </form>
          </div>

          <!-- Yeni Alt Başlık Ekleme Formu -->
          <div class="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <h4 class="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <i data-lucide="corner-down-right" class="w-3.5 h-3.5"></i>
              <span>Mevcut Kategoriye Yeni Alt Başlık Ekle</span>
            </h4>
            <form id="add-subcategory-form" class="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div class="sm:col-span-5">
                <label class="block text-[11px] font-semibold text-slate-400 mb-1">Ana Kategori Seçin *</label>
                <select id="subcat-parent-name" required class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none">
                  ${categories.map(c => `
                    <option value="${c.name}">${c.name} (${c.type === 'income' ? 'Gelir' : 'Gider'})</option>
                  `).join('')}
                </select>
              </div>

              <div class="sm:col-span-4">
                <label class="block text-[11px] font-semibold text-slate-400 mb-1">Yeni Alt Başlık Adı *</label>
                <input 
                  type="text" 
                  id="new-subcat-name" 
                  required 
                  placeholder="Örn: Diş Sağlığı" 
                  class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                >
              </div>

              <div class="sm:col-span-3">
                <button type="submit" class="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1">
                  <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                  <span>Alt Başlık Ekle</span>
                </button>
              </div>
            </form>
          </div>

          <!-- Kategori Listesi -->
          <div class="space-y-4">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">Aktif Kategori ve Alt Başlıklar</h4>
            
            <!-- Gider Kategorileri -->
            <div>
              <span class="text-xs font-semibold text-rose-400 block mb-2">Gider Kategorileri (${expenseCategories.length})</span>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                ${expenseCategories.map(cat => `
                  <div class="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-col justify-between space-y-2">
                    <div class="flex items-center space-x-2">
                      <span class="w-3 h-3 rounded-full flex-shrink-0" style="background-color: ${cat.color}"></span>
                      <span class="font-bold text-xs text-white">${cat.name}</span>
                    </div>
                    <div class="flex flex-wrap gap-1">
                      ${(cat.subcategories || []).map(sub => `
                        <span class="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60">
                          ${sub}
                        </span>
                      `).join('')}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Gelir Kategorileri -->
            <div class="pt-2">
              <span class="text-xs font-semibold text-emerald-400 block mb-2">Gelir Kategorileri (${incomeCategories.length})</span>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                ${incomeCategories.map(cat => `
                  <div class="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-col justify-between space-y-2">
                    <div class="flex items-center space-x-2">
                      <span class="w-3 h-3 rounded-full flex-shrink-0" style="background-color: ${cat.color}"></span>
                      <span class="font-bold text-xs text-white">${cat.name}</span>
                    </div>
                    <div class="flex flex-wrap gap-1">
                      ${(cat.subcategories || []).map(sub => `
                        <span class="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60">
                          ${sub}
                        </span>
                      `).join('')}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

          </div>

        </div>

        <!-- Alt Kapat Butonu -->
        <div class="p-4 border-t border-slate-800 flex justify-end flex-shrink-0">
          <button id="category-modal-done-btn" class="px-5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition">
            Tamam
          </button>
        </div>

      </div>
    </div>
  `;
}
