"use client";

import { motion } from "framer-motion";
import { ReactNode, useState } from "react";

type WarningBackgroundProps = {
    className?: string;
    runIntro?: boolean;
    children: ReactNode;
}

export default function WarningBackground({ runIntro = true, className, children }: WarningBackgroundProps) {
    const [introDone, setIntroDone] = useState(!runIntro);

    return (
        <motion.div
            className={`
                ${className}
                bg-[length:101.82px_101.82px]
                bg-[repeating-linear-gradient(-45deg,rgba(255,204,0,0.4)_0px,rgba(255,204,0,0.4)_36px,transparent_36px,transparent_72px)] 
                dark:bg-[repeating-linear-gradient(-45deg,rgba(255,204,0,0.2)_0px,rgba(255,204,0,0.2)_36px,transparent_36px,transparent_72px)]`}
            animate={{
                backgroundPositionX: introDone ? ["0px", "101.82px"] : ["0px", "203.64px"],
            }}
            transition={
                introDone ?
                    {
                        duration: 8,
                        ease: "linear",
                        repeat: Infinity,
                    } : {
                        duration: 1.5,
                        ease: "easeOut",
                    }
            }
            onAnimationComplete={() => {
                if (!introDone) setIntroDone(true);
            }}
        >
            {children}
        </motion.div>
    );
}