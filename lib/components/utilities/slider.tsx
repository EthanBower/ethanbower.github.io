"use client";

import { useState } from "react";

type DotControlProps = {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  onChange: (value: number) => void;
};

export default function Slider({ min = 0, max = 100, step = 1, value = 0, onChange }: DotControlProps) {
    const [ currentValue, setCurrentValue ] = useState(value);

    function handleNewValue(newVal: number) {
        setCurrentValue(newVal);
        onChange(newVal);
    }

    return (
        <div className="relative w-full">
            {/* background track */}
            <div className="absolute top-1/2 w-full h-2.5 -translate-y-1/2 bg-white/10 blur-[1.5px] backdrop-blur-[3px] rounded-full" />
            {/* fill */}
            <div className="absolute top-1/2 h-2.5 -translate-y-1/2 bg-white/50 rounded-full blur-[1.5px] backdrop-blur-[3px]" style={{ width: `${((currentValue - min) / (max - min)) * 100}%` }} />
            {/* slider */}
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={currentValue}
                onChange={(e) => handleNewValue(Number(e.target.value))}
                className="
                    relative
                    z-10
                    w-full
                    h-2.5
                    rounded-full
                    appearance-none
                    cursor-pointer
                    bg-transparent
                    
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:h-8
                    [&::-webkit-slider-thumb]:w-8
                    /* White circle in the center, transparent on the outside */
                    [&::-webkit-slider-thumb]:bg-[radial-gradient(circle,rgba(255,255,255,1)_0%,rgba(255,255,255,1)_45%,rgba(255,255,255,0)_46%)]
                    [&::-webkit-slider-thumb]:drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]
                    [&::-webkit-slider-thumb]:transition
                    [&::-webkit-slider-thumb]:hover:scale-110 
                    [&::-webkit-slider-thumb]:rounded-full

                    [&::-moz-range-thumb]:appearance-none
                    [&::-moz-range-thumb]:h-11
                    [&::-moz-range-thumb]:w-11
                    [&::-moz-range-thumb]:bg-[radial-gradient(circle,rgba(255,255,255,1)_0%,rgba(255,255,255,1)_45%,rgba(255,255,255,0)_46%)]
                    [&::-moz-range-thumb]:drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]
                    [&::-moz-range-thumb]:border-0
                    [&::-moz-range-thumb]:transition
                    [&::-moz-range-thumb]:hover:scale-110 
                    [&::-moz-range-thumb]:rounded-full
                "/>
        </div>
    );
}