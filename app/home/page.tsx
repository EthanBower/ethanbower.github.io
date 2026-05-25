"use client";

import { useEffect, useState } from "react";
import Permissions from "../../lib/components/permissions";
import SpaceScene from "@/lib/components/spaceScene";
import DraggableWindow from "@/lib/components/draggableWindow";
import { AppPermissions } from "@/lib/ts/appPermissions";

export default function Home() {
  const [permissionsPageEnabled, setEnabled] = useState(AppPermissions.gyroPermissions.gyroCompatible);
  const disablePermissionsWindow = async () => {
    setEnabled(false);
  };
  
  return (
    <main className="relative w-full h-screen">
      {
        permissionsPageEnabled && 
        <DraggableWindow windowTitle="PERMISSIONS" onClose={disablePermissionsWindow}>
          <Permissions />
        </DraggableWindow>
      }
      <SpaceScene />
    </main>
  );
}