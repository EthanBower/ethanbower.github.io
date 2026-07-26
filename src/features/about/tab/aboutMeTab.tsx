"use client";

import { SceneController } from "@/src/three";
import StandardCard from "../card/standardCard/standardCard";
import SkillCard from "../card/skillCard/skillCard";
import BottomTab from "./bottomTab";
import TypeScriptIcon from "@/src/components/icons/about/typeScript";
import PictureCard from "../card/pictureCard/pictureCard";

type AboutMeTabProps = {
    enable: boolean;
    onCloseComplete: () => void;
}

export default function AboutMeTab({ enable, onCloseComplete }: AboutMeTabProps) {
    // todo - What I do, Quick facts, Skills, interests outside of coding
    // todo - prevent x-scroll which makes page go 'back', divide these into sections
    return (
        <BottomTab
            enable={enable}
            tabCloseTitle="ABOUT"
            onCloseComplete={onCloseComplete}
            onTabOpen={() => (SceneController.getInstance().pauseAnimationLoop())}
            onTabClose={() => (SceneController.getInstance().runAnimationLoop())}>
            <div className="overflow-hidden px-3">
                <div className="md:flex md:gap-2 md:items-center md:justify-center">
                    <div className="my-3 md:m-0">
                        <PictureCard src="/about/ethan.jpeg" alt="Picture of Ethan" title="Ethan Bower" titleDescription="Full Stack Engineer" />
                    </div>
                    <div className="flex-1 max-w-200 my-3 md:my-0">
                        <StandardCard title="A Little About Me">
                            <div className="space-y-4 text-sm leading-6 text-slate-300">
                                <p>
                                    {`
                                        Hi, I'm Ethan. I'm a software developer who enjoys building projects
                                        that solve real problems and help me learn something new along the way.
                                    `}
                                </p>
                                <p>
                                    {`
                                        Most of my time is spent working with modern web technologies,
                                        experimenting with new frameworks, and turning ideas into polished
                                        applications. I enjoy the process of taking a project from a simple
                                        concept to something people can actually use.
                                    `}
                                </p>
                                <p>
                                    {`
                                        When I'm not coding, I'm usually learning about new technologies,
                                        refining old projects, or exploring interests outside of programming.
                                        I'm always looking for opportunities to grow as both a developer and a
                                        person.
                                    `}
                                </p>
                            </div>
                        </StandardCard>
                    </div>
                </div>

                <div className="grid w-full flex-1 grid-cols-2 gap-6">
                    <SkillCard name="C#" icon={TypeScriptIcon} skillLevel={8} />
                    <SkillCard name="TypeScript" icon={TypeScriptIcon} skillLevel={9} />
                    <SkillCard name="TypeScript" icon={TypeScriptIcon} skillLevel={9} />
                </div>
            </div>
        </BottomTab>
    );
}