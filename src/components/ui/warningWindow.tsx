import { AnimatePresence, motion, useDragControls, Variants } from "framer-motion";
import ExitIcon from "../icons/exit";
import { useEffect, useRef } from "react";
import WarningIcon from "../icons/warning";
import { buttonStyles } from "@/src/styles/buttonStyles";
import WarningBackground from "./warningBackground";
import { yellowWindowGlow } from "@/src/styles/windows";

const windowVariants: Variants = {
    initial: {
        opacity: 0,
        scale: 0.85,
        filter: "blur(12px)",
        y: 20,
    },
    enter: {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        y: 0,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 25,
        },
    },
    exit: {
        opacity: 0,
        scale: 0.9,
        filter: "blur(8px)",
        y: 10,
        transition: {
            duration: 0.2,
            ease: "easeIn",
        },
    },
} as const;

type WarningWindowProps = Readonly<{
    error?: Error | null;
    enable: boolean;
    consoleLogError?: boolean;
    onClose?: () => void;
}>;

export default function WarningWindow({ error, enable, consoleLogError = true, onClose }: WarningWindowProps) {
    const dragControls = useDragControls();
    const windowRef = useRef<HTMLDivElement>(null);
    const errorTitle = error ? error.message : "";
    const errorSubtitle = error?.cause instanceof Error ? error.cause.message : "";

    useEffect(() => {
        if (consoleLogError && enable) {
            console.error("An error has occurred.", error);
        }
    }, [consoleLogError, enable, error]);

    return (
        <AnimatePresence>
            {enable && (
                <div className="absolute inset-0 flex items-center justify-center w-[100dvw] h-[100dvh] select-none z-99" ref={windowRef}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 z-0 bg-black/60 backdrop-blur-[3px] pointer-events-auto"
                    >
                        <div className="absolute inset-0 opacity-[0.2] dark:opacity-[0.08] bg-[linear-gradient(to_right,#eab308_1px,transparent_1px),linear-gradient(to_bottom,#eab308_1px,transparent_1px)] bg-[size:4rem_4rem]" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.8)_100%)]" />
                    </motion.div>
                    <motion.div
                        className="absolute z-1 w-full sm:justify-normal sm:w-auto sm:h-auto sm:max-w-[90vw] sm:max-h-[min(90vh,900px)]"
                        drag
                        dragListener={false}
                        dragControls={dragControls}
                        dragConstraints={windowRef}
                        dragMomentum={true}
                        dragElastic={0.05}
                    >
                        <motion.div
                            layout
                            className={`
                                ${yellowWindowGlow}
                                relative w-[inherit] h-auto max-h-full overflow-hidden rounded-xl backdrop-blur-[3px] 
                                bg-black/0 dark:bg-black/40`}
                            variants={windowVariants}
                            initial="initial"
                            animate="enter"
                            exit="exit"
                        >
                            <WarningBackground>
                                <div className="relative">
                                    <div className="flex self-center gap-4 pt-4 px-3 cursor-grab active:cursor-grabbing" onPointerDown={(e) => dragControls.start(e)}>
                                        <div className="flex items-center">
                                            <WarningIcon />
                                        </div>
                                        <div className="flex flex-col flex-1 text-left justify-center">
                                            <h3 className="text-yellow-300 tracking-widest font-mono font-bold">
                                                SYSTEM ALERT
                                            </h3>
                                            <div className="relative w-full h-6 overflow-hidden border-y border-yellow-500/20 my-1">
                                                <motion.div
                                                    className="absolute inset-y-0 left-0 flex items-center whitespace-nowrap text-[10px] font-mono tracking-[0.3em] text-yellow-300/60"
                                                    animate={{
                                                        x: ["0%", "-50%"],
                                                    }}
                                                    transition={{
                                                        duration: 25,
                                                        ease: "linear",
                                                        repeat: Infinity,
                                                    }}
                                                >
                                                    SYSTEM FAILURE • SYSTEM FAILURE • SYSTEM FAILURE • SYSTEM FAILURE •
                                                    SYSTEM FAILURE • SYSTEM FAILURE • SYSTEM FAILURE • SYSTEM FAILURE •
                                                </motion.div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="py-6 px-3 text-left">
                                        <p className="text-yellow-100">
                                            {errorTitle}
                                        </p>
                                        <p className="mt-3 text-yellow-100/60 text-sm">
                                            {errorSubtitle}
                                        </p>
                                        <div className="mt-6 flex gap-3">
                                            <motion.button
                                                className={`${buttonStyles.red} flex items-center justify-center gap-2`} onClick={() => onClose?.()}
                                                whileHover="hover"
                                                whileTap="hover"
                                            >
                                                <ExitIcon />
                                                <span>Exit</span>
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </WarningBackground>
                        </motion.div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
