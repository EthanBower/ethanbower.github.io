"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

type LevelDisplayProps = {
    level: number;
    maxLevel: number;
    startTicking: boolean;
}

export default function LevelDisplay({ level, maxLevel, startTicking }: LevelDisplayProps) {
    const [displayLevel, setDisplayLevel] = useState(0);

    useEffect(() => {
        if (startTicking) {
            if (displayLevel === 1) {
                setDisplayLevel(0);
            } else {
                setDisplayLevel(1);
            }
        }
    }, [startTicking, level]);

    return (
        <motion.span
            key={`container-${displayLevel}`}
            animate={{
                x: [0, -1, 1, -0.5, 0],
                y: [0, 1, -0.5, 0]
            }}
            transition={{ duration: 0.15, ease: "linear" }}
            className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300 inline-flex items-center overflow-hidden h-6 select-none"
        >
            <AnimatePresence>
                <motion.span
                    key={displayLevel}
                    initial={{
                        y: "50%",
                        scaleY: 1.4,
                        filter: "blur(2px)",
                        opacity: 0
                    }}
                    animate={{
                        y: 0,
                        scaleY: 1,
                        filter: "blur(0px)",
                        opacity: 1
                    }}
                    exit={{
                        y: "-50%",
                        scaleY: 0.7,
                        filter: "blur(1.5px)",
                        opacity: 0
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 900,
                        damping: 20,
                        mass: 0.25
                    }}
                    onAnimationComplete={() => {
                        if (startTicking && displayLevel < level) {
                            setDisplayLevel(displayLevel + 1);
                        }
                    }}
                    className="inline-block origin-center font-bold text-cyan-200"
                >
                    {displayLevel}
                </motion.span>
            </AnimatePresence>
            <span className="opacity-70 ml-0.5">/{maxLevel}</span>
        </motion.span>
    );
}