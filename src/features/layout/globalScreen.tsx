"use client";

import { ReactNode, useState } from "react";
import SpaceScene from "../home/spaceScene";
import LoadingScreen from "./loadingScreen";
import Permissions from "@/src/features/home/permissions";
import WhatsNewBanner from "./whatsNewBanner";
import DynamicNavigationMenu from "./dynamicNavigationMenu";

type GlobalScreenProps = {
    children: ReactNode;
}

export default function GlobalScreen({ children }: GlobalScreenProps) {
    const [isSceneLoaded, setIsSceneLoaded] = useState(false);
    const [showPermissions, setShowPermissions] = useState(false);
    const [showChildren, setShowChildren] = useState(false);

    return (
        <main className="relative w-full h-screen">
            <SpaceScene onLoadingComplete={() => setIsSceneLoaded(true)} />
            <LoadingScreen enable={!isSceneLoaded} onCloseAnimationDone={() => setShowPermissions(true)} />

            {showPermissions && <Permissions onClose={() => setShowChildren(true)} />}
            {showChildren && (
                <>
                    <DynamicNavigationMenu />
                    <WhatsNewBanner />
                    {children}
                </>
            )}
        </main>
    );
}