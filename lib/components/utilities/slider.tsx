"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, Variants } from "framer-motion";

const fillVariants: Variants = {
  initial: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    boxShadow: "0 0 0px rgba(255, 255, 255, 0.6)"
  },
  hover: {
    backgroundColor: "rgba(255, 255, 255, 0.8)", 
    boxShadow: "0 0 3px rgba(255, 255, 255, 0.9), 0 0 5px rgba(255, 255, 255, 0.5)" 
  }
} as const;

const thumbVariants: Variants = {
  initial: {
    scale: 1,
    boxShadow: "0 0 0px rgba(255, 255, 255, 0.2)"
  },
  hover: {
    scale: 1.2, 
    boxShadow: "0 0 1px rgba(255, 255, 255, 1), 0 0 10px rgba(255, 255, 255, 0.6)" 
  }
} as const;

type DotControlProps = {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  onChange: (value: number) => void;
};

export default function Slider({ min = 0, max = 100, step = 1, value = 0, onChange }: DotControlProps) {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [currentValue, setCurrentValue] = useState(value);
    const progress = useMotionValue(currentValue);
    const last = useMotionValue(currentValue);
    const rawScaleX = useMotionValue(1);
    const rawScaleY = useMotionValue(1);
    const scaleX = useSpring(rawScaleX, { stiffness: 500, damping: 20 });
    const scaleY = useSpring(rawScaleY, { stiffness: 500, damping: 20 });
    const xPercent = useTransform(progress, [min, max], ["0%", "100%"]);

    function handleNewValue(newVal: number) {
        let speed = Math.abs(newVal - last.get());

        if (speed > 2) {
            speed = 2;
        }

        rawScaleX.set(1 + speed * 0.16);
        rawScaleY.set(1 - speed * 0.16);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            rawScaleX.set(1);
            rawScaleY.set(1);
        }, 80);

        last.set(newVal);
        setCurrentValue(newVal);
        progress.set(newVal);
        onChange(newVal);
    }

    return (
        <motion.div whileHover="hover" initial="initial" className="relative w-full h-10 flex items-center">
            {/* Track */}
            <div className="absolute w-full h-2.5 bg-white/10 rounded-full" />
            {/* Fill */}
            <motion.div variants={fillVariants} className="absolute h-2.5 bg-white/50 rounded-full" style={{ width: xPercent }} />
            {/* Thumb */}
            <motion.div 
                className="absolute w-6 h-6 rounded-full bg-white pointer-events-none" 
                variants={thumbVariants}
                style={{
                    left: xPercent,
                    x: "-50%",
                    scaleX,
                    scaleY
                }}
            />
            {/* This is invisible to allow custom styling above */}
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={currentValue}
                onChange={(e) => handleNewValue(Number(e.target.value))}
                className="absolute w-full h-full opacity-0 cursor-pointer"
            />
        </motion.div>
    );
}