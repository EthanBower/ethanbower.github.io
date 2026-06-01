"use client";

import { useState } from "react";

type SliderProps = {
  items: React.ReactNode[];
};

export default function Carousel({ items }: SliderProps) {
  const [index, setIndex] = useState(0);
  const prev = () => { setIndex((i) => (i === 0 ? items.length - 1 : i - 1)); };
  const next = () => { setIndex((i) => (i === items.length - 1 ? 0 : i + 1)); };

  return (
    <div className="relative w-full max-w-3xl mx-auto overflow-hidden">
      <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${index * 100}%)` }} >
        {items.map((item, i) => (
          <div key={i} className="min-w-full flex justify-center">
            {item}
          </div>
        ))}
      </div>
      <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-2 rounded-full">
        ←
      </button>
      <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-2 rounded-full">
        →
      </button>
      <div className="flex justify-center gap-2 mt-3">
        {items.map((_, i) => (
          <button key={i} onClick={() => setIndex(i)} className={`h-2 w-2 rounded-full transition-all ${ i === index ? "bg-black w-4" : "bg-gray-400" }`} />
        ))}
      </div>
    </div>
  );
}