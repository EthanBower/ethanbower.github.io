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
  const [navDisplay, setNavDisplayEnabled] = useState(false);
  const [settingsDisplay, setSettingsEnabled] = useState(false);
  const navbarItems = [
    { label: "Settings", icon: "/settings-gear.svg", onClick: () => { setSettingsEnabled(true); setNavDisplayEnabled(false); } },
    { label: "Home", icon: "/home.svg", onClick: () => { SceneController.getInstance().moveAwayFromMoon() } },
    { label: "Moon", icon: "/planet.svg", onClick: () => { SceneController.getInstance().moveToMoon() } },
  ];

  async function moveSpaceSceneCameraIntro () {
    setPermissionsEnabled(false);
    SceneController.getInstance().moveCameraDownToHomePage();
    
    const timer = setTimeout(() => {
      setNavDisplayEnabled(true);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  };

  function closeSettingsWindow() {
    setNavDisplayEnabled(true);
    setSettingsEnabled(false);
  }

  function runAfterLoad() {
    if (AppPermissions.gyroPermissions.gyroCompatible) {
      setPermissionsEnabled(true);    
    } else {
      moveSpaceSceneCameraIntro();
    }
  };

  return (
    <main className="relative w-full h-screen bg-black">
      <NavigationMenu items={navbarItems} closeFlag={!navDisplay} />
      { settingsDisplay && <PopupWindow windowTitle="SETTINGS" onClose={closeSettingsWindow}><p>Test</p></PopupWindow> }
      { permissionsDisplay && <Permissions onClose={moveSpaceSceneCameraIntro} /> }
      <SpaceScene onLoadingComplete={runAfterLoad} />
    </main>
  );
}