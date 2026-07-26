"use client";

import { ComponentType, useState } from "react";
import CardLayout from "../cardLayout";
import LevelDisplay from "./levelDisplay";
import SkillPill from "./skillPill";
import { IconPropsType } from "@/src/components/icons/about/iconPropsType";

type SkillCardProps = {
    name: string;
    icon: ComponentType<IconPropsType>;
    skillLevel: number;
    maxLevelNumber?: number;
};

export default function SkillCard({ name, icon: Icon, skillLevel, maxLevelNumber = 10 }: SkillCardProps) {
    const [levelDisplayTick, setLevelDisplayTick] = useState(false);

    if (skillLevel < 0) {
        throw new Error(`Skill level must not be less than 0. Received a value of ${skillLevel}.`);
    }

    if (skillLevel > maxLevelNumber) {
        throw new Error(`Skill level must not be greater than 10. Received a value of ${skillLevel}.`);
    }

    return (
        <CardLayout >
            <div className="flex flex-col items-center justify-center">
                <div className="
                    lg:flex lg:items-center lg:gap-4 lg:justify-between 
                    w-full text-center
                ">
                    <div className="w-10 h-10 mx-auto lg:mx-0 mb-3 lg:mb-0">
                        <Icon className="rounded-md" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                        {name}
                    </h3>
                </div>
                <div className="flex gap-1.5 w-full mt-5">
                    {Array.from({ length: maxLevelNumber }).map((_, i) => (
                        <SkillPill key={i} index={i} skillLevel={skillLevel} onAnimationStart={() => setLevelDisplayTick(true)} />
                    ))}
                </div>
                <div className="mt-5">
                    <LevelDisplay level={skillLevel} maxLevel={maxLevelNumber} startTicking={levelDisplayTick} />
                </div>
            </div>
        </CardLayout>
    );
}