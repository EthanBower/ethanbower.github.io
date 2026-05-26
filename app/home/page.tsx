"use client";

import { useEffect, useState } from "react";
import Permissions from "../../lib/components/home/permissions";
import SpaceScene from "@/lib/components/home/spaceScene";
import PopupWindow from "@/lib/components/global/popupWindow";
import { AppPermissions } from "@/lib/ts/appPermissions";

const WORK_IN_PROGRESS = () => {};

export default function Home() {
  const [permissionsPageEnabled, setPermissionsEnabled] = useState(false);
  const [enableAnimation, setAnimationEnabled] = useState(false);
  const disablePermissionsWindow = async () => {
    setPermissionsEnabled(false);
    setAnimationEnabled(true);
  };

  useEffect(() => {
    if (AppPermissions.gyroPermissions.gyroCompatible) {
      setPermissionsEnabled(true);
      return;
    }

    setAnimationEnabled(true);
  }, []);

  return (
    <main className="relative w-full h-screen">
      {
        permissionsPageEnabled && 
        <PopupWindow windowTitle="PERMISSIONS" onClose={disablePermissionsWindow}>
          <Permissions />
        </PopupWindow>
      }
      <SpaceScene onLoadingComplete={ WORK_IN_PROGRESS } isReadyToAnimate={ enableAnimation } />
    </main>
  );
}