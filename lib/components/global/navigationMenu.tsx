"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const navbarAnimationDelay = 1;

const containerVariants = {
  hidden: { },
  visible: {
    transition: {
      delayChildren: navbarAnimationDelay + 0.25,
      staggerChildren: 0.1,
      staggerDirection: 1,
    }
  }
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 18,
    },
  },
};

interface NavItem {
  label: string;
  icon: string;
  onClick: () => void;
}

interface NavbarItems {
  items: NavItem[];
} 

export default function Navbar({ items }: NavbarItems) {
  return (
    <motion.nav initial={{ y: 80, scale: 0.85 }} animate={{ y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 140, damping: 6, mass: 0.8, delay: navbarAnimationDelay }} className="fixed bottom-2 left-1/2 -translate-x-1/2 z-50 transform-gpu will-change-transform">
      <motion.div transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 5 }} animate={{ y: [0, -2, -1, -3, 0] }} >
          <motion.div initial="hidden" animate="visible" variants={containerVariants} className="flex items-center gap-8 px-8 py-3.5 rounded-full backdrop-blur-[8px] backdrop-saturate-180 shadow-[0_8px_32px_0_rgba(0,0,0,0.15),inset_0_1px_1px_0_rgba(255,255,255,0.3)] backdrop-blur-2xl bg-white/5 border-white/10" >
            {items.map((item) => {
              return (
                <motion.div key={item.label} variants={itemVariants} >
                  <motion.button onClick={item.onClick} whileHover={{ y: -4, scale: 1.08 }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 400, damping: 18 }} className="flex flex-col items-center gap-1 text-white/70 transition-colors" >
                    <Image src={item.icon} alt={item.label} width={24} height={24} className="transition-transform duration-500 ease-out group-hover:rotate-180" priority />
                    <span className="text-xs tracking-wide">{item.label}</span>
                  </motion.button>
                </motion.div>
              )})}; 
          </motion.div>
      </motion.div>  
    </motion.nav>
  );
}