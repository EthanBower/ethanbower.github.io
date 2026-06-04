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
    "Checking the perimeter for space mailmen...",
    "Chasing shooting stars across the vacuum...",
    "Calibrating the Sub-Woofer propulsion system...",
    "Fueling warp drive engines with maximum zoomies...",
    "Scanning the cosmic horizon for signs of treats...",
    "Preparing astronauts for emergency ear scratches...",
    "Charging solar panels via strategic sunbeam naps...",
    "Entering low-Earth orbit to retrieve the stick...",
    "Analyzing Martian soil samples for buried bones...",
    "Adjusting space helmet for floppy-ear aerodynamics...",
    "Transmitting data back to Mission Control (the kitchen)...",
    "Navigating asteroid fields with high-speed tail wags...",
    "Securing the payload (a collection of tennis balls)...",
    "Initializing zero-gravity belly rub sequence...",
    "Stoking the dark matter furnace with kibble...",
    "Tuning frequency scanners to detect treat crinkles...",
    "Bypassing the main mainframe for extra head pats...",
    "Deflecting space vacuum cleaners from the hull...",
    "Initiating final countdown: 3... 2... 1... BARK OFF!",
    "Lost in space (spotted a very shiny squirrel)...",
    "Consulting the Big Dipper for water bowl locations...",
    "Entering deep hyper-sleep (just a quick 14-hour nap)..."
];

type LoadingScreenProps = Readonly<{
    isEnabled: boolean;
    onCloseAnimationDone: () => void;
}>;

export default function LoadingScreen({ isEnabled, onCloseAnimationDone }: LoadingScreenProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [randomizedTexts, setRandomizedTexts] = useState<string[]>(LOADING_TEXTS);
    const startTimeRef = useRef<number>(0);

    useEffect(() => {
        setRandomizedTexts(shuffleArray(LOADING_TEXTS));
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
                        y: ["0%", "60%", "-100%"],
                        filter: ["blur(0px)", "blur(15px)", "blur(20px)"],
                        borderTopRightRadius: ["0%", "50%", "50%"],
                        borderTopLeftRadius: ["0%", "50%", "50%"],
                        borderBottomLeftRadius: ["0%", "50%", "50%"],
                        borderBottomRightRadius: ["0%", "50%", "50%"],
                        scaleX: [1, 0.4, 0.4],
                        scaleY: [1, 0.7, 0.7]
                    }}
                    transition={{
                        times: [0, 0.6, 1],
                        ease: ["easeIn", [0.6, -0.28, 1.735, 10.045]],
                        duration: 0.55,
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
                        <RotatingLoader textMessages={randomizedTexts} />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
    }

    return shuffled;
}