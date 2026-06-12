"use client";

import { motion } from "framer-motion";

export default function ExitIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      className="overflow-visible"
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Box */}
      <motion.path
        d="M4 7.24802V7.2002C4 6.08009 4 5.51962 4.21799 5.0918C4.40973 4.71547 4.71547 4.40973 5.0918 4.21799C5.51962 4 6.08009 4 7.2002 4H16.8002C17.9203 4 18.4796 4 18.9074 4.21799C19.2837 4.40973 19.5905 4.71547 19.7822 5.0918C20 5.5192 20 6.07899 20 7.19691V16.8036C20 17.9215 20 18.4805 19.7822 18.9079C19.5905 19.2842 19.2837 19.5905 18.9074 19.7822C18.48 20 17.921 20 16.8031 20H7.19691C6.07899 20 5.5192 20 5.0918 19.7822C4.71547 19.5905 4.40973 19.2839 4.21799 18.9076C4 18.4798 4 17.9201 4 16.8V16.75"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ opacity: 1 }}
        variants={{
          hover: {
            scale: 0.93,
            opacity: 0.6,
          },
        }}
        transition={{
          duration: 0.25,
        }}
      />

      {/* Arrow shaft */}
      <motion.line
        x1="4"
        y1="12"
        x2="15"
        y2="12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        variants={{
          hover: {
            x: 4,
          },
        }}
        transition={{
          type: "spring",
          stiffness: 600,
          damping: 18,
        }}
      />

      {/* Arrow head */}
      <motion.path
        d="M12 15L15 12L12 9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={{
          hover: {
            x: 4,
            scale: 1.15,
          },
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 16,
        }}
      />
    </svg>
  );
}
