"use client";

import { glass } from "@/src/styles/surfaces";
import { AnimatePresence, motion, Variants } from "framer-motion";

const TabBarVariants: Variants = {
    initial: {
        y: "100%",
        scale: 0.9,
        opacity: 0,
    },
    enterTab: {
        y: 0,
        scale: 1,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 140,
            damping: 18,
            delay: .3
        }
    },
    exit: {
        y: "100%",
        opacity: 0,
    },
    tabHover: {
        paddingBottom: "20px",
        scale: 1.02,
        transition: {
            type: "spring",
            stiffness: 250,
            damping: 14,
        }
    },
    tabClick: {
        scaleX: 0.93,
        transition: {
            type: "spring",
            stiffness: 250,
            damping: 14,
        }
    }
}

type TabMenuProps = {
    enable: boolean;
    onCloseComplete: () => void;
    onTabClickEvent: () => void;
    tabCloseTitle: string;
}

export default function TabMenu({ enable, onCloseComplete, onTabClickEvent, tabCloseTitle }: TabMenuProps) {
    return (
        <AnimatePresence onExitComplete={onCloseComplete}>
            {enable && (
                <motion.div
                    variants={TabBarVariants}
                    onClick={onTabClickEvent}
                    initial="initial"
                    animate="enterTab"
                    whileHover="tabHover"
                    whileTap="tabClick"
                    exit="exit"
                    className={`
                        fixed
                        bottom-0
                        right-0
                        left-1/2
                        -translate-x-1/2
                        overflow-visible
                        z-1
                        border-t 
                        border-t-white/30 
                        shadow-[0_0_30px_rgba(255,255,255,0.1)]! 
                        cursor-pointer 
                        rounded-t-3xl 
                        max-w-[90%] 
                        ${glass}
                    `}>
                    <motion.div
                        animate={{
                            paddingBottom: ["10px", "0px", "10px"],
                            scale: [1.02, 1, 1.02],
                            transition: {
                                duration: 1.5,
                                repeat: Infinity,
                                repeatDelay: 0,
                                ease: "easeInOut",
                            }
                        }}>
                        <motion.div
                            animate={{ y: [0, 4, 0] }}
                            transition={{ repeat: Infinity, duration: 1.8 }}
                            className="pt-3 text-center">
                            <div className="text-md tracking-[0.35em] text-white/70">
                                {tabCloseTitle}
                            </div>
                            <div className="mt-2 text-white/70 text-xl">
                                ↓
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}