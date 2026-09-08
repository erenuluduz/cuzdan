/**
 * Kredi Kartı Faizi Ekleme Modalı (CCInterestModal)
 */

/**
 * Kredi Kartı Faizi Ekleme Modalı HTML şablonunu oluşturur.
 * @param {{
 *   activeMonth: string
 * }} props
 * @returns {string}
 */
export function renderCCInterestModal(props) {
  const { activeMonth } = props;

  const todayStr = new Date().toISOString().split('T')[0];
  let defaultDate = todayStr;
  if (activeMonth && !todayStr.startsWith(activeMonth)) {
    defaultDate = `${activeMonth}-01`;
  }

  return `
    <div id="cc-interest-modal-overlay" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div class="glass-panel w-full max-w-md rounded-2xl border border-slate-700/80 bg-slate-900/95 shadow-2xl overflow-hidden">
        
        <!-- Modal Başlık -->
        <div class="p-5 border-b border-slate-800 flex items-center justify-between">
          <div class="flex items-center space-x-2.5">
            <div class="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
              <i data-lucide="percent" class="w-4 h-4 text-rose-400"></i>
            </div>
            <div>
              <h3 class="font-bold text-base text-white">Kart Faizi & Masraf Ekle</h3>
              <p class="text-xs text-slate-400">Banka ekstrenize yansıyan faiz ve vergileri kaydedin</p>
            </div>
          </div>
          <button id="cc-interest-modal-close" class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <!-- Form Alanı -->
        <form id="cc-interest-form" class="p-6 space-y-4">
          
          <!-- Faiz Tutarı -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">Ekstre Faiz Tutarı (TL) *</label>
            <div class="relative rounded-xl overflow-hidden">
              <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold text-sm">₺</span>
              <input 
                type="number" 
                id="cc-interest-amount" 
                step="0.01" 
                min="0.01" 
                required 
                placeholder="0.00" 
                class="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-white font-bold text-base focus:border-purple-500 focus:outline-none transition"
              >
            </div>
            <span class="text-[11px] text-slate-500 mt-1 block">Akdi faiz, gecikme faizi ve KKDF/BSMV vergileri toplamı</span>
          </div>

          <!-- Tarih -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">Ekstre / Kesim Tarihi *</label>
            <input 
              type="date" 
              id="cc-interest-date" 
              required 
              value="${defaultDate}"
              class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-purple-500 focus:outline-none transition"
            >
          </div>

          <!-- Açıklama -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">Açıklama (İsteğe Bağlı)</label>
            <input 
              type="text" 
              id="cc-interest-description" 
              placeholder="Örn: Eylül Ekstre Faizi & Vergiler" 
              class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-purple-500 focus:outline-none transition"
            >
          </div>

          <!-- Bilgilendirme Notu -->
          <div class="p-3 rounded-xl bg-amber-950/20 border border-amber-800/30 text-[11px] text-amber-300 flex items-start gap-2">
            <i data-lucide="info" class="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400"></i>
            <span>
              Bu tutar hem kredi kartı borcunuza eklenecek, hem de bu ayın harcamalarında <strong>"Kredi Kartı -> Kart Faizi & Masraflar"</strong> olarak pasta grafiğinize yansıtılacaktır.
            </span>
          </div>

          <!-- Butonlar -->
          <div class="pt-2 border-t border-slate-800 flex items-center justify-end space-x-2.5">
            <button 
              type="button" 
              id="cc-interest-modal-cancel" 
              class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition"
            >
              İptal
            </button>
            <button 
              type="submit" 
              class="px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/20 transition flex items-center gap-1.5"
            >
              <i data-lucide="check" class="w-4 h-4"></i>
              <span>Faizi Borca Ekle</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  `;
}
