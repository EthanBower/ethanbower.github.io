"use client";

import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

export const DEFAULT_CLASS = `
    rounded-2xl
    shadow-2xl 
    shadow-black/40
    group
    relative
    border 
    border-white/15
    p-5
    transition-all 
    duration-300
    hover:border-cyan-400/40
    hover:bg-white/10
    hover:shadow-[0_0_40px_rgba(34,211,238,0.15)]
    bg-white/10
    dark:bg-white/5`;
const CardLayoutVariants: Variants = {
    initial: (saturate: boolean) => ({
        opacity: 0,
        scale: 0.75,
        backdropFilter: saturate ? "saturate(0%) blur(0px)" : undefined,
    }),
    whenVisible: (saturate: boolean) => ({
        opacity: 1,
        scale: 1,
        backdropFilter: saturate ? "saturate(450%) blur(0px)" : undefined,
        transition: {
            type: "spring",
            stiffness: 180,
            damping: 12,
            mass: 0.7,
            delay: 1,
            when: "beforeChildren",
            delayChildren: 0.2,
        },
    })
};

type CardLayoutProps = {
    children: ReactNode;
    saturateBackground?: boolean;
    className?: string;
}

export default function CardLayout({ children, saturateBackground = true, className = DEFAULT_CLASS }: CardLayoutProps) {
    return (
        <motion.div
            whileHover={{
                scale: 1.02,
                transition: {
                    type: "spring",
                    stiffness: 180,
                    damping: 11,
                    mass: 0.7
                }
            }}>
            <motion.div
                variants={CardLayoutVariants}
                custom={saturateBackground}
                initial="initial"
                whileInView="whenVisible"
                viewport={{ once: true, amount: 0.2 }}
                className="rounded-2xl select-none"
            >
                <div className={className}>
                    {children}
                </div>
            </motion.div>
        </motion.div>
    );
}