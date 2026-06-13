import { motion } from "framer-motion";
import React from "react";
import { useSettings } from "../../providers/settingsProvider";
import { buttonStyles } from "@/src/styles/buttonStyles";

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
                ${buttonStyles.blue} p-4 w-26! p-3!
                flex flex-col items-center justify-center
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