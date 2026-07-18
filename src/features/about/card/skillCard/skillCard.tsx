"use client";

import { useState } from "react";
import CardLayout from "../cardLayout";
import LevelDisplay from "./levelDisplay";
import SkillPill from "./skillPill";

type SkillCardProps = {
    name: string;
    skillLevel: number;
    maxLevelNumber?: number;
    pillActiveColor?: string;
    pillAtLevelColor?: string;
    pillInactiveColor?: string;
};

export default function SkillCard({ name, skillLevel, maxLevelNumber = 10, pillActiveColor = "bg-cyan-500", pillAtLevelColor = "bg-white", pillInactiveColor = "bg-white/15" }: SkillCardProps) {
    const [levelDisplayTick, setLevelDisplayTick] = useState(false);

    if (skillLevel < 0) {
        throw new Error(`Skill level must not be less than 0. Received a value of ${skillLevel}.`);
    }

    if (skillLevel > maxLevelNumber) {
        throw new Error(`Skill level must not be greater than 10. Received a value of ${skillLevel}.`);
    }

    return (
        <CardLayout>
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                    {name}
                </h3>
                <LevelDisplay level={skillLevel} maxLevel={maxLevelNumber} startTicking={levelDisplayTick} />
            </div>
            <div className="mt-5 flex gap-1.5">
                {Array.from({ length: maxLevelNumber }).map((_, i) => (
                    <SkillPill key={i} index={i} skillLevel={skillLevel} onAnimationStart={() => setLevelDisplayTick(true)} />
                ))}
            </div>
        </CardLayout>
    );
}