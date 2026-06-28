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

        SceneController.getInstance().moveCameraDownToHomePage(() => {
            SceneController.getInstance().moveToMoon();
            setMenuOpen(true);
        }, .8);
    }, []);

    return (
        <div className="bg-red">This is a test</div>
    );
}