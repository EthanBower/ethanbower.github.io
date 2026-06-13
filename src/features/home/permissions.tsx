"use client";

import { useState, useTransition } from "react";
import PopupWindow from "../../components/ui/popupWindow";
import { useSettings } from "../../providers/settingsProvider";
import ButtonToggle from "../../components/ui/buttonToggle";
import ChevronIcon from "../../components/icons/chevron";
import { AppPermissions } from "@/src/components/utils/appPermissions";
import WarningWindow from "@/src/components/ui/warningWindow";

type PermissionsProps = Readonly<{
  isEnabled: boolean;
  onClose: () => void;
}>;

export default function Permissions({ isEnabled, onClose }: PermissionsProps) {
  const [error, setError] = useState<Error | null>(null);
  const [isPending, startTransition] = useTransition();
  const { settings, setSettings } = useSettings();

  const handleEnableGyro = async () => {
    // Prevent double clicks or running if already processing
    if (isPending) return;

    startTransition(async () => {
      try {
        await AppPermissions.askGyroPermissionsAsync();
        setSettings((s) => ({
          ...s,
          motionEnabled: AppPermissions.gyroPermissions.gyroscopeEnabled,
        }));
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        }

        setError(new Error("An error occurred setting motion controls.", { cause: err }));
      }
    });
  };

  return (
    <div>
      <PopupWindow
        windowIcon={<ChevronIcon />}
        windowTitle="PERMISSIONS"
        windowTitleDescription="For optimal experience, please grant motion permissions."
        isEnabled={isEnabled}
        onClose={onClose}
      >
        <div className="flex items-center justify-between gap-2 m-[5px] bg-black/25 p-3 rounded-xl">
          <span>{isPending ? "Activating..." : "Activate Motion"}</span>
          <ButtonToggle
            enabled={settings.motionEnabled}
            onChange={handleEnableGyro}
          />
        </div>
      </PopupWindow>
      <WarningWindow error={error} enable={error != null} onClose={() => setError(null)} />
    </div>
  );
}
