"use client";

import { useEffect, useRef, useState } from "react";
import HomeTitle from "@/src/features/home/homeTitle";
import { SceneController } from "@/src/three";
import { useNavigation } from "@/src/providers/navigationProvider";

export default function Home() {
  const { setMenuOpen, addBeforeNavigate, menuFocusRequested } = useNavigation();
  const [homeDisplay, setHomeDisplayEnabled] = useState(false);
  const [initialized, setInitialized] = useState<boolean>(false);
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
        setInitialized(true);
      }, .8);
    }, .8);
  }, []);

  useEffect(() => {
    return addBeforeNavigate(() => {
      setHomeDisplayEnabled(false);

      return new Promise<void>((resolve) => {
        exitResolver.current = resolve;
      });
    });
  }, []);

  useEffect(() => {
    if (!initialized) {
      return;
    }

    setHomeDisplayEnabled(!menuFocusRequested);
  }, [menuFocusRequested, initialized]);

  return (
    <HomeTitle enable={homeDisplay} onExitAnimationComplete={() => {
      exitResolver.current?.();
      exitResolver.current = null;
    }} />
  );
}
