"use client";

import { useState } from "react";
import Permissions from "../../lib/components/home/permissions";
import SpaceScene from "@/lib/components/home/spaceScene";
import PopupWindow from "@/lib/components/global/popupWindow";
import { AppPermissions } from "@/lib/ts/appPermissions";

export default function Home() {
  const [permissionsPageEnabled, setPermissionsEnabled] = useState(false);
  const [enableAnimation, setAnimationEnabled] = useState(false);

  const disablePermissionsWindow = async () => {
    setPermissionsEnabled(false);
    setAnimationEnabled(true);
  };

  const handleLoadingComplete = () => {
    if (AppPermissions.gyroPermissions.gyroCompatible) {
      setPermissionsEnabled(true);
    } else {
      setAnimationEnabled(true);
    }
  };

  return (
    <main className="relative w-full h-screen bg-black">
      { permissionsPageEnabled && (
        <PopupWindow windowTitle="PERMISSIONS" onClose={disablePermissionsWindow}>
          <Permissions />
        </PopupWindow>
      )}
      <SpaceScene onLoadingComplete={handleLoadingComplete} isReadyToAnimate={enableAnimation} />
    </main>
  );
}