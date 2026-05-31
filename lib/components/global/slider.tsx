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
        <div>
            <div>
                <p>Dot Count: {currentValue}</p>
                <p>Note: Resizing window will set it back to auto-mode.</p>
            </div>
            <div className="relative w-full">
                {/* background track */}
                <div className="absolute top-1/2 w-full h-2 -translate-y-1/2 bg-white/10 rounded-full" />
                {/* fill */}
                <div className="absolute top-1/2 h-2 -translate-y-1/2 bg-white rounded-full" style={{ width: `${((currentValue - min) / (max - min)) * 100}%` }} />
                {/* slider */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={currentValue}
                    onChange={(e) => handleNewValue(Number(e.target.value))}
                    className="
                    w-full
                    h-2
                    rounded-full
                    appearance-none
                    cursor-pointer
                    bg-white/10
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:h-5
                    [&::-webkit-slider-thumb]:w-5
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-white
                    [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(255,255,255,0.8)]
                    [&::-webkit-slider-thumb]:transition
                    [&::-webkit-slider-thumb]:hover:scale-110
                    " />
            </div>
        </div>
    );
}