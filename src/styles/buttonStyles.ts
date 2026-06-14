export const popupButtonBase =
  "w-full mt-[5px] mb-[5px] px-[4px] py-[6px] rounded-xl border cursor-pointer";
export const glassButtonBase =
  "rounded-xl border px-4 py-2 shadow-sm transition-colors cursor-pointer";
export const buttonStyles = {
  red: `${popupButtonBase} bg-red-800/40 text-red-200 border-red-500/40 hover:bg-red-700/50 hover:border-red-400/60 shadow-[0_0_20px_rgba(255,0,0,0.25)]`,
  blue: `${popupButtonBase} shadow-[0_0_12px_rgba(0,180,255,0.25)] bg-cyan-400/10 border-cyan-500/40 text-cyan-200 hover:bg-cyan-700/50 hover:border-cyan-400/60`,
  green: `${popupButtonBase} shadow-[0_0_12px_rgba(36,167,0,0.25)] bg-emerald-400/20 border-emerald-500/40 text-emerald-200 hover:bg-emerald-700/50 hover:border-emerald-400/60`,
  glass: `${glassButtonBase} border-neutral-300/30 bg-white/20 hover:bg-white/30 dark:border-neutral-400/30 dark:bg-black/25 dark:text-neutral-400 dark:hover:bg-black/40`,
  glassGreen: `${glassButtonBase} border-emerald-300/30 bg-emerald-500/50 hover:bg-emerald-600/50 text-emerald-100 dark:border-emerald-500/20 dark:bg-emerald-700/50 dark:hover:bg-emerald-800/50 dark:text-emerald-200`,
};
