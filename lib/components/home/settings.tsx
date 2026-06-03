"use client";

import { useSettings } from "../global/settingsProvider";
import PopupWindow from "../global/popupWindow";
import Slider from "../utilities/slider";
import { useState } from "react";
import { SceneController } from "@/lib/ts/threeScene";
import ButtonToggle from "../utilities/buttonToggle";
import GearIcon from "../icons/gear";
import ResetArrowsIcon from "../icons/resetArrows";
import { motion } from "framer-motion";

type SettingsProps = Readonly<{
    isEnabled: boolean;
    onClose: () => void;
}>;

export default function Settings({ isEnabled, onClose }: SettingsProps) {
    const { settings, setSettings, resetSettings } = useSettings();
    const [ currentDotCount, setCurrentDotCount ] = useState(SceneController.getInstance().frontPage!.dotScene.dots.length);

    // to-do make a callback on three js app to update the real dot count
    function changeDotCount(dotNumber: number) {
        setCurrentDotCount(dotNumber);
        setSettings((s) => ({
            ...s,
            dotCount: dotNumber
        }));
    }

    function toggleStats() {
        setSettings((s) => ({
            ...s,
            statsEnabled: !s.statsEnabled
        }));
    }

    // todo - in dot density section, make a 'warning' banner with yellow/orange background that has slanted stripes (like a construction sign) that says "Increasing dot density may impact performance on some devices" or something like that. Make it so that the warning only appears if the user has set the dot density above a certain number (maybe 1500 or 2000?).
    return (
        <PopupWindow windowIcon={<GearIcon />} windowTitle="SETTINGS" windowTitleDescription={`App Version: ${process.env.SITE_APP_VERSION || "dev-local"}`} isEnabled={isEnabled} onClose={onClose} >
            <div className="flex m-[5px] gap-2 items-center justify-center">
                <div className="flex-1">
                    <div className="flex items-center justify-center gap-2">
                        <span>Statistics {settings.statsEnabled ? "ON" : "OFF"}</span>
                        <ButtonToggle enabled={settings.statsEnabled} onChange={toggleStats} />
                    </div>
                </div>
                <div className="self-stretch w-[1px] rounded-xl bg-gray-300/30"/>
                <motion.button whileHover="hover" whileTap="hover" onClick={resetSettings} className="popup-button-blue m-[4px] flex-1 cursor-pointer" >
                    <div className="flex items-center justify-center gap-2">
                        <ResetArrowsIcon />
                        <span>Reset Cache</span>
                    </div>
                </motion.button>  
            </div>     
            <div className="h-[1px] rounded-xl my-3 w-full bg-gray-300/30" />
            <div className="m-[5px]">
                <div className="pb-[10px] text-center">
                    <p>DOT DENSITY: <b>{currentDotCount}</b> PARTICLES</p>
                    <p className="text-sm">Resizing window will set it back to auto-mode.</p>
                </div>
                <Slider onChange={changeDotCount} value={currentDotCount} />
            </div>
        </PopupWindow>
    );
}