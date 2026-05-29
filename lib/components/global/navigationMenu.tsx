"use client";

import Image from "next/image";

interface NavItem {
  label: string;
  icon: string;
  onClick: () => void;
}

interface NavbarItems {
  items: NavItem[];
}

export default function Navbar({ items }: NavbarItems) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-6 flex items-center justify-center">
      <div className="m-[15px] p-[5px] bg-white/15 border border-slate-600 rounded-[30px] backdrop-blur-[6px] backdrop-saturate-180 animate-slide-up shadow-[0_8px_32px_0_rgba(0,0,0,0.15),inset_0_1px_1px_0_rgba(255,255,255,0.3)]">
        <ul className="flex m-[12px] gap-8 text-sm font-medium text-slate-300 items-center">
          {items.map((item) => (
            <li key={item.label}>
              <a href="#home" className="flex flex-col items-center gap-1 group" onClick={item.onClick}>
                <Image src={item.icon} alt={item.label} width={24} height={24} className="transition-transform duration-500 ease-out group-hover:rotate-180" priority />
                <span className="text-[9px] tracking-wider text-slate-300 group-hover:text-slate-350 transition-colors">
                  {item.label}
                </span>                       
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}