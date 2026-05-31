"use client";

import { useSettings } from "../global/settingsProvider";
import PopupWindow from "../global/popupWindow";
import { getVersion } from "@/lib/ts/compileTimeSettings";
import Slider from "../global/slider";
import { useState } from "react";
import { SceneController } from "@/lib/ts/threeScene";

type SettingsProps = Readonly<{
  onClose: () => void;
}>;

export default function Settings({ onClose }: SettingsProps) {
    const { settings, setSettings, resetSettings } = useSettings();
    const [ dotCountThreeJs ] = useState(SceneController.getInstance().frontPage!.dotScene.dots.length);

    // to-do make a callback on three js app to update the real dot count
    function changeDotCount(dotNumber: number) {
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
        <PopupWindow 
            windowIcon="/settings-gear.svg" 
            windowTitle="SETTINGS" 
            windowTitleDescription={`App Version: ${getVersion()}`} 
            onClose={onClose} >
            <button onClick={toggleStats} className="popup-button-blue disabled:opacity-50" >
                { settings.statsEnabled ? "Turn Off Statistics" : "Turn On Statistics"}
            </button>
            <Slider onChange={changeDotCount} value={dotCountThreeJs}></Slider>
            <button onClick={resetSettings} className="popup-button-blue disabled:opacity-50" >
                Clear Cache
            </button>
        </PopupWindow>
    );
}