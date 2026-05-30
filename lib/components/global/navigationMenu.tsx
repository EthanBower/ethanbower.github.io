"use client";

import Image from "next/image";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { useState } from "react";

const navbarVariants: Variants = {
  initial: { y: 120, scale: .8 },
  enter: { y: 0, scale: 1, transition: { type: "spring", stiffness: 140, damping: 6, mass: 0.8 } },
  exit: { y: 150, scale: 0.85, transition: { type: "spring", stiffness: 180, damping: 22, mass: 0.8, delay: .5 } }
};

const containerVariants: Variants = {
  enter: { transition: { delayChildren: 0.25, staggerChildren: 0.1, staggerDirection: 1 } },
  exit: { transition: { delayChildren: 0.25, staggerChildren: 0.1, staggerDirection: -1 } }
};

const toolTipVariants: Variants = {
  initial: { opacity: 0, y: 0, scale: 0.95, filter: "blur(10px)" },
  enter: { opacity: 1, y: -43, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, y: 0, scale: 0.95, filter: "blur(10px)" }
};

const itemVariants: Variants = {
  enter: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 18, } },
  exit: { opacity: 0, y: 30, scale: 0.8, transition: { type: "spring", stiffness: 260, damping: 18 } }
};

interface NavItem {
  label: string;
  icon: string;
  onClick: () => void;
}

interface NavbarItems {
  items: NavItem[];
  closeFlag: boolean;
} 

// todo - unmount once closed
export default function Navbar({ items, closeFlag }: NavbarItems) {
  const currentVariant = closeFlag ? "exit" : "enter";

  return (
    <motion.nav variants={navbarVariants} initial="exit" animate={currentVariant} transition={{ delay: closeFlag ? 1: 0 }} className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 transform-gpu will-change-transform">
      <motion.div transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 5 }} animate={{ y: [0, -2, -1, -3, 0] }} >
          <motion.div variants={containerVariants} initial="initial" animate={currentVariant} className="flex items-center gap-8 px-8 py-4 rounded-full backdrop-blur-[8px] backdrop-saturate-180 shadow-[0_8px_32px_0_rgba(0,0,0,0.15),inset_0_1px_1px_0_rgba(255,255,255,0.3)] backdrop-blur-2xl bg-white/5 border-white/10" >
            {items.map((item) => <NavItem key={item.label} label={item.label} icon={item.icon} onClick={item.onClick} />)} 
          </motion.div>
      </motion.div>  
    </motion.nav>
  );
}

function NavItem({ label, icon, onClick }: NavItem) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative flex flex-col items-center" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} >
      <AnimatePresence>
        {isHovered && (
          <motion.div variants={toolTipVariants} initial="initial" animate="enter" exit="exit" className="absolute" >
            <div className="bg-black/60 text-white text-[10px] p-[5px] px-2.5 py-1 rounded-md border border-white/10 backdrop-blur-md whitespace-nowrap shadow-lg">
              <span className="text-xs tracking-wide">{label}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div variants={itemVariants} >
        <motion.button onClick={onClick} whileHover={{ y: -4, scale: 1.08 }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 400, damping: 18 }} className="flex flex-col items-center gap-1 text-white/70 transition-colors" >
          <Image src={icon} alt={label} width={24} height={24} className="transition-transform duration-500 ease-out group-hover:rotate-180" priority />
        </motion.button>
      </motion.div>
    </div> 
  )
}