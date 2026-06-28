"use client";

import { useEffect, useState, useTransition } from "react";
import PopupWindow from "../../components/ui/popupWindow";
import { useSettings } from "../../providers/settingsProvider";
import ButtonToggle from "../../components/ui/buttonToggle";
import ChevronIcon from "../../components/icons/chevron";
import { AppPermissions } from "@/src/components/utils/appPermissions";
import WarningWindow from "@/src/components/ui/warningWindow";
import PopupItem from "@/src/components/ui/popupItem";

type PermissionsProps = Readonly<{
  onClose: () => void;
}>;

export default function Permissions({ onClose }: PermissionsProps) {
  const [error, setError] = useState<Error | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { settings, setSettings } = useSettings();

  async function handleEnableGyro() {
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

  function permissionsNeeded() {
    if (AppPermissions.gyroPermissions.gyroCompatible && !settings.motionEnabled) {
      return true;
    }

    return false;
  }

  function closePermissions() {
    setEnabled(false);
    onClose();
  }

  useEffect(() => {
    if (!permissionsNeeded()) {
      closePermissions();
      return;
    }

    setEnabled(true);
  }, []);

  return (
    <>
      <PopupWindow
        windowIcon={<ChevronIcon />}
        windowTitle="PERMISSIONS"
        windowTitleDescription="For optimal experience, please grant motion permissions."
        isEnabled={enabled}
        onClose={closePermissions}
      >
        <PopupItem>
          <div className="flex items-center justify-between gap-2">
            <span>{isPending ? "Activating..." : "Activate Motion"}</span>
            <ButtonToggle
              enabled={settings.motionEnabled}
              onChange={handleEnableGyro}
            />
          </div>
        </PopupItem>
      </PopupWindow>
      <WarningWindow error={error} enable={error != null} onClose={() => setError(null)} />
    </>
  );
}
