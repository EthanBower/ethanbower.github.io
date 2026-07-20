"use client";

import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

const CardLayoutVariants: Variants = {
    initial: {
        opacity: 0,
        scale: 0.75,
        backdropFilter: "saturate(0%) blur(0px)",
    },
    whenVisible: {
        opacity: 1,
        scale: 1,
        backdropFilter: "saturate(450%) blur(0px)",
        transition: {
            type: "spring",
            stiffness: 180,
            damping: 12,
            mass: 0.7,
            delay: 1,
            when: "beforeChildren",
            delayChildren: 0.2,
        },
    }
};

type CardLayoutProps = {
    children: ReactNode;
}

export default function CardLayout({ children }: CardLayoutProps) {
    return (
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
            <motion.div
                variants={CardLayoutVariants}
                initial="initial"
                whileInView="whenVisible"
                viewport={{ once: true, amount: 0.2 }}
                className="rounded-2xl"
            >
                <div
                    className="
                        rounded-2xl
                        shadow-2xl 
                        shadow-black/40
                        group
                        relative
                        w-80
                        border 
                        border-white/15
                        bg-white/8
                        p-6
                        transition-all 
                        duration-300
                        hover:border-cyan-400/40
                        hover:bg-white/10
                        hover:shadow-[0_0_40px_rgba(34,211,238,0.15)]
                        dark:bg-white/5
                    ">
                    {children}
                </div>
            </motion.div>
        </motion.div>
    );
}