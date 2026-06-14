import React from "react";
import { useSettings } from "../../providers/settingsProvider";
import { buttonStyles } from "@/src/styles/buttonStyles";
import StatefulButton from "@/src/components/ui/statefulButton";
import LoadingSpinner from "@/src/components/ui/loadingSpinner";
import CheckMark from "@/src/components/icons/checkMark";

const BUTTON_FLEX = "flex flex-col gap-1 items-center justify-center";

interface PerformanceButtonProps {
    presetName: string,
    performanceNumber: number,
    icon: React.ReactNode
    onClick: (performanceNumber: number) => void
}

export default function PerformanceButton({ presetName, performanceNumber, icon, onClick }: PerformanceButtonProps) {
    const { settings } = useSettings();

    return (
        <StatefulButton
            buttonStates={{
                init: (
                    <div className={BUTTON_FLEX}>
                        {icon}
                        <span>
                            {presetName}
                        </span>
                    </div>
                ),
                loading: (
                    <div className={BUTTON_FLEX}>
                        <LoadingSpinner />
                        <span>Setting graphics...</span>
                    </div>),
                complete: (
                    <div className={BUTTON_FLEX}>
                        <CheckMark />
                        <span>Success!</span>
                    </div>
                )
            }}
            buttonClassStates={{
                init: (
                    `${buttonStyles.blue} p-4 w-26! p-3! ${settings.performance === performanceNumber ? "!bg-cyan-700/50 !border-cyan-400/60" : ""}`
                ),
                loading: buttonStyles.glass,
                complete: (
                    `${buttonStyles.glassGreen} p-4 w-26! p-3!`
                ),
            }}
            onClick={() => onClick(performanceNumber)} />
    );
}