"use client";

import { motion } from "framer-motion";

export default function ChevronIcon() {
  return (
    <motion.svg
      width="26px"
      height="26px"
      viewBox=".4 -2.5 24 24"
      xmlns="http://www.w3.org/2000/svg"
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileTap="hover"
    >
      <motion.path
        d="M9.5 2.5a.75.75 0 00-1.06 0l-6 6a.75.75 0 000 1.06l6 6a.75.75 0 101.06-1.06L4.06 9l5.44-5.44a.75.75 0 000-1.06z"
        fill="#818CF8"
        stroke="#818CF8"
        strokeWidth="1"
        variants={{
          rest: {
            x: 0,
            opacity: 1,
          },
          hover: {
            x: -1.5,
            opacity: 1,
            transition: {
              type: "spring",
              stiffness: 600,
              damping: 18,
            },
          },
        }}
      />

      <g transform="translate(24 0) scale(-1 1)">
        <motion.path
          d="M9.5 2.5a.75.75 0 00-1.06 0l-6 6a.75.75 0 000 1.06l6 6a.75.75 0 101.06-1.06L4.06 9l5.44-5.44a.75.75 0 000-1.06z"
          fill="#818CF8"
          stroke="#818CF8"
          strokeWidth="1"
          variants={{
            rest: {
              x: 0,
              opacity: 1,
            },
            hover: {
              x: -1.5,
              opacity: 1,
              transition: {
                type: "spring",
                stiffness: 600,
                damping: 18,
              },
            },
          }} />
      </g>      
    </motion.svg>
  );
}

