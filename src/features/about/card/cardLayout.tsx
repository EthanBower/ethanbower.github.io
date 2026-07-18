"use client";

import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

const CardLayoutVariants: Variants = {
    initial: {
        opacity: 0,
        scale: 0.75,
    },
    whenVisible: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 180,
            damping: 12,
            mass: 0.7,
            delay: 1,
            when: "beforeChildren",
            delayChildren: 0.2
        },
    }
};

type CardLayoutProps = {
    children: ReactNode;
}

export default function CardLayout({ children }: CardLayoutProps) {
    return (
        <motion.div
            variants={CardLayoutVariants}
            initial="initial"
            whileInView="whenVisible"
            viewport={{ once: true, amount: 0.2 }}
        >
            <motion.div
                whileHover={{
                    scale: 1.05,
                    transition: {
                        type: "spring",
                        stiffness: 180,
                        damping: 6,
                        mass: 0.7
                    }
                }}>
                <div
                    className="
                        group
                        relative
                        w-80
                        rounded-2xl
                        border border-white/10
                        bg-slate-600/60
                        dark:bg-slate-900/60
                        p-6
                        duration-300
                        hover:border-cyan-400/40
                        hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]
                    ">
                    {children}
                </div>
            </motion.div>
        </motion.div>
    );
}