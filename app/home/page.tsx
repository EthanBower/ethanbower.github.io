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
  const [permissionsDisplay, setPermissionsEnabled] = useState(false);
  const [navDisplay, setNavDisplayEnabled] = useState(false);
  const [settingsDisplay, setSettingsEnabled] = useState(false);
  const { settings, settingsLoaded } = useSettings();
  const navbarItems = [
    { label: "Settings", icon: "/settings-gear.svg", onClick: openSettingsWindow },
    { label: "Home", icon: "/home.svg", onClick: () => { SceneController.getInstance().moveAwayFromMoon() } },
    { label: "Moon", icon: "/planet.svg", onClick: () => { SceneController.getInstance().moveToMoon() } },
  ];

  // Wait for settings to load, then identify if gyro permissions should be asked
  useEffect(() => {
    if (!settingsLoaded) return;

    if (AppPermissions.gyroPermissions.gyroCompatible && settings.motionEnabled === null) {
      setPermissionsEnabled(true);    
    } else {
      moveSpaceSceneCameraIntro();
    }
  }, [settingsLoaded]);

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