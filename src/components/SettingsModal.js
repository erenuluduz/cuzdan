/**
 * Finansal Ayarlar & Veri Yönetimi Modalı (SettingsModal)
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
      <div class="glass-panel w-full max-w-lg rounded-3xl border border-slate-700/80 bg-slate-900/95 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        <!-- Modal Başlık -->
        <div class="p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div class="flex items-center space-x-2.5">
            <div class="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shadow-inner">
              <i data-lucide="sliders-horizontal" class="w-4 h-4 text-purple-400"></i>
            </div>
            <div>
              <h3 class="font-bold text-base text-white">Ayarlar & Veri Yönetimi</h3>
              <p class="text-xs text-slate-400">Finansal kuralları ve sistem yedeklerinizi yönetin</p>
            </div>
          </div>
          <button id="settings-modal-close" class="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <!-- Kaydırılabilir İçerik -->
        <div class="overflow-y-auto p-5 space-y-5">
          <form id="settings-form" class="space-y-4">
            
            <!-- 1. Başlangıç Kart Borcu -->
            <div class="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
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
                Kredi kartı limit detayından (Maksimum Limit - Kalan Limit) hesaplanan başlangıç borcudur.
              </p>
            </div>

            <!-- 2. Sabit Aylık Maaş Tutarı -->
            <div class="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
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
                Her yeni ayın ilk gününde tablonuza otomatik eklenir. Mesailerinizi ise tablodan tek tek eklersiniz.
              </p>
            </div>

            <!-- 3. Maaş Günü -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center p-3 rounded-2xl bg-slate-950/40 border border-slate-800/60">
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Maaş Günü (Ayın Kaçı)</label>
                <input 
                  type="number" 
                  id="setting-salary-day" 
                  min="1" 
                  max="31" 
                  value="${settings.salaryDayOfMonth || 1}"
                  class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                >
              </div>
              <div class="text-[11px] text-slate-400">
                Maaş kaydı her ayın bu gününe tarihlenir (Örn: Ayın 1'i veya 15'i).
              </div>
            </div>

            <div class="flex justify-end pt-2">
              <button 
                type="submit" 
                class="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-600/25 transition flex items-center gap-1.5"
              >
                <i data-lucide="save" class="w-4 h-4"></i>
                <span>Finansal Ayarları Kaydet</span>
              </button>
            </div>
          </form>

          <!-- Veri Yedekleme ve Sıfırlama Bölümü (Taşınan Butonlar) -->
          <div class="pt-4 border-t border-slate-800 space-y-3">
            <h4 class="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <i data-lucide="database" class="w-3.5 h-3.5 text-purple-400"></i>
              <span>Veri & Yedekleme İşlemleri</span>
            </h4>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <!-- Yedek Al -->
              <button 
                type="button" 
                id="btn-export-backup" 
                class="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition flex items-center justify-center gap-2"
              >
                <i data-lucide="download" class="w-4 h-4 text-purple-400"></i>
                <span>Yedek İndir (JSON)</span>
              </button>

              <!-- Yedek Yükle -->
              <button 
                type="button" 
                id="btn-import-backup" 
                class="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition flex items-center justify-center gap-2"
              >
                <i data-lucide="upload" class="w-4 h-4 text-emerald-400"></i>
                <span>Yedek Yükle</span>
              </button>
            </div>

            <!-- Tüm Verileri Sıfırla -->
            <div class="pt-2">
              <button 
                type="button" 
                id="btn-clear-all" 
                class="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-rose-950/30 hover:bg-rose-900/50 text-rose-300 border border-rose-800/40 transition flex items-center justify-center gap-2"
              >
                <i data-lucide="trash-2" class="w-4 h-4 text-rose-400"></i>
                <span>Tüm Verileri ve İşlemleri Sıfırla</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  `;
}
