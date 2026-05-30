"use client";

import { useSettings } from "../global/settingsProvider";
import PopupWindow from "../global/popupWindow";
import { getVersion } from "@/lib/ts/compileTimeSettings";

type SettingsProps = Readonly<{
  onClose: () => void;
}>;

export default function Settings({ onClose }: SettingsProps) {
    const { settings, setSettings, resetSettings } = useSettings();

    function toggleStats() {
        setSettings((s) => ({
            ...s,
            statsEnabled: !s.statsEnabled
        }))
    }

    return (
        <PopupWindow windowIcon="/settings-gear.svg" windowTitle="SETTINGS" windowTitleDescription={`App Version: ${getVersion()}`} onClose={onClose} >
            <button onClick={toggleStats} className="popup-button-blue disabled:opacity-50" >
                { settings.statsEnabled ? "Turn Off Statistics" : "Turn On Statistics"}
            </button>
            <button className="popup-button-blue disabled:opacity-50" >
                Change Dot Count
            </button>
            <button onClick={resetSettings} className="popup-button-blue disabled:opacity-50" >
                Clear Cache
            </button>
        </PopupWindow>
    );
}