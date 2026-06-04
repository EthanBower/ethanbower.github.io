"use client";

import Image from "next/image";

export default function Header() {
  // todo - tooltip on hover
  return (
    <header className="w-full relative z-1">
      <nav className="p-[5px]">
        <div className="flex items-center justify-center gap-2">
          <Image src="./github.svg" width={24} height={24} alt="" />
        </div>
      </nav>
    </header>
  );
}
