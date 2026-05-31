"use client";

import { useSettings } from "../global/settingsProvider";
import PopupWindow from "../global/popupWindow";
import Slider from "../global/slider";
import { useState } from "react";
import { SceneController } from "@/lib/ts/threeScene";

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
            <button onClick={toggleStats} className={`${ settings.statsEnabled ? "popup-button-green" : "popup-button-blue" } disabled:opacity-50`} >
                { settings.statsEnabled ? "Turn Off Statistics" : "Turn On Statistics"}
            </button>
            <div>
                <div>
                    <p>Dot Count: {currentDotCount}</p>
                    <p>Note: Resizing window will set it back to auto-mode.</p>
                </div>
                <Slider onChange={changeDotCount} value={currentDotCount}></Slider>
            </div>
            <button onClick={resetSettings} className="popup-button-blue disabled:opacity-50" >
                Clear Cache
            </button>
        </PopupWindow>
    );
}