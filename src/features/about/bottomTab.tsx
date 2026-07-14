"use client";

import CloseButton from "@/src/components/ui/closeButton";
import { glass } from "@/src/styles/surfaces";
import { AnimatePresence, motion, useAnimation, Variants } from "framer-motion";
import { ReactNode, useEffect, useRef, useState } from "react";

const TabBarVariants: Variants = {
    initial: {
        height: 0,
        width: "36rem",
        scale: 0.9,
    },
    enterTab: {
        height: "auto",
        width: "36rem",
        paddingBottom: 0,
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

type BottomTabProps = {
    enable: boolean;
    onTabOpen?: () => void;
    onTabClose?: () => void;
    onCloseComplete: () => void;
    children: ReactNode;
}

export default function BottomTab({ enable, onCloseComplete, onTabOpen, onTabClose, children }: BottomTabProps) {
    const [open, setOpen] = useState(false);
    const [hovered, setHovered] = useState(false);
    const controls = useAnimation();
    const needsInitial = useRef(false);

    useEffect(() => {
        if (!enable) {
            needsInitial.current = false;
            return;
        };

        async function run() {
            // Set initial position below screen
            if (!needsInitial.current) {
                controls.set("initial");
                needsInitial.current = true;
            }

            // If an open needs to happen, open tab
            if (open) {
                await controls.start("enterFullScreen");
                return;
            }

            // If not open, then check if hovered
            if (hovered) {
                await controls.start("tabHover");
                return;
            }

            // If not opened, or hovered, then it must mean it needs to enter the tab
            // Then, set to common max position and wiggle indefinitely
            await controls.start("enterTab");
            await controls.start("tabResetMaxPosition");
            controls.start("tabWiggle");
        }

        run();
    }, [enable, open, hovered]);

    return (
        <AnimatePresence onExitComplete={onCloseComplete}>
            {enable && (
                <motion.div
                    onClick={() => !open && (setOpen(true), setHovered(false), onTabOpen?.())}
                    onHoverStart={() => !open && setHovered(true)}
                    onHoverEnd={() => setHovered(false)}
                    variants={TabBarVariants}
                    whileTap={open ? "" : "tabClick"}
                    animate={controls}
                    exit="initial"
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
                            `border-none shadow-none rounded-none 
                                bg-[radial-gradient(circle_at_30%_30%,rgba(79,70,229,.55)_0%,transparent_45%),radial-gradient(circle_at_80%_60%,rgba(147,51,234,.5)_0%,transparent_50%),radial-gradient(circle_at_20%_100%,rgba(242,169,0,.42)_0%,transparent_50%),linear-gradient(180deg,rgba(10,12,20,.96),rgba(3,5,10,.98))]
                                dark:bg-[radial-gradient(circle_at_30%_30%,rgba(79,70,229,.28)_0%,transparent_45%),radial-gradient(circle_at_80%_60%,rgba(147,51,234,.24)_0%,transparent_50%),radial-gradient(circle_at_20%_100%,rgba(242,169,0,.18)_0%,transparent_50%),linear-gradient(180deg,rgba(10,12,20,.96),rgba(3,5,10,.98))]` :
                            `border-t border-t-white/30 shadow-[0_0_30px_rgba(255,255,255,0.1)]! cursor-pointer rounded-t-3xl max-w-[90%] ${glass}`
                        }
                `} >
                    {!open ? (
                        <motion.div
                            animate={{ y: [0, 4, 0] }}
                            transition={{ repeat: Infinity, duration: 1.8 }}
                            className="pt-3 text-center">
                            <div className="text-md tracking-[0.35em] text-white/70">
                                CLICK TO EXPLORE
                            </div>
                            {/* todo - replace this with SVG */}
                            <div className="mt-2 text-white/70 text-xl">
                                ↓
                            </div>
                        </motion.div>
                    ) : (
                        <div className="relative h-full w-full">
                            <div className="absolute top-6 right-6 px-4 py-2 z-1">
                                <CloseButton onClick={() => (setOpen(false), onTabClose?.())}>
                                    Close
                                </CloseButton>
                            </div>
                            <div className="absolute h-full w-full overflow-y-auto z-0">
                                {children}
                            </div>
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence >
    );
}