"use client";

import { AnimatePresence, motion } from "framer-motion";

type HomeTitleProps = {
    enable: boolean;
    onExitAnimationComplete: () => void;
}

export default function HomeTitle({ enable, onExitAnimationComplete }: HomeTitleProps) {
    return (
        <AnimatePresence onExitComplete={onExitAnimationComplete}>
            {enable && (
                <motion.section
                    initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                    exit={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{
                        type: "spring",
                        stiffness: 120,
                        damping: 20,
                    }}
                    className="pointer-events-none absolute inset-0 flex justify-center"
                >
                    <div className="flex flex-col items-center mt-3">
                        <h1 className="text-center font-mono text-5xl font-bold tracking-[0.18em] text-white drop-shadow-[0_0_18px_rgba(34,211,238,0.25)] sm:text-7xl">
                            ETHAN BOWER
                        </h1>
                        <p className="mt-3 text-center font-mono text-cyan-300 tracking-[0.25em] uppercase">
                            Lead Full Stack Engineer
                        </p>
                        <div className="mt-3 flex items-center gap-5">
                            <div className="h-px w-20 bg-cyan-400/50" />
                            <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
                            <div className="h-px w-20 bg-cyan-400/50" />
                        </div>
                    </div>
                </motion.section>
            )}
        </AnimatePresence>
    );
}