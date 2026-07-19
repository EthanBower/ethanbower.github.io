"use client";

import { useEffect, useRef, useState } from "react";
import HomeTitle from "@/src/features/home/homeTitle";
import { SceneController } from "@/src/three";
import { useNavigation } from "@/src/providers/navigationProvider";
import { useNavigationMenuUI } from "@/src/providers/navigationMenuUIProvider";

export default function Home() {
  const { addBeforeNavigate } = useNavigation();
  const { setMenuOpen, setMenuPosition, menuFocusRequested } = useNavigationMenuUI();
  const [homeDisplay, setHomeDisplayEnabled] = useState(false);
  const animationInitialized = useRef<boolean>(false);
  const exitResolver = useRef<() => void | null>(null);

  useEffect(() => {
    if (animationInitialized.current) return;
    animationInitialized.current = true;

    setMenuOpen(true);
    setMenuPosition("Bottom");

    const sceneController = SceneController.getInstance();

    sceneController.moveAwayFromMoon(() => {
      sceneController.moveCameraDownToHomePage(() => {
        setHomeDisplayEnabled(true);
      }, .2);
    }, .8);

    // 'setMenuOpen' and 'addBeforeNavigate' should not be added in dependency array as this is designed to be a one-time run.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return addBeforeNavigate(() => {
      const titleAnimationDonePromise = new Promise<void>((resolve) => {
        exitResolver.current = resolve;
      });

      setHomeDisplayEnabled(false);

      return titleAnimationDonePromise;
    });
  }, [addBeforeNavigate, setHomeDisplayEnabled]);

  return (
    <>
      <HomeTitle enable={homeDisplay && !menuFocusRequested} onExitAnimationComplete={() => {
        exitResolver.current?.();
        exitResolver.current = null;
      }} />
    </>
  );
}
