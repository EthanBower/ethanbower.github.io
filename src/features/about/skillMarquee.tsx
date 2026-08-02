"use client";

import { motion, useAnimationFrame, useMotionValue, useTransform, wrap } from "framer-motion";
import SkillCard from "./card/skillCard/skillCard";

type Skill = {
    name: string;
    icon: React.ComponentType<any>;
    skillLevel: number;
};

type SkillMarqueeProps = {
    skills: Skill[];
    reverse?: boolean;
};

export default function SkillMarquee({ skills, reverse = false }: SkillMarqueeProps) {
    const baseX = useMotionValue(0);
    const speed = reverse ? 0.0015 : -0.0015;
    const duplicateSkills = [...skills, ...skills];

    useAnimationFrame((_, delta) => {
        baseX.set(baseX.get() + delta * speed);
    });

    const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

    return (
        <div
            className="
                relative
                rounded-2xl
                border
                border-white/10
                bg-white/5
                shadow-2xl
                shadow-black/30">
            <div
                className="py-3"
                style={{
                    WebkitMaskImage:
                        "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
                    maskImage:
                        "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
                }} >
                <motion.div className="flex gap-6 w-max" style={{ x }}>
                    {duplicateSkills.map((skill, i) => (
                        <div key={i} className="w-72 shrink-0">
                            <SkillCard {...skill} />
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}