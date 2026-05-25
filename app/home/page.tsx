"use client";

import { useEffect, useState } from "react";
import Permissions from "../../lib/components/home/permissions";
import SpaceScene from "@/lib/components/home/spaceScene";
import PopupWindow from "@/lib/components/global/popupWindow";
import { AppPermissions } from "@/lib/ts/appPermissions";

export default function Home() {
  const [permissionsPageEnabled, setEnabled] = useState(false);
  const disablePermissionsWindow = async () => {
    setEnabled(false);
  };
  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(AppPermissions.gyroPermissions.gyroCompatible);
  }, []);

  return (
    <main className="relative w-full h-screen">
      {
        permissionsPageEnabled && 
        <PopupWindow windowTitle="PERMISSIONS" onClose={disablePermissionsWindow}>
          <Permissions />
        </PopupWindow>
      }
      <SpaceScene />
    </main>
  );
}