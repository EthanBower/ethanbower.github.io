"use client";

import ExitIcon from "@/src/components/icons/exit";
import { animationVariants } from "@/src/components/utils/globals";
import { useNavigationMenuUI } from "@/src/providers/navigationMenuUIProvider";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { ReactNode, useEffect } from "react";

const FullWindowVariants: Variants = {
    initial: {
        y: "100%"
    },
    enter: {
        y: 0,
        transition: {
            type: "spring",
            stiffness: 250,
            damping: 14,
            delay: .3
        }
    },
    exit: {
        y: "100%",
        transition: {
            type: "spring",
            stiffness: 250,
            damping: 14,
        }
    }
}

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
            icon: ExitMenuIcon,
            isPersistent: false,
            selectQuery: () => false,
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
                    className={`
                        fixed
                        inset-0
                        w-screen
                        h-screen
                        z-1
                        bg-[radial-gradient(circle_at_30%_30%,rgba(79,70,229,.55)_0%,transparent_45%),radial-gradient(circle_at_80%_60%,rgba(147,51,234,.5)_0%,transparent_50%),radial-gradient(circle_at_20%_100%,rgba(242,169,0,.42)_0%,transparent_50%),linear-gradient(180deg,rgba(10,12,20,.96),rgba(3,5,10,.98))]
                        dark:bg-[radial-gradient(circle_at_30%_30%,rgba(79,70,229,.28)_0%,transparent_45%),radial-gradient(circle_at_80%_60%,rgba(147,51,234,.24)_0%,transparent_50%),radial-gradient(circle_at_20%_100%,rgba(242,169,0,.18)_0%,transparent_50%),linear-gradient(180deg,rgba(10,12,20,.96),rgba(3,5,10,.98))]
                    `}>
                    <div className="relative h-full w-full">
                        <div className="absolute h-full w-full overflow-y-auto z-0">
                            {children}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// todo - move this
function ExitMenuIcon() {
    return (
        <motion.div
            variants={animationVariants.buttonVariant}
            whileHover="hover"
            whileTap={["hover", "tap"]}
            className={`text-red-500`} >
            <ExitIcon />
        </motion.div>
    );
}