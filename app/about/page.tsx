"use client";

import { useNavigation } from "@/src/providers/navigationProvider";
import { SceneController } from "@/src/three";
import { useEffect, useRef } from "react";

export default function About() {
    const { setMenuOpen } = useNavigation();
    const animationInitialized = useRef<boolean>(false);

    useEffect(() => {
        if (animationInitialized.current) return;
        animationInitialized.current = true;

        const sceneController = SceneController.getInstance();

        sceneController.moveCameraDownToHomePage(() => {
            sceneController.moveToMoon(() => {
                setMenuOpen(true);
            }, .8);
        }, .8);

        // 'setMenuOpen' should not be included in the dependency array as this is designed to be a one-time run.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <section
            className="pointer-events-none relative z-100 inset-0 flex justify-center"
        >
            <p className="text-white">This is a test</p>
        </section>
    );
}