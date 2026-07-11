"use client";

import { AnimatePresence, motion, Variants } from "framer-motion";

export const container: Variants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.25,
            delayChildren: 0.25,
        },
    },
    exit: {
        transition: {
            staggerChildren: 0.09,
            delayChildren: 0,
        },
    },
};

export const child: Variants = {
    hidden: {
        opacity: 0,
        scale: 0.3,
        y: 15,
    },
    show: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 120,
            damping: 9,
        },
    },
    exit: {
        opacity: 0,
        scale: 1.5,
        filter: "blur(2px)",
        transition: {
            type: "spring",
            stiffness: 800,
            damping: 50,
        },
    }
};

type HomeTitleProps = {
    enable: boolean;
    onExitAnimationComplete: () => void;
}

export default function HomeTitle({ enable, onExitAnimationComplete }: HomeTitleProps) {
    return (
        <AnimatePresence onExitComplete={onExitAnimationComplete}>
            {enable && (
                <motion.section
                    variants={container}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    className="pointer-events-none absolute inset-0 flex justify-center"
                >
                    <div className="flex flex-col items-center mt-3">
                        <motion.h1 variants={child} className="text-center font-mono text-5xl font-bold tracking-[0.18em] text-white drop-shadow-[0_0_18px_rgba(34,211,238,0.25)] sm:text-7xl">
                            ETHAN BOWER
                        </motion.h1>
                        <motion.p variants={child} className="mt-3 text-center font-mono text-cyan-300 tracking-[0.25em] uppercase">
                            Lead Full Stack Engineer
                        </motion.p>
                        <motion.div variants={child} className="mt-3 flex items-center gap-5">
                            <div className="h-px w-20 bg-cyan-400/50" />
                            <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
                            <div className="h-px w-20 bg-cyan-400/50" />
                        </motion.div>
                    </div>
                </motion.section>
            )}
        </AnimatePresence>
    );
}