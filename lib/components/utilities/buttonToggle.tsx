"use client";

type ButtonToggleProps = Readonly<{
  enabled: boolean;
  onChange: (enabledValue : boolean) => void;
}>;

export default function ButtonToggle({ enabled, onChange }: ButtonToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      aria-pressed={enabled}
      className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-300 ease-in-out focus:outline-none ${
        enabled ? "bg-emerald-500/50" : "bg-gray-300/30"
      }`} >
      <span className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-md ring-0 transition duration-300 ease-in-out ${enabled ? "translate-x-6" : "translate-x-0" }`}/>
    </button>
  );
}