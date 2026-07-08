"use client";

import { useEffect, useRef, useState } from "react";
import HomeTitle from "@/src/features/home/homeTitle";
import { SceneController } from "@/src/three";
import { useNavigation } from "@/src/providers/navigationProvider";

export default function Home() {
  const { setMenuOpen, addBeforeNavigate, menuFocusRequested } = useNavigation();
  const [homeDisplay, setHomeDisplayEnabled] = useState(false);
  const animationInitialized = useRef<boolean>(false);
  const exitResolver = useRef<() => void | null>(null);

  useEffect(() => {
    if (animationInitialized.current) return;
    animationInitialized.current = true;

    const sceneController = SceneController.getInstance();

    sceneController.moveAwayFromMoon(() => {
      sceneController.moveCameraDownToHomePage(() => {
        setMenuOpen(true);
        setHomeDisplayEnabled(true);
      }, .8);
    }, .8);

    return addBeforeNavigate(() => {
      setHomeDisplayEnabled(false);

      return new Promise<void>((resolve) => {
        exitResolver.current = resolve;
      });
    });

    // 'setMenuOpen' and 'addBeforeNavigate' should not be added in dependency array as this is designed to be a one-time run.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <HomeTitle enable={homeDisplay && !menuFocusRequested} onExitAnimationComplete={() => {
        exitResolver.current?.();
        exitResolver.current = null;
      }} />
    </>
  );
}
