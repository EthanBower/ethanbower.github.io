"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const KEYBOARD_LAYOUT = "abcdefghijklmnopqrstuvwxyz";
const cursorVariants = {
  blinking: {
    opacity: 0.5,
    transition: {
      duration: 0.8,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
} as const;

interface TypewriterProps {
  text: string;
  minSpeed?: number;
  maxSpeed?: number;
  typoChance?: number;
  onDone?: () => void;
  className?: string;
}

export default function Typewriter({ text, minSpeed = 40, maxSpeed = 105, typoChance = 0.1, onDone, className = "" }: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  if (minSpeed > maxSpeed) {
    throw new Error(`Min speed of '${minSpeed}' cannot be greater than max speed of '${maxSpeed}'.`);
  }

  if (typoChance > 1) {
    throw new Error(`Typo chance of '${typoChance}' cannot be greater than 1.`);
  }

  useEffect(() => {
    // Stop if we finished typing
    if (index >= text.length && !isDeleting) {
      onDone?.();
      return;
    }

    let timeoutId: NodeJS.Timeout;
    let currentSpeed = Math.floor(Math.random() * (maxSpeed - minSpeed + 1)) + minSpeed;

    // Pause longer on punctuation
    if (
      index > 0 &&
      [".", ",", "!", "?"].includes(text[index - 1]) &&
      !isDeleting
    ) {
      currentSpeed += 400; // Explicit pause for dramatic effect
    }

    const shouldMakeTypo =
      Math.random() < typoChance &&
      !isDeleting &&
      index > 2 &&
      index < text.length - 2;

    if (shouldMakeTypo) {
      const randomChar =
        KEYBOARD_LAYOUT[Math.floor(Math.random() * KEYBOARD_LAYOUT.length)];

      // Inject the wrong character and then schedule a quick deletion
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplayedText((prev) => prev + randomChar);
      timeoutId = setTimeout(() => {
        setIsDeleting(true);
      }, currentSpeed + 150);

      return () => clearTimeout(timeoutId);
    }

    // Handle Deleting the Typo
    if (isDeleting) {
      timeoutId = setTimeout(() => {
        setDisplayedText((prev) => prev.slice(0, -1));
        setIsDeleting(false);
      }, 100);

      return () => clearTimeout(timeoutId);
    }

    // Normal typing
    timeoutId = setTimeout(() => {
      setDisplayedText(text.slice(0, index + 1));
      setIndex((prev) => prev + 1);
    }, currentSpeed);

    return () => clearTimeout(timeoutId);
  }, [index, isDeleting, text]);

  return (
    <span className={`inline-flex items-center justify-center ${className}`}>
      <span>
        {displayedText}
        <motion.span
          variants={cursorVariants}
          animate="blinking"
          className="inline-block w-[3px] h-[1em] ml-[2px] bg-current vertical-middle align-middle"
        />
      </span>
    </span>
  );
}
