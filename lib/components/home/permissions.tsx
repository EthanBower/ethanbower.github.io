"use client";

import { useTransition } from "react";
import { AppPermissions } from "@/lib/ts/appPermissions";
import { SceneController } from "../../ts/threeScene";
import PopupWindow from "../global/popupWindow";

type PermissionsProps = Readonly<{
  onClose: () => void;
}>;

export default function Permissions({ onClose }: PermissionsProps) {
  const [isPending, startTransition] = useTransition();

  const handleClose = async () => {
    onClose();
  };

  const handleEnableGyro = async () => {
    // Prevent double clicks or running if already processing
    if (isPending) return;

    startTransition(async () => {
      await AppPermissions.enableGyroscopeAsync();

      const threeScene = SceneController.getInstance();
      if (!threeScene.ready) {
        alert("Scene is not yet ready...");
        return;
      }

      await threeScene.initGyro();
    });
  };

  return (
    <PopupWindow windowTitle="PERMISSIONS" onClose={handleClose}>
      <button onClick={handleEnableGyro} disabled={isPending} className="popup-button-blue disabled:opacity-50" >
        {isPending ? "Activating..." : "Activate Motion"}
      </button>
    </PopupWindow>
  );
}