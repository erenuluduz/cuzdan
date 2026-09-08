/**
 * Finansal Ayarlar Modalı (SettingsModal)
 */

/**
 * Ayarlar Modalı HTML şablonunu oluşturur.
 * @param {{
 *   settings: {
 *     initialCreditCardDebt: number,
 *     fixedSalaryAmount: number,
 *     salaryDayOfMonth: number
 *   }
 * }} props
 * @returns {string}
 */
export function renderSettingsModal(props) {
  const { settings } = props;

  return `
    <div id="settings-modal-overlay" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div class="glass-panel w-full max-w-lg rounded-2xl border border-slate-700/80 bg-slate-900/95 shadow-2xl overflow-hidden">
        
        <!-- Modal Başlık -->
        <div class="p-5 border-b border-slate-800 flex items-center justify-between">
          <div class="flex items-center space-x-2.5">
            <div class="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <i data-lucide="sliders-horizontal" class="w-4 h-4 text-purple-400"></i>
            </div>
            <div>
              <h3 class="font-bold text-base text-white">Finansal Ayarlar</h3>
              <p class="text-xs text-slate-400">Kredi kartı borcu ve otomatik sabit maaş tercihlerinizi yapılandırın</p>
            </div>
          </div>
          <button id="settings-modal-close" class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <!-- Form Alanı -->
        <form id="settings-form" class="p-6 space-y-5">
          
          <!-- 1. Geçmişten Kalan Birikmiş Kredi Kartı Borcu -->
          <div class="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <label class="block text-xs font-bold text-rose-300 flex items-center gap-1.5">
              <i data-lucide="credit-card" class="w-3.5 h-3.5"></i>
              <span>Geçmişten Kalan Birikmiş Kart Borcu (TL)</span>
            </label>
            <div class="relative rounded-xl overflow-hidden">
              <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold text-sm">₺</span>
              <input 
                type="number" 
                id="setting-cc-debt" 
                step="0.01" 
                min="0" 
                value="${settings.initialCreditCardDebt || 0}"
                class="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-white font-bold text-sm focus:border-purple-500 focus:outline-none transition"
              >
            </div>
            <p class="text-[11px] text-slate-400 leading-relaxed">
              Sistemi kullanmaya başlamadan önceki mevcut kart borcunuzdur. Kartla yaptığınız yeni harcamalar bunun üzerine eklenir, borç ödedikçe bu bakiye erir.
            </p>
          </div>

          <!-- 2. Sabit Aylık Maaş Tutarı -->
          <div class="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <label class="block text-xs font-bold text-emerald-300 flex items-center gap-1.5">
              <i data-lucide="wallet" class="w-3.5 h-3.5"></i>
              <span>Sabit Aylık Maaş Tutarı (TL)</span>
            </label>
            <div class="relative rounded-xl overflow-hidden">
              <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold text-sm">₺</span>
              <input 
                type="number" 
                id="setting-fixed-salary" 
                step="0.01" 
                min="0" 
                value="${settings.fixedSalaryAmount || 0}"
                class="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-white font-bold text-sm focus:border-purple-500 focus:outline-none transition"
              >
            </div>
            <p class="text-[11px] text-slate-400 leading-relaxed">
              Her yeni aya geçtiğinizde maaşınız otomatik olarak tablonuza eklenir. Siz yalnızca o ayki değişen mesainizi girersiniz. (0 bırakırsanız otomatik eklenmez).
            </p>
          </div>

          <!-- 3. Maaş Günü -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Maaşın Hesaba Geçtiği Gün</label>
              <input 
                type="number" 
                id="setting-salary-day" 
                min="1" 
                max="31" 
                value="${settings.salaryDayOfMonth || 1}"
                class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
              >
            </div>
            <div class="text-[11px] text-slate-400 pt-3">
              Maaş kaydı her ayın bu gününe tarihlenir (Örn: Ayın 1'i veya 15'i).
            </div>
          </div>

          <!-- Butonlar -->
          <div class="pt-3 border-t border-slate-800 flex items-center justify-end space-x-2.5">
            <button 
              type="button" 
              id="settings-cancel-btn" 
              class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition"
            >
              İptal
            </button>
            <button 
              type="submit" 
              class="px-5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-600/20 transition flex items-center gap-1.5"
            >
              <i data-lucide="check" class="w-4 h-4"></i>
              <span>Ayarları Kaydet</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  `;
}
