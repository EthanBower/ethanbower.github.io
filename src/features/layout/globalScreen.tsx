"use client";

import { ReactNode, useState } from "react";
import SpaceScene from "../home/spaceScene";
import LoadingScreen from "./loadingScreen";
import Permissions from "@/src/features/home/permissions";
import WhatsNewBanner from "./whatsNewBanner";
import DynamicNavigationMenu from "./dynamicNavigationMenu";

enum AppStage {
    SpaceSceneLoading,
    Loaded,
    Permissions,
    Ready,
}

type GlobalScreenProps = {
    children: ReactNode;
}

export default function GlobalScreen({ children }: GlobalScreenProps) {
    const [stage, setStage] = useState(AppStage.SpaceSceneLoading);

    return (
        <main className="relative h-screen w-full">
            <SpaceScene onLoadingComplete={() => setStage(AppStage.Loaded)} />

            <LoadingScreen
                enable={stage <= AppStage.SpaceSceneLoading}
                onCloseAnimationDone={() => setStage(AppStage.Permissions)}
            />

            {stage >= AppStage.Permissions && (
                <Permissions onClose={() => setStage(AppStage.Ready)} />
            )}

            {stage >= AppStage.Ready && (
                <>
                    <DynamicNavigationMenu />
                    <WhatsNewBanner />
                    {children}
                </>
            )}
        </main>
    );
}