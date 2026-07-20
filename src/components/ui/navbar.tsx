"use client";

import { MenuPosition, NavItem, useNavigationMenuUI } from "@/src/providers/navigationMenuUIProvider";
import { glass } from "@/src/styles/surfaces";
import { AnimatePresence, motion, Variants } from "framer-motion";
import React from "react";
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
};

const toolTipVariants: Variants = {
  initial: (position) => ({
    opacity: 0,
    y: 0,
    scale: 0.95,
    filter: "blur(6px)"
  }),
  enter: (position) => ({
    opacity: 1,
    y: position === "Top" ? 15 : -15,
    scale: 1,
    filter: "blur(0px)"
  }),
  exit: (position) => ({
    opacity: 0,
    y: 0,
    scale: 0.95,
    filter: "blur(6px)"
  }),
};

const itemVariants: Variants = {
  initial: ({ position, index, totalItems }) => ({
    opacity: 0,
    y: position === "Top" ? -35 : 35,
    scale: 0.5
  }),
  enter: ({ position, index, totalItems }) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 18,
      delay: 0.25 + index * 0.1
    },
  }),
  exit: ({ position, index, totalItems }) => ({
    opacity: 0,
    y: position === "Top" ? -35 : 35,
    scale: 0.5,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 18,
      delay: (totalItems - 1 - index) * 0.1
    },
  }),
};

type NavbarItemProp = Omit<NavItem, "isPersistent" | "id" | "selectQuery"> & {
  position: MenuPosition;
  selectQueryActive: boolean;
}

export default function Navbar() {
  const { menuOpen, menuPosition, navigationItems } = useNavigationMenuUI();

  return (
    <AnimatePresence mode="wait">
      {menuOpen && (
        <div
          key={menuPosition}
          className={`fixed left-1/2 -translate-x-1/2 z-50 inset-x-0 flex justify-center
            ${menuPosition === "Top" ? "top-3" : "bottom-3"}`}>
          <motion.nav
            variants={navbarVariants}
            custom={menuPosition}
            initial="initial"
            animate="enter"
            exit="exit"
            className="will-change-transform"
          >
            <motion.div
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 5,
              }}
              animate={{ y: [0, 3, 2, 4, 0] }}
            >
              <div className={`flex items-center gap-1 px-4 py-2 rounded-full ${glass}`}>
                <AnimatePresence mode="popLayout">
                  {navigationItems.map((item, index) => (
                    <motion.div
                      layout
                      key={item.id}
                      variants={itemVariants}
                      custom={{
                        position: menuPosition,
                        index: index,
                        totalItems: navigationItems.length
                      }}
                    >
                      <NavbarItem
                        label={item.label}
                        icon={item.icon}
                        position={menuPosition}
                        onClick={item.onClick}
                        selectQueryActive={item.selectQuery()}
                        addSeparator={item.addSeparator}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.nav>
        </div>
      )}
    </AnimatePresence>
  );
}

const NavbarItem = React.memo(
  function NavbarItem({ label, icon, position, onClick, selectQueryActive, addSeparator }: NavbarItemProp) {
    const [isHovered, setIsHovered] = useState(false);
    const IconComponent = icon;

    return (
      <div className="relative flex flex-col items-center">
        <motion.div
          variants={toolTipVariants}
          custom={position}
          initial="initial"
          animate={isHovered ? "enter" : "initial"}
          exit="exit"
          className={`absolute left-1/2 -translate-x-1/2 pointer-events-none ${position === "Top" ? "top-full" : "bottom-full"}`}      >
          <div className={`${glass} text-white text-[10px] p-[5px] px-2.5 py-1 rounded-md whitespace-nowrap`}>
            <span className="text-xs tracking-wide">{label}</span>
          </div>
        </motion.div>
        <div className="flex h-full items-center">
          {addSeparator && (
            <div className="w-[1px] mx-1 self-stretch bg-black/20 dark:bg-white/20" />
          )}
          <motion.div
            animate={isHovered ? { y: -4, scale: 1.08 } : { y: 0, scale: 1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
            style={{ transform: "translateZ(0)" }}
          >
            <motion.div
              className={`flex flex-col items-center cursor-pointer px-3.5 py-2
            ${selectQueryActive ? "outline outline-1 outline-black/30 dark:outline-white/30 bg-slate-700/30 dark:bg-slate-300/20 rounded-full" : "bg-none"}
          `}
              onClick={onClick}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <IconComponent />
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  });
