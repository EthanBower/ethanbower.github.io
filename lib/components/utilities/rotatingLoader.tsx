"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

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
    }, []);

    return (
        <motion.div
            layout
            className="flex items-center gap-3 rounded-full border-2 border-gray-300 bg-white px-4 py-2 text-black"
            transition={{
                layout: { type: "spring", stiffness: 500, damping: 16 },
            }}
        >
            <div className="relative h-6 w-6 animate-spin">
                <div className="absolute inset-0 rounded-full border-2 border-gray-200" />
                <div className="absolute inset-0 rounded-full">
                    <div className="h-full w-full rounded-full border-2 border-transparent border-t-blue-500 opacity-80" />
                </div>
                <div className="absolute inset-0 rounded-full rotate-45">
                    <div className="h-full w-full rounded-full border-2 border-transparent border-t-purple-500 opacity-40" />
                </div>
            </div>
            <div className="relative overflow-hidden">
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={index}
                        initial={{ y: 20, opacity: 0, filter: "blur(5px)" }}
                        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                        exit={{ y: -20, opacity: 0, filter: "blur(5px)" }}
                        transition={{
                            type: "spring",
                            stiffness: 600,
                            damping: 30,
                        }}
                    >
                        <p className="text-[clamp(0.875rem,1.3vw,1.5rem)] text-center whitespace-normal">
                            {textMessages[index]}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
