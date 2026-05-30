"use client";

import { useTransition } from "react";
import { AppPermissions } from "@/lib/ts/appPermissions";
import PopupWindow from "../global/popupWindow";
import { useSettings } from "../global/settingsProvider";

type PermissionsProps = Readonly<{
  onClose: () => void;
}>;

export default function Permissions({ onClose }: PermissionsProps) {
  const [isPending, startTransition] = useTransition();
  const { setSettings } = useSettings();

  const handleClose = async () => {
    onClose();
  };

  const handleEnableGyro = async () => {
    // Prevent double clicks or running if already processing
    if (isPending) return;

    startTransition(async () => {
      await AppPermissions.askGyroPermissionsAsync();
      setSettings((s) => ({
          ...s,
          motionEnabled: AppPermissions.gyroPermissions.gyroCompatible
      }));
    });
  };

  return (
    <PopupWindow windowIcon="/double-arrow.svg" windowTitle="PERMISSIONS" windowTitleDescription="For optimal experience, please grant motion permissions." onClose={handleClose}>
      <button onClick={handleEnableGyro} disabled={isPending} className="popup-button-blue disabled:opacity-50" >
        {isPending ? "Activating..." : "Activate Motion"}
      </button>
    </PopupWindow>
  );
}