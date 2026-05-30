"use client";

import { SceneController } from "@/lib/ts/threeScene";
import Permissions from "../../lib/components/home/permissions";
import SpaceScene from "@/lib/components/home/spaceScene";
import { useState } from "react";
import { AppPermissions } from "@/lib/ts/appPermissions";
import NavigationMenu from "@/lib/components/global/navigationMenu";
import PopupWindow from "@/lib/components/global/popupWindow";

export default function Home() {
  const [permissionsDisplay, setPermissionsEnabled] = useState(false);
  const [settingsDisplay, setSettingsEnabled] = useState(false);
  const navbarItems = [
    { label: "Settings", icon: "/settings-gear.svg", onClick: () => { setSettingsEnabled(true) } },
    { label: "Home", icon: "/settings-gear.svg", onClick: () => {} },
    { label: "Missions", icon: "/settings-gear.svg", onClick: () => {} },
    { label: "About", icon: "/settings-gear.svg", onClick: () => {} },
  ];

  const moveSpaceSceneCameraIntro = async () => {
    setPermissionsEnabled(false);
    SceneController.getInstance().moveCameraDownToHomePage();
  };

  const closeSettingsWindow = () => {
    setSettingsEnabled(false);
  }

  const runAfterLoad = () => {
    if (!AppPermissions.gyroPermissions.gyroCompatible) {
      setPermissionsEnabled(true);    
    } else {
      moveSpaceSceneCameraIntro();
    }
  };

  return (
    <main className="relative w-full h-screen bg-black">
      { !permissionsDisplay && <NavigationMenu items={navbarItems} /> }
      { settingsDisplay && <PopupWindow windowTitle="SETTINGS" onClose={closeSettingsWindow}><p>Test</p></PopupWindow> }
      { permissionsDisplay && <Permissions onClose={moveSpaceSceneCameraIntro} /> }
      <SpaceScene onLoadingComplete={runAfterLoad} />
    </main>
  );
}