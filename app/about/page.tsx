"use client";

import Quote from "@/src/features/about/quote";
import Tab from "@/src/features/about/tab";
import { useNavigation } from "@/src/providers/navigationProvider";
import { SceneController } from "@/src/three";
import { useEffect, useRef } from "react";

export default function About() {
    const { setMenuOpen, setMenuPosition } = useNavigation();
    const animationInitialized = useRef<boolean>(false);

    useEffect(() => {
        if (animationInitialized.current) return;
        animationInitialized.current = true;

        setMenuOpen(true);
        setMenuPosition("Top");

        const sceneController = SceneController.getInstance();

        sceneController.moveCameraDownToHomePage(() => {
            sceneController.moveToMoon();
        }, .8);

        // 'setMenuOpen' should not be included in the dependency array as this is designed to be a one-time run.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Quote />
            <Tab />
        </>
    );
}