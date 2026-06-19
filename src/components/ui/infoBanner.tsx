"use client";

import { AnimatePresence, motion, Variants } from "framer-motion";
import React from "react";
import { animationVariants } from "../utils/globals";

const windowVariants: Variants = {
    initial: {
        opacity: 0,
        y: -80,
        scale: 0.92,
    },
    enter: {
        opacity: 1,
        y: 0,
        scale: 1,
    }
}

type InfoBannerProps = {
    enable: boolean;
    flashingTitle: string;
    title: string;
    onClose: () => void;
    children: React.ReactNode;
}

export default function InfoBanner({ enable, title, flashingTitle, onClose, children }: InfoBannerProps) {
    return (
        <AnimatePresence>
            {enable &&
                <div className="absolute w-full flex justify-center z-99 pointer-events-none select-none">
                    <motion.div
                        variants={windowVariants}
                        initial="initial"
                        animate="enter"
                        exit="initial"
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 18,
                            mass: 0.9,
                        }}
                        className="m-0 max-w-md sm:m-0"
                    >
                        <motion.div
                            whileHover={{
                                scale: 1.01,
                                boxShadow: "0px 0px 40px rgba(34, 211, 238, 0.15)",
                            }}
                            transition={{ duration: 0.15 }}
                        >
                            <motion.div
                                animate={{
                                    backgroundPosition: [
                                        "0% 50%",
                                        "100% 50%",
                                        "0% 50%",
                                    ],
                                }}
                                transition={{
                                    duration: 20,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                                className="
                                    p-6
                                    rounded-b-2xl
                                    border 
                                    border-cyan-400/20
                                    bg-black/90
                                    bg-[linear-gradient(120deg,rgba(59,130,246,.3),rgba(168,85,247,.3),rgba(34,197,94,.3),rgba(59,130,246,.3))]
                                    bg-[length:300%_300%]
                                    pointer-events-auto
                                "
                            >
                                <div className="mb-2 flex items-center gap-2 animate-pulse">
                                    <div className="h-2 w-2 rounded-full bg-cyan-400" />
                                    <span className="font-mono text-xs tracking-widest text-cyan-300">
                                        {flashingTitle}
                                    </span>
                                </div>
                                <h2 className="mb-3 text-xl font-semibold text-white/80">
                                    {title}
                                </h2>
                                <div className="text-white/70 max-h-50 w-full overflow-y-scroll break-words">
                                    {children}
                                </div>
                                <motion.button
                                    className="
                                        rounded-lg
                                        border 
                                        border-cyan-400/70
                                        px-4 
                                        py-2
                                        mt-5
                                        text-white/80
                                        bg-cyan-400/50
                                        hover:bg-cyan-400/80
                                        cursor-pointer
                                    "
                                    onClick={onClose}
                                    variants={animationVariants.buttonVariant}
                                    whileTap="tap"
                                    whileHover="hover"
                                >
                                    Acknowledge
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            }
        </AnimatePresence>
    );
}