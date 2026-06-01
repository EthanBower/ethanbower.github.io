"use client";

import { SceneController } from "@/lib/ts/threeScene";
import Permissions from "../../lib/components/home/permissions";
import SpaceScene from "@/lib/components/home/spaceScene";
import { useEffect, useState } from "react";
import { AppPermissions } from "@/lib/ts/appPermissions";
import NavigationMenu from "@/lib/components/home/navigationMenu";
import Settings from "@/lib/components/home/settings";
import { useSettings } from "@/lib/components/global/settingsProvider";
import Header from "@/lib/components/home/header";

export default function Home() {
  const { settings } = useSettings();
  const [permissionsDisplay, setPermissionsDisplayEnabled] = useState(false);
  const [navDisplay, setNavDisplayEnabled] = useState(false);
  const [homeDisplay, setHomeDisplayEnabled] = useState(false);
  const [settingsDisplay, setSettingsEnabled] = useState(false);
  const navbarItems = [
    { label: "Settings", icon: "/settings-gear.svg", onClick: openSettingsWindow },
    { label: "Home", icon: "/home.svg", onClick: () => { SceneController.getInstance().moveAwayFromMoon() } },
    { label: "Moon", icon: "/planet.svg", onClick: () => { SceneController.getInstance().moveToMoon() } },
  ];

  // Gyro and settings are obtained on client to prevent hydration issues
  useEffect(() => {
    const permissionsNeeded = AppPermissions.gyroPermissions.gyroCompatible && !settings.motionEnabled;

    if (!permissionsNeeded) {
      moveSpaceSceneCameraIntro();
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPermissionsDisplayEnabled(true);
    }
  }, []);

  async function moveSpaceSceneCameraIntro () {
    setPermissionsDisplayEnabled(false);
    SceneController.getInstance().moveCameraDownToHomePage();

    const timer = setTimeout(() => { 
      setNavDisplayEnabled(true); 
      setHomeDisplayEnabled(true);
    }, 1000);

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

  // todo - eventually nav menu should use same close/show variable as rest of home
  return (
    <main className="relative w-full h-screen bg-black">
      { homeDisplay && <Header /> }
      <NavigationMenu items={navbarItems} isNavbarClosed={!navDisplay} />
      <SpaceScene onLoadingComplete={runAfterLoad} />
      { settingsDisplay && <Settings onClose={closeSettingsWindow} /> }
      { permissionsDisplay && <Permissions onClose={moveSpaceSceneCameraIntro} /> }
    </main>
  );
}