"use client";

import { useTransition } from "react";
import { AppPermissions } from "@/lib/ts/appPermissions";
import PopupWindow from "../global/popupWindow";
import { useSettings } from "../global/settingsProvider";
import ButtonToggle from "../utilities/buttonToggle";

type PermissionsProps = Readonly<{
  onClose: () => void;
}>;

export default function Permissions({ onClose }: PermissionsProps) {
  const [isPending, startTransition] = useTransition();
  const { settings, setSettings } = useSettings();

  const handleEnableGyro = async () => {
    // Prevent double clicks or running if already processing
    if (isPending) return;

    startTransition(async () => {
      await AppPermissions.askGyroPermissionsAsync();
      setSettings((s) => ({
          ...s,
          motionEnabled: AppPermissions.gyroPermissions.gyroscopeEnabled
      }));

      // todo - add a warning message that gyro was not enabled
    });
  };

  return (
    <PopupWindow windowIcon="/double-arrow.svg" windowTitle="PERMISSIONS" windowTitleDescription="For optimal experience, please grant motion permissions." onClose={onClose}>
      <div className="flex items-center justify-between gap-2">
        <span>{isPending ? "Activating..." : "Activate Motion"}</span>
        <ButtonToggle enabled={settings.motionEnabled} onChange={handleEnableGyro} />
      </div>
    </PopupWindow>
  );
}