"use client";

import { SceneController } from "@/src/three";
import StandardCard from "../card/standardCard/standardCard";
import SkillCard from "../card/skillCard/skillCard";
import BottomTab2 from "./bottomTab";

type AboutMeTabProps = {
    enable: boolean;
    onCloseComplete: () => void;
}

export default function AboutMeTab({ enable, onCloseComplete }: AboutMeTabProps) {
    return (
        <BottomTab2
            enable={enable}
            tabCloseTitle="ABOUT"
            onCloseComplete={onCloseComplete}
            onTabOpen={() => (SceneController.getInstance().pauseAnimationLoop())}
            onTabClose={() => (SceneController.getInstance().runAnimationLoop())}>
            <div className="flex gap-3 items-center justify-center m-5">
                <StandardCard icon="🚀" title="About Me">
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                        Passionate about building interactive web experiences,
                        graphics programming, and creating immersive user
                        interfaces.
                    </p>
                </StandardCard>
                <SkillCard name="C#" skillLevel={8} />
            </div>
        </BottomTab2>
    );
}