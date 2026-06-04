"use client";

import Image from "next/image";
import RotatingLoader from "../utilities/rotatingLoader";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const MINIMUM_LOAD_SCREEN_TIME = 2200;
const LOADING_TEXTS: string[] = [
    "Deploying the Rover...",
    "Calculating trajectory to the Milky Bone Galaxy...",
    "Aligning satellite dishes for maximum belly rubs...",
    "Checking the perimeter for space mailmen..."
];

type LoadingScreenProps = Readonly<{
    isEnabled: boolean;
    onCloseAnimationDone: () => void;
}>;

export default function LoadingScreen({ isEnabled, onCloseAnimationDone }: LoadingScreenProps) {
    const [isVisible, setIsVisible] = useState(true);
    const startTimeRef = useRef<number>(0);

    useEffect(() => {
        startTimeRef.current = performance.now();
    }, []);

    useEffect(() => {
        if (!isEnabled) return;

        const loadFinishDelta = performance.now() - startTimeRef.current;
        const timeRemaining = MINIMUM_LOAD_SCREEN_TIME - loadFinishDelta;

        if (timeRemaining <= 0) {
            setIsVisible(false);
            return;
        }

        const t = setTimeout(() => {
            setIsVisible(false);
        }, timeRemaining);

        return () => clearTimeout(t);
    }, [isEnabled]);

    return (
        <AnimatePresence onExitComplete={onCloseAnimationDone}>
            {isVisible && (
                <motion.div
                    className="absolute inset-0 bg-gradient-to-b from-black via-[#050816] to-black overflow-hidden z-1"
                    exit={{
                        y: ["0%", "9%", "-100%"],
                        filter: ["blur(0px)", "blur(0px)", "blur(16px)"],
                        borderTopRightRadius: ["0%", "10%", "20%"],
                        borderTopLeftRadius: ["0%", "10%", "20%"],
                        borderBottomLeftRadius: ["0%", "20%", "100%"],
                        borderBottomRightRadius: ["0%", "20%", "100%"],
                    }}
                    transition={{
                        times: [0, 0.6, 1],
                        ease: ["easeIn", [0.6, -0.28, 1.735, 10.045]],
                        duration: 0.8,
                    }}
                >
                    {/* nebula */}
                    <div
                        className="absolute inset-0 opacity-40 animate-pulse"
                        style={{
                            background:
                                "radial-gradient(circle at 30% 30%, #4f46e5 0%, transparent 45%), radial-gradient(circle at 80% 60%, #9333ea 0%, transparent 50%), radial-gradient(circle at 20% 100%, #f2a900 0%, transparent 50%)",
                        }}
                    />
                    {/* stars */}
                    <div
                        className="absolute inset-0 opacity-30"
                        style={{
                            backgroundImage:
                                "radial-gradient(1px 1px at 10px 20px, white, transparent), radial-gradient(1px 1px at 80px 90px, white, transparent)",
                            backgroundSize: "120px 120px",
                            animation: "drift 75s linear infinite",
                        }}
                    />
                    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center loader">
                        <motion.div
                            animate={{
                                y: [0, -6, 0, -3, 0],
                                rotate: [-2, 6, -18, 11, -2],
                                scale: [1, 1.1, 0.94, 1.2, 1],
                            }}
                            transition={{
                                duration: 3.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="w-[15%] min-w-[150px] max-w-[250px]"
                        >
                            <Image
                                src="./holly-face.svg"
                                width="20"
                                height="20"
                                alt=""
                                className="w-full h-auto"
                                loading="eager"
                            />
                        </motion.div>
                        <RotatingLoader textMessages={LOADING_TEXTS} />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
