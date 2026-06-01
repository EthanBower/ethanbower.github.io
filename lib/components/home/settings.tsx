"use client";

import { useSettings } from "../global/settingsProvider";
import PopupWindow from "../global/popupWindow";
import Slider from "../global/slider";
import { useState } from "react";
import { SceneController } from "@/lib/ts/threeScene";
import Image from "next/image";
import ButtonToggle from "../global/buttonToggle";

type SettingsProps = Readonly<{
  onClose: () => void;
}>;

export default function Settings({ onClose }: SettingsProps) {
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

    return (
        <PopupWindow windowIcon="/settings-gear.svg" windowTitle="SETTINGS" windowTitleDescription={`App Version: ${process.env.SITE_APP_VERSION || "dev-local"}`} onClose={onClose} >
            <div className="flex m-[5px] gap-2">
                <div className="flex-1">
                    <div className="flex items-center justify-center gap-2">
                        <span>Enable Statistics</span>
                        <ButtonToggle enabled={settings.statsEnabled} onChange={toggleStats} />
                    </div>
                </div>
                <div className="w-[1px] rounded-xl bg-gray-300/30" />
                <button onClick={resetSettings} className="popup-button-blue m-[4px] flex-1" >
                    <div className="flex items-center justify-center gap-2">
                        <Image src="/reset-arrows.svg" alt="" width={24} height={24} className="flex"/>
                        <span>Reset Cache</span>
                    </div>
                </button>
            </div>     
            <div className="h-[1px] rounded-xl my-3 w-full bg-gray-300/30" />
            <div className="m-[5px]">
                <div>
                    <p className="text-center">DOT DENSITY: <b>{currentDotCount}</b> particles</p>
                    <p className="text-sm">Resizing or refreshing window will set it back to auto-mode.</p>
                </div>
                <Slider onChange={changeDotCount} value={currentDotCount}></Slider>
            </div>
        </PopupWindow>
    );
}