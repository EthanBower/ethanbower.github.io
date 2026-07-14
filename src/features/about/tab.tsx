"use client";

import { glass } from "@/src/styles/surfaces";
import { motion, useAnimation, Variants } from "framer-motion";
import { useEffect, useState } from "react";

const TabBarVariants: Variants = {
    initial: {
        height: 0,
        width: "36rem",
    },
    enterTab: {
        height: "auto",
        width: "36rem",
        paddingBottom: 0,
        //backdropFilter: "blur(3px)",
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 140,
            damping: 18
        }
    },
    enterFullScreen: {
        height: "100dvh",
        width: "100%",
        paddingBottom: 0,
        //backdropFilter: "blur(0px)",
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 140,
            damping: 18,
        }
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
    },
    tabWiggle: {
        paddingBottom: ["10px", "0px", "10px"],
        scale: [1.02, 1, 1.02],
        transition: {
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 0,
            ease: "easeInOut",
        }
    },
    tabResetMaxPosition: {
        paddingBottom: "10px",
        scale: 1.02,
        transition: {
            type: "spring",
            stiffness: 250,
            damping: 18,
        },
    }
}

export default function Tab() {
    const [open, setOpen] = useState(false);
    const [hovered, setHovered] = useState(false);
    const controls = useAnimation();

    useEffect(() => {
        async function run() {
            if (open) { // If large window is open
                await controls.start("enterFullScreen");
                return;
            } else if (hovered) { // If large window not open, AND hovered over mini tab
                await controls.start("tabHover");
                return;
            } else { // If large window is not open, AND not hovered, then make sure tab is shrunken
                await controls.start('enterTab');
            }

            // Reset to max position for a smooth rebound to the wiggle animation
            await controls.start('tabResetMaxPosition');

            // Then begin the infinite wiggle
            controls.start('tabWiggle');
        }

        run();
    }, [open, hovered, controls]);

    return (
        <motion.div
            onClick={() => !open && (setOpen(true), setHovered(false))}
            onHoverStart={() => !open && setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            variants={TabBarVariants}
            whileTap={open ? "" : "tabClick"}
            initial="initial"
            animate={controls}
            className={`
                fixed
                bottom-0
                right-0
                left-1/2
                -translate-x-1/2
                text-white
                overflow-visible
                pointer-events-auto
                select-none
                z-1
                ${open ?
                    "border-none shadow-none bg-white/30 dark:bg-zinc-900/40 rounded-none" :
                    `border-t border-t-white/30 shadow-[0_0_30px_rgba(255,255,255,0.1)]! cursor-pointer rounded-t-3xl ${glass} `
                }
                `} >
            {!open ? (
                <motion.div
                    animate={{ y: [0, 4, 0] }}
                    transition={{
                        repeat: Infinity,
                        duration: 1.8,
                    }}
                    className="pt-3 text-center">
                    <div className="text-md tracking-[0.35em] text-white/70">
                        CLICK TO EXPLORE
                    </div>
                    <div className="mt-2 text-white/70 text-xl">
                        ↓
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    initial={{
                        opacity: 0,
                        scale: 0.96,
                        y: 20,
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                    }}
                    transition={{
                        delay: 0.5,
                        duration: 0.35,
                        ease: "easeOut",
                    }}
                    className="relative h-full w-full" >
                    <button
                        onClick={() => setOpen(false)}
                        className="
                            absolute
                            top-6
                            right-6
                            rounded-full
                            px-4
                            py-2
                            bg-white/10
                            hover:bg-white/20
                            z-1
                        ">
                        Close
                    </button>
                    <div className="absolute h-full w-full overflow-y-auto z-0">
                        <div className="flex flex-col gap-4 p-4">
                            {Array.from({ length: 50 }, (_, i) => (
                                <div key={i}>Item {i}</div>
                            ))}
                            Content goes here
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}