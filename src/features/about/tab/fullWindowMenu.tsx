"use client";

import ExitIcon from "@/src/components/icons/exit";
import { useNavigationMenuUI } from "@/src/providers/navigationMenuUIProvider";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { ReactNode, useEffect } from "react";

const FullWindowVariants: Variants = {
    initial: {
        opacity: 0,
        y: "8%",
        scale: 0.985,
        filter: "blur(8px)",
    },
    enter: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        transition: {
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
        },
    },
    exit: {
        opacity: 0,
        y: "5%",
        scale: 0.99,
        filter: "blur(6px)",
        transition: {
            duration: 0.28,
            ease: [0.4, 0, 1, 1],
        },
    },
};

type FullWindowMenuProps = {
    enable: boolean;
    onCloseComplete: () => void;
    onCloseClickEvent: () => void;
    children: ReactNode;
}

export default function FullWindowMenu({ enable, onCloseComplete, onCloseClickEvent, children }: FullWindowMenuProps) {
    const { setNavigationItems } = useNavigationMenuUI();

    useEffect(() => {
        if (!enable) return;

        setNavigationItems(prev => [...prev, {
            id: crypto.randomUUID(),
            label: "Close Window",
            icon: ExitIcon,
            isPersistent: false,
            addSeparator: true,
            selectQuery: () => true,
            selectedClassName: "outline outline-1 outline-black/30 dark:outline-white/30 bg-red-900/40 dark:bg-red-500/30 rounded-full",
            onClick: () => {
                onCloseClickEvent();
                setNavigationItems(prev => prev.filter(item => item.isPersistent));
            },
        }]);

        return () => setNavigationItems(prev => prev.filter(item => item.isPersistent));
    }, [enable, setNavigationItems])

    return (
        <AnimatePresence onExitComplete={onCloseComplete}>
            {enable && (
                <motion.div
                    variants={FullWindowVariants}
                    initial="initial"
                    animate="enter"
                    exit="exit"
                    className="
                        fixed 
                        inset-0 
                        w-screen 
                        h-screen 
                        z-1 
                        bg-[radial-gradient(circle_at_15%_15%,rgba(165,180,252,.35),transparent_40%),radial-gradient(circle_at_80%_25%,rgba(34,211,238,.18),transparent_35%),radial-gradient(circle_at_85%_80%,rgba(251,113,133,.22),transparent_45%),linear-gradient(180deg,#5B5B66,#3F3F46)]
                        dark:bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.15)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.12)_0%,transparent_60%),linear-gradient(180deg,#121214_0%,#0F0F11_100%)]
                    ">
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            backgroundImage: "url('/textures/noisy-background.png')",
                            backgroundRepeat: "repeat",
                            opacity: 0.4
                        }}
                    />
                    <div className="relative h-full w-full">
                        {children}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}