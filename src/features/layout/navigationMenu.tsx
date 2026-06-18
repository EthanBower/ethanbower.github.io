"use client";

import { glass } from "@/src/styles/surfaces";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { useState } from "react";

const navbarVariants: Variants = {
  initial: { y: 120, scale: 0.8, transition: { delay: 1 } },
  enter: {
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 140, damping: 6, mass: 0.8 },
  },
  exit: {
    y: 150,
    scale: 0.85,
    transition: {
      type: "spring",
      stiffness: 180,
      damping: 22,
      mass: 0.8,
      delay: 0.5,
    },
  },
} as const;

const containerVariants: Variants = {
  enter: {
    transition: {
      delayChildren: 0.25,
      staggerChildren: 0.1,
      staggerDirection: 1,
    },
  },
  exit: {
    transition: {
      delayChildren: 0.25,
      staggerChildren: 0.1,
      staggerDirection: -1,
    },
  },
} as const;

const toolTipVariants: Variants = {
  initial: { opacity: 0, y: -20, scale: 0.95, filter: "blur(6px)" },
  enter: { opacity: 1, y: -45, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, y: -20, scale: 0.95, filter: "blur(6px)" },
} as const;

const itemVariants: Variants = {
  initial: { opacity: 0, y: 35, scale: 0.5 },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 18 },
  },
  exit: {
    opacity: 0,
    y: 35,
    scale: 0.5,
    transition: { type: "spring", stiffness: 260, damping: 18 },
  },
} as const;

interface NavItem {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

interface NavbarProp {
  items: NavItem[];
  isNavbarClosed: boolean;
}

export default function Navbar({ items, isNavbarClosed }: NavbarProp) {
  return (
    <AnimatePresence>
      {!isNavbarClosed && (
        <motion.nav
          variants={navbarVariants}
          initial="initial"
          animate="enter"
          exit="exit"
          className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 transform-gpu will-change-transform"
        >
          <motion.div
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 5,
            }}
            animate={{ y: [0, -3, -2, -4, 0] }}
          >
            <motion.div
              variants={containerVariants}
              className={`flex items-center gap-8 px-8 py-4 rounded-full ${glass}`}
            >
              {items.map((item) => (
                <NavItem
                  key={item.label}
                  label={item.label}
                  icon={item.icon}
                  onClick={item.onClick}
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

function NavItem({ label, icon, onClick }: NavItem) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="d-block relative flex flex-col items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        variants={toolTipVariants}
        initial="initial"
        animate={isHovered ? "enter" : "initial"}
        exit="exit"
        className="absolute"
      >
        <div className={`${glass} text-white text-[10px] p-[5px] px-2.5 py-1 rounded-md whitespace-nowrap`}>
          <span className="text-xs tracking-wide">{label}</span>
        </div>
      </motion.div>
      <motion.div variants={itemVariants}>
        <motion.button
          onClick={onClick}
          whileHover={{ y: -4, scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 18 }}
          style={{ transform: "translateZ(0)" }}
          className="flex flex-col items-center gap-1 text-white/70 transition-colors cursor-pointer"
        >
          {icon}
        </motion.button>
      </motion.div>
    </div>
  );
}
