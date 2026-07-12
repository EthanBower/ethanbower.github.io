"use client";

import { motion, Variants } from "framer-motion";
import { useState } from "react";

const TabBarVariants: Variants = {
    initial: {
        height: 0,
        width: "36rem",
    },
    enterTab: {
        height: "auto",
        width: "36rem",
        paddingBottom: 0,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
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
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
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
        scaleX: 0.94,
        transition: {
            type: "spring",
            stiffness: 250,
            damping: 14,
        }
    }
}

export default function Tab() {
    const [open, setOpen] = useState(false);
    const [hovered, setHovered] = useState(false);

    return (
        <motion.div
            onClick={() => !open && (setOpen(true), setHovered(false))}
            onHoverStart={() => !open && setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            variants={TabBarVariants}
            whileTap={open ? "" : "tabClick"}
            initial="initial"
            animate={[
                open ? "enterFullScreen" : "enterTab",
                hovered ? "tabHover" : ""
            ]}
            className={`
                fixed
                bottom-0
                right-0
                left-1/2
                -translate-x-1/2
                bg-black
                text-white
                overflow-hidden
                pointer-events-auto
                select-none
                z-50
                ${open ?
                    "border-none shadow-none" :
                    `border-t border-t-white/30 shadow-[0_0_30px_rgba(255,255,255,0.1)] cursor-pointer`
                }
                `} >
            {!open ? (
                <motion.p className="text-center pt-3" >
                    Explore
                </motion.p>
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
                        delay: 0.25,
                        duration: 0.35,
                        ease: "easeOut",
                    }}
                    className="relative h-full w-full" >
                    <button
                        onClick={(e) => { e.stopPropagation(); setOpen(false) }}
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