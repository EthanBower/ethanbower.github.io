"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { buttonStyles } from "@/src/styles/buttonStyles";

const buttonVariants: Variants = {
    hover: {
        scale: 1.05,
        boxShadow: "0px 0px 20px rgba(37, 37, 37, 0.5)",
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 12,
            mass: 0.6,
            layout: { type: "spring", stiffness: 300, damping: 25 }
        }
    },
    tap: {
        scale: 0.95,
        boxShadow: "0px 0px 20px rgba(66, 66, 66, 0.2)",
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 12,
            mass: 0.6,
            layout: { type: "spring", stiffness: 300, damping: 25 }
        }
    }
};

type Status = "init" | "loading" | "complete";

type StatefulButtonProps = {
    buttonStates: Record<Status, React.ReactNode>;
    buttonClassStates?: Record<Status, string>;
    onClick: () => void | Promise<void>;
}

const buttonClassDefaultStates: Record<Status, string> = {
    init: buttonStyles.glass,
    loading: buttonStyles.glass,
    complete: buttonStyles.glassGreen
}

export default function StatefulButton({ buttonStates, buttonClassStates = buttonClassDefaultStates, onClick }: StatefulButtonProps) {
    const [status, setStatus] = useState<Status>("init");

    async function handleClick() {
        if (status != "init") return;

        try {
            setStatus("loading");

            const start = Date.now();

            await onClick();

            const elapsed = Date.now() - start;
            const remaining = Math.max(0, 1000 - elapsed);

            await sleep(remaining);
            setStatus("complete");
            await sleep(1000);
        } finally {
            setStatus("init");
        }
    };

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    return (
        <div className="flex justify-center">
            <motion.button
                layout
                onClick={handleClick}
                variants={buttonVariants}
                whileTap="tap"
                whileHover="hover"
                className={`overflow-hidden ${buttonClassStates[status]}`}
                transition={{
                    layout: { type: "spring", stiffness: 400, damping: 23 },
                }}
            >
                <motion.div
                    key={status}
                    initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                    transition={{ duration: .25 }}
                    className="flex items-center justify-center"
                >
                    {buttonStates[status]}
                </motion.div>
            </motion.button>
        </div>
    );
}