"use client";

import { animate, motion, useAnimation, useMotionValue, Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { transition } from "three/examples/jsm/tsl/display/TransitionNode.js";

const TabBarVariants: Variants = {
    initial: {
        y: 30
    },
    enterTab: {
        height: "auto",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 140,
            damping: 24,
        }
    },
    enterFullScreen: {
        height: "100dvh",
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 140,
            damping: 24,
        }
    },
    tabHover: {
        paddingBottom: "30px",
        transition: {
            type: "spring",
            stiffness: 140,
            damping: 24,
        }
    }
}

export default function Tab() {
    const [open, setOpen] = useState(false);

    return (
        <motion.div
            onClick={() => !open && setOpen(true)}
            variants={TabBarVariants}
            initial="initial"
            whileHover="tabHover"
            animate={open ? "enterFullScreen" : "enterTab"}
            className={`
                fixed
                bottom-0
                right-0
                left-1/2
                -translate-x-1/2
                w-full
                bg-black/30
                backdrop-blur-xl
                text-white
                ${open ? "border-none shadow-none" : "border-t border-t-white/30 shadow-[0_0_30px_rgba(255,255,255,0.2)]"}
                overflow-hidden
                pointer-events-auto
                z-50`} >
            {!open ? (
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center pt-3" >
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
                        ">
                        Close
                    </button>

                    <div className="flex h-full items-center justify-center">
                        Content goes here
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}