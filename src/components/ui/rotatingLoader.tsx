"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import LoadingSpinner from "./loadingSpinner";

type RotatingLoaderProps = {
    textMessages: string[]
}

export default function RotatingLoader({ textMessages }: RotatingLoaderProps) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % textMessages.length);
        }, 1800);

        return () => clearInterval(timer);
    }, [textMessages]);

    return (
        <motion.div
            layout
            className="flex items-center gap-3 rounded-full px-4 py-2 border-2 
                border-gray-300 bg-white text-black
                dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            transition={{
                layout: { type: "spring", stiffness: 500, damping: 16 },
            }}
        >
            <LoadingSpinner />
            <div className="relative overflow-hidden">
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={index}
                        initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
                        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                        exit={{ y: -20, opacity: 0, filter: "blur(4px)" }}
                        transition={{
                            type: "spring",
                            stiffness: 600,
                            damping: 30,
                        }}
                    >
                        <p className="text-[clamp(0.875rem,1.3vw,1.45rem)] text-center whitespace-normal">
                            {textMessages[index]}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
