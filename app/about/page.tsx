"use client";

import Quote from "@/src/features/about/quote";
import Tab from "@/src/features/about/tab";
import { useNavigation } from "@/src/providers/navigationProvider";
import { SceneController } from "@/src/three";
import { useEffect, useRef, useState } from "react";

enum AppStage {
    Initial,
    SceneZoomToMoonDone
}

export default function About() {
    const { setMenuOpen, setMenuPosition, addBeforeNavigate } = useNavigation();
    const [stage, setStage] = useState(AppStage.Initial);
    const animationInitialized = useRef<boolean>(false);
    const exitResolver = useRef<() => void | null>(null);

    useEffect(() => {
        if (animationInitialized.current) return;
        animationInitialized.current = true;

        setMenuOpen(true);
        setMenuPosition("Top");

        const sceneController = SceneController.getInstance();

        sceneController.moveCameraDownToHomePage(() => {
            sceneController.moveToMoon(() => {
                setStage(AppStage.SceneZoomToMoonDone);
            }, .8);
        }, .8);

        // 'setMenuOpen' should not be included in the dependency array as this is designed to be a one-time run.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        return addBeforeNavigate(() => {
            const tabAnimationDonePromise = new Promise<void>((resolve) => {
                exitResolver.current = resolve;
            });

            setStage(AppStage.Initial);

            return tabAnimationDonePromise;
        });
    }, [addBeforeNavigate]);

    return (
        <>
            <button onClick={() => { setStage(AppStage.Initial) }} className="relative">Off</button>
            <button onClick={() => { setStage(AppStage.SceneZoomToMoonDone) }} className="relative">On</button>
            <Quote />
            <Tab enable={stage >= AppStage.SceneZoomToMoonDone}
                onCloseComplete={() => {
                    exitResolver.current?.();
                    exitResolver.current = null;
                }} />
        </>
    );
}