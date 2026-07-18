"use client";

import { motion, Variants } from "framer-motion";

const SkillCardPillVariants: Variants = {
    initial: {
        scale: 0,
        opacity: 0,
    },
    whenVisible: (i: number) => ({
        scale: 1,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 500,
            damping: 20,
            mass: 0.6,
            delay: i * 0.1
        }
    })
};

type SkillPillProps = {
    index: number;
    skillLevel: number;
    onAnimationStart: () => void;
    pillActiveColor?: string;
    pillAtLevelColor?: string;
    pillInactiveColor?: string;
}

export default function SkillPill({ index, skillLevel, pillActiveColor = "bg-cyan-500", pillAtLevelColor = "bg-white", pillInactiveColor = "bg-white/15", onAnimationStart }: SkillPillProps) {
    const isActivePill = index < skillLevel;
    const isPillAtLevel = index === skillLevel - 1;
    const pillShadow = "shadow-[0_0_10px_rgba(34,211,238,0.8)]";

    return (
        <motion.div
            key={index}
            animate={isPillAtLevel ? {
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7],
            } : undefined}
            transition={isPillAtLevel ? {
                duration: 1.4,
                repeat: Infinity,
                ease: "easeInOut"
            } : undefined}
            className="flex-1 rounded-full"
        >
            <motion.div
                variants={SkillCardPillVariants}
                custom={index}
                onAnimationStart={() => onAnimationStart()}
                className={`h-3 rounded-full 
                    ${isActivePill ?
                        (isPillAtLevel ?
                            `${pillAtLevelColor} ${pillShadow}` :
                            `${pillActiveColor} ${pillShadow}`)
                        : pillInactiveColor
                    }`}
            />
        </motion.div>
    );
}