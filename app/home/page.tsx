"use client";

import Gear from "@/src/components/icons/gear";
import HomeIcon from "@/src/components/icons/home";
import PlanetIcon from "@/src/components/icons/planet";
import { AppPermissions } from "@/src/components/utils/appPermissions";
import LoadingScreen from "@/src/features/home/loadingScreen";
import Permissions from "@/src/features/home/permissions";
import SpaceScene from "@/src/features/home/spaceScene";
import Header from "@/src/features/layout/header";
import NavigationMenu from "@/src/features/layout/navigationMenu";
import Settings from "@/src/features/settings/settings";
import { useSettings } from "@/src/providers/settingsProvider";
import { SceneController } from "@/src/three";
import { useState } from "react";

export default function Home() {
  const { settings } = useSettings();
  const [isSceneLoaded, setIsSceneLoaded] = useState(false);
  const [permissionsDisplay, setPermissionsDisplayEnabled] = useState(false);
  const [navDisplay, setNavDisplayEnabled] = useState(false);
  const [settingsDisplay, setSettingsDisplayEnabled] = useState(false);
  const navbarItems = [
    {
      label: "Settings",
      icon: <Gear />,
      onClick: () => openSettingsWindow(),
    },
    {
      label: "Home",
      icon: <HomeIcon />,
      onClick: () => {
        SceneController.getInstance().moveAwayFromMoon();
      },
    },
    {
      label: "Moon",
      icon: <PlanetIcon />,
      onClick: () => {
        SceneController.getInstance().moveToMoon();
      },
    },
  ];

  async function moveSpaceSceneCameraIntro() {
    setPermissionsDisplayEnabled(false);
    SceneController.getInstance().moveCameraDownToHomePage();

    const timer = setTimeout(() => {
      setNavDisplayEnabled(true);
    }, 1000);

    return () => { clearTimeout(timer); };
  }

  function openSettingsWindow() {
    setSettingsDisplayEnabled(true);
    setNavDisplayEnabled(false);
  }

  function closeSettingsWindow() {
    setSettingsDisplayEnabled(false);
    setNavDisplayEnabled(true);
  }

  function runAfterLoad() {
    const permissionsNeeded =
      AppPermissions.gyroPermissions.gyroCompatible && !settings.motionEnabled;
    if (permissionsNeeded) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPermissionsDisplayEnabled(true);
      return;
    }

    moveSpaceSceneCameraIntro();
  }

  return (
    <main className="relative w-full h-screen">
      <LoadingScreen
        isEnabled={isSceneLoaded}
        onCloseAnimationDone={runAfterLoad}
      />
      <SpaceScene
        onLoadingComplete={() => {
          setIsSceneLoaded(true);
        }}
      />
      {isSceneLoaded && (
        <div>
          <Header />
          <NavigationMenu items={navbarItems} isNavbarClosed={!navDisplay} />
          <Settings isEnabled={settingsDisplay} onClose={closeSettingsWindow} />
          <Permissions
            isEnabled={permissionsDisplay}
            onClose={moveSpaceSceneCameraIntro}
          />
        </div>
      )}
    </main>
  );
}
