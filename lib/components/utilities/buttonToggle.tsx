"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

const BUTTON_KNOB_TRAVEL_DISTANCE = 24;

type ButtonToggleProps = Readonly<{
  enabled: boolean;
  onChange: (enabledValue: boolean) => void;
}>;

export default function ButtonToggle({ enabled, onChange }: ButtonToggleProps) {
  const x = useMotionValue(0);

  const springX = useSpring(x, {
    stiffness: 500,
    damping: 18,
  });

  // base state
  useEffect(() => {
    x.set(enabled ? BUTTON_KNOB_TRAVEL_DISTANCE : 0);
  }, [enabled, x]);

  const handleHoverStart = () => {
    x.set(enabled ? BUTTON_KNOB_TRAVEL_DISTANCE - 5 : 5);
  };

  const handleHoverEnd = () => {
    x.set(enabled ? BUTTON_KNOB_TRAVEL_DISTANCE : 0);
  };

  return (
    <motion.button
      type="button"
      onClick={() => onChange(!enabled)}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      aria-pressed={enabled}
      animate={{
        backgroundColor: enabled
          ? "rgba(16, 185, 129, 0.5)"
          : "rgba(209, 213, 219, 0.3)",
      }}
      className="relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full p-0.5"
    >
      <motion.span
        style={{ x: springX }}
        className={`pointer-events-none inline-block h-7 w-7 rounded-full bg-white shadow-md 
          ${ enabled ? 'drop-shadow-[0_0_4px_rgba(255,255,255,0.9)]' : 'drop-shadow-[0_0_4px_rgba(255,255,255,0.0)]' }`}
      />
    </motion.button>
  );
}