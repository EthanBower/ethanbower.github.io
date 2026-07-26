"use client";

import { SceneController } from "@/src/three";
import StandardCard from "../card/standardCard/standardCard";
import SkillCard from "../card/skillCard/skillCard";
import BottomTab from "./bottomTab";
import EthanPicture from "../ethanPicture";
import TypeScriptIcon from "@/src/components/icons/about/typeScript";

type AboutMeTabProps = {
    enable: boolean;
    onCloseComplete: () => void;
}

export default function AboutMeTab({ enable, onCloseComplete }: AboutMeTabProps) {
    // todo - What I do, Quick facts, Skills, interests outside of coding
    // todo - prevent x-scroll which makes page go 'back'
    return (
        <BottomTab
            enable={enable}
            tabCloseTitle="ABOUT"
            onCloseComplete={onCloseComplete}
            onTabOpen={() => (SceneController.getInstance().pauseAnimationLoop())}
            onTabClose={() => (SceneController.getInstance().runAnimationLoop())}>
            <div className="md:flex md:gap-2 md:items-center md:justify-center overflow-hidden px-3">
                <EthanPicture src="/about/ethan.jpeg" alt="Picture of Ethan" />

                <div className="grid w-full flex-1 grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <StandardCard icon="" title="About Me">
                            <p className="mt-2 text-sm leading-6 text-slate-300">
                                {`
                                    I am someone who enjoys learning new things and challenging myself to grow.
                                    I like spending time doing things I'm passionate about, whether that's exploring my interests, being creative, or connecting with the people around me.
                                    I try to stay positive, work hard, and improve a little every day.
                                    My experiences have helped shape who I am, and I'm always looking forward to new opportunities and challenges that help me become a better version of myself.
                                `}
                            </p>
                        </StandardCard>
                    </div>

                    <SkillCard name="C#" icon={TypeScriptIcon} skillLevel={8} />
                    <SkillCard name="TypeScript" icon={TypeScriptIcon} skillLevel={9} />
                    <SkillCard name="TypeScript" icon={TypeScriptIcon} skillLevel={9} />
                </div>
            </div>
        </BottomTab>
    );
}