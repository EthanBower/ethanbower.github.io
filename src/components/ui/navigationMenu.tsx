"use client";

import { glass } from "@/src/styles/surfaces";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { useState } from "react";

const navbarVariants: Variants = {
  initial: (position) => ({
    y: position === "Top" ? -120 : 120,
    scale: 0.8
  }),
  enter: {
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 140, damping: 6, mass: 0.8 },
  },
  exit: (position) => ({
    y: position === "Top" ? -150 : 150,
    scale: 0.85,
    transition: {
      type: "spring",
      stiffness: 180,
      damping: 22,
      mass: 0.8,
      delay: 0.5,
    },
  }),
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
  initial: (position) => ({
    opacity: 0,
    y: position === "Top" ? 20 : -20,
    scale: 0.95,
    filter: "blur(6px)"
  }),
  enter: (position) => ({
    opacity: 1,
    y: position === "Top" ? 45 : -45,
    scale: 1,
    filter: "blur(0px)"
  }),
  exit: (position) => ({
    opacity: 0,
    y: position === "Top" ? 20 : -20,
    scale: 0.95,
    filter: "blur(6px)"
  }),
} as const;

const itemVariants: Variants = {
  initial: (position) => ({
    opacity: 0,
    y: position === "Top" ? -35 : 35,
    scale: 0.5
  }),
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 18 },
  },
  exit: (position) => ({
    opacity: 0,
    y: position === "Top" ? -35 : 35,
    scale: 0.5,
    transition: { type: "spring", stiffness: 260, damping: 18 },
  }),
} as const;

type NavBarPosition = "Top" | "Bottom";

type NavItem = {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

type NavItemProp = NavItem & {
  position: NavBarPosition;
}

type NavbarProp = {
  items: NavItem[];
  position: NavBarPosition;
  enable: boolean;
}

export default function Navbar({ items, position, enable }: NavbarProp) {
  return (
    <AnimatePresence mode="wait">
      {enable && (
        <motion.nav
          key={position}
          variants={navbarVariants}
          custom={position}
          initial="initial"
          animate="enter"
          exit="exit"
          className={`
            fixed left-1/2 -translate-x-1/2 z-50 transform-gpu will-change-transform
            ${position === "Top" ? "top-3" : "bottom-3"}
          `}
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
                  position={position}
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

function NavItem({ label, icon, position, onClick }: NavItemProp) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="d-block relative flex flex-col items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        variants={toolTipVariants}
        custom={position}
        initial="initial"
        animate={isHovered ? "enter" : "initial"}
        exit="exit"
        className="absolute"
      >
        <div className={`${glass} text-white text-[10px] p-[5px] px-2.5 py-1 rounded-md whitespace-nowrap`}>
          <span className="text-xs tracking-wide">{label}</span>
        </div>
      </motion.div>
      <motion.div custom={position} variants={itemVariants}>
        <motion.button
          onClick={onClick}
          animate={isHovered ? { y: -4, scale: 1.08 } : { y: 0, scale: 1 }}
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
