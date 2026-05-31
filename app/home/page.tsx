"use client";

import { SceneController } from "@/lib/ts/threeScene";
import Permissions from "../../lib/components/home/permissions";
import SpaceScene from "@/lib/components/home/spaceScene";
import { useEffect, useState } from "react";
import { AppPermissions } from "@/lib/ts/appPermissions";
import NavigationMenu from "@/lib/components/global/navigationMenu";
import Settings from "@/lib/components/home/settings";
import { useSettings } from "@/lib/components/global/settingsProvider";

export default function Home() {
  const { settings } = useSettings();
  const [permissionsDisplay, setPermissionsEnabled] = useState(AppPermissions.gyroPermissions.gyroCompatible && settings.motionEnabled === null);
  const [navDisplay, setNavDisplayEnabled] = useState(false);
  const [settingsDisplay, setSettingsEnabled] = useState(false);
  const navbarItems = [
    { label: "Settings", icon: "/settings-gear.svg", onClick: openSettingsWindow },
    { label: "Home", icon: "/home.svg", onClick: () => { SceneController.getInstance().moveAwayFromMoon() } },
    { label: "Moon", icon: "/planet.svg", onClick: () => { SceneController.getInstance().moveToMoon() } },
  ];

  useEffect(() => {
    if (!permissionsDisplay) {
      moveSpaceSceneCameraIntro();
    }
  }, []);

  async function moveSpaceSceneCameraIntro () {
    setPermissionsEnabled(false);
    SceneController.getInstance().moveCameraDownToHomePage();
    const timer = setTimeout(() => { setNavDisplayEnabled(true); }, 1000);
    return () => { clearTimeout(timer); };
  };

  function openSettingsWindow() {
    setSettingsEnabled(true); 
    setNavDisplayEnabled(false); 
  }

  function closeSettingsWindow() {
    setNavDisplayEnabled(true);
    setSettingsEnabled(false);
  }

  // to-do fix this
  function runAfterLoad() { };

  return (
    <main className="relative w-full h-screen bg-black">
      <NavigationMenu items={navbarItems} closeFlag={!navDisplay} />
      { settingsDisplay && <Settings onClose={closeSettingsWindow} /> }
      { permissionsDisplay && <Permissions onClose={moveSpaceSceneCameraIntro} /> }
      <SpaceScene onLoadingComplete={runAfterLoad} />
    </main>
  );
}