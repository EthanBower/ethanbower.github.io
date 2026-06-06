import { motion } from "framer-motion";
import React from "react";
import { useSettings } from "../global/settingsProvider";

interface PerformanceButtonProps {
    presetName: string,
    performanceNumber: number,
    icon: React.ReactNode
    onClick: (performanceNumber: number) => void
}

export default function PerformanceButton({ presetName, performanceNumber, icon, onClick }: PerformanceButtonProps) {
    const { settings } = useSettings();

    return (
        <motion.button
            onClick={() => onClick(performanceNumber)}
            className={`
                popup-button-blue relative overflow-hidden rounded-xl p-4
                border transition-all duration-300 w-26! p-3!
                flex flex-col text-center items-center justify-center
                ${settings.performance === performanceNumber ? "!bg-cyan-700/50 !border-cyan-400/60" : ""}
            `}
            whileHover="hover"
            initial="initial"
        >
            {icon}
            <span>
                {presetName}
            </span>
        </motion.button>
    );
}