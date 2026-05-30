"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, Variants } from "framer-motion";

const ANIMATION_TIME_MS = 0.3;
const popupWindowBlurVariant: Variants = { hidden: { opacity: 0, filter: "blur(10px)" }, visible: { opacity: 1, filter: "blur(0px)" }, exit: { opacity: 0, filter: "blur(10px)" } };
const popupWindowScaleVariant: Variants = { hidden: { scale: 1.5, y: 0 }, visible: { scale: 1, y: 0 }, exit: { scale: 0.8, y: 0 } };

type PopupWindowProps = Readonly<{
    windowTitle: string;
    onClose: () => Promise<void> | void;
    children: React.ReactNode;
}>;

export default function PopupWindow({ windowTitle, onClose, children }: PopupWindowProps) {
    const [visible, setVisible] = useState(false);
    const [typedTitle, setTypedTitle] = useState("");
    const windowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let i = 0;

        const interval = setInterval(() => {
            if (i < windowTitle.length) {
                i++;
                setTypedTitle(windowTitle.slice(0, i));
                return;
            }
            clearInterval(interval);
        }, 80);

        return () => clearInterval(interval);
    }, [windowTitle]);

    useEffect(() => {
        requestAnimationFrame(() => setVisible(true));
    }, []);

    async function handleClose() {
        setVisible(false);
        await new Promise((r) => setTimeout(r, ANIMATION_TIME_MS * 1000));
        await onClose();
    }

    return (
        <div ref={windowRef} className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div className="z-10 pointer-events-auto" drag dragConstraints={windowRef} dragMomentum={true} dragElastic={0.02} whileDrag={{ scale: 1.03 }} >
                <motion.div className="popup-window shadow-2xl" variants={popupWindowBlurVariant} initial="hidden" animate={visible ? "visible" : "exit"} transition={{ duration: ANIMATION_TIME_MS }} >
                    <motion.div variants={popupWindowScaleVariant} initial="hidden" animate={visible ? "visible" : "exit"} transition={{ duration: ANIMATION_TIME_MS, ease: [0.16, 1, 0.3, 1] }} >
                        <div className="cursor-grab active:cursor-grabbing select-none flex items-center gap-4 p-4 pb-2">
                            <Image src="/double-arrow.svg" alt="Terminal Icon" width={24} height={24} priority />
                            <div className="flex flex-col text-left">
                                <h3 className="text-sm font-semibold text-white font-mono flex items-center gap-1">
                                    <span>{typedTitle}</span>
                                    <span className="animate-pulse">_</span>
                                </h3>
                                <p className="text-xs text-white/50 mt-0.5">
                                    For optimal experience, please grant motion permissions.
                                </p>
                            </div>
                        </div>
                        <div className="bg-black/25 m-1 p-3 rounded-xl">
                            {children}
                            <button onClick={handleClose} className="popup-button-red flex items-center justify-center gap-2" >
                                <Image src="/exit.svg" alt="Exit" width={24} height={24} />
                                <span>Exit Window</span>
                            </button>
                        </div>                    
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
}