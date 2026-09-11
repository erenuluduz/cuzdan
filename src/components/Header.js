/**
 * Üst Çubuk (Header) - Cüzdanım & Küre Ayarlar Butonu
 */

export function renderHeader() {
  return `
    <header class="border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
        
        <!-- Logo & Sade Başlık: Yalnızca Cüzdanım -->
        <div class="flex items-center space-x-2.5 sm:space-x-3">
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
            <i data-lucide="wallet" class="w-5 h-5 text-white"></i>
          </div>
          <h1 class="font-bold text-xl sm:text-2xl text-white tracking-tight">
            Cüzdanım
          </h1>
        </div>

        <!-- Sağ Üst: Küre İçinde Çark Ayarlar Butonu -->
        <div class="flex items-center">
          <button id="btn-open-settings" title="Ayarlar" class="sphere-settings-btn group" aria-label="Ayarlar">
            <i data-lucide="settings" class="w-5 h-5 text-purple-300 group-hover:text-white transition-transform duration-500"></i>
          </button>
        </div>

      </div>
    </header>
  `;
}
