"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TextScrambleProps {
  text: string;
  className?: string;
  duration?: number;
}

const GLYPHS =
  "ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz1234567890@#$%&*{[}]";

export default function TextScramble({
  text,
  className = "",
  duration = 1.5,
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    let frameId: number;
    const startTime = Date.now();
    const durationMs = duration * 1000;

    const scrambleLoop = () => {
      const timeElapsed = Date.now() - startTime;
      const progress = Math.min(timeElapsed / durationMs, 1);
      const revealIndex = Math.floor(text.length * progress);
      const scrambled = text
        .split("")
        .map((char, index) => {
          if (char === " ") return " ";
          if (index < revealIndex) return char;
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
        .join("");

      setDisplayText(scrambled);

      if (progress < 1) {
        frameId = requestAnimationFrame(scrambleLoop);
      } else {
        setDisplayText(text);
      }
    };

    frameId = requestAnimationFrame(scrambleLoop);

    return () => cancelAnimationFrame(frameId);
  }, [text, duration]);

  return (
    <span className="relative inline-block">
      {/* The invisible text is used to prevent layout shifts during scrambling */}
      <span className="invisible">{text}</span>
      <motion.span
        className={`absolute inset-0 font-mono tracking-wide ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {displayText}
      </motion.span>
    </span>
  );
}
