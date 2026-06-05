"use client";

import { SceneController } from "@/lib/ts/threeScene";
import Permissions from "../../lib/components/home/permissions";
import SpaceScene from "@/lib/components/home/spaceScene";
import { useState } from "react";
import { AppPermissions } from "@/lib/ts/appPermissions";
import NavigationMenu from "@/lib/components/home/navigationMenu";
import Settings from "@/lib/components/home/settings";
import { useSettings } from "@/lib/components/global/settingsProvider";
import Header from "@/lib/components/home/header";
import Gear from "@/lib/components/icons/gear";
import HomeIcon from "@/lib/components/icons/home";
import LoadingScreen from "@/lib/components/home/loadingScreen";
import PlanetIcon from "@/lib/components/icons/planet";

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

    return () => {
      clearTimeout(timer);
    };
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
