"use client";

import { motion } from "framer-motion";
import BottomTab from "./bottomTab";
import { SceneController } from "@/src/three";

type AboutMeTabProps = {
    enable: boolean;
    onCloseComplete: () => void;
}

export default function AboutMeTab({ enable, onCloseComplete }: AboutMeTabProps) {
    return (
        <BottomTab
            enable={enable}
            onCloseComplete={onCloseComplete}
            onTabOpen={() => (SceneController.getInstance().pauseAnimationLoop())}
            onTabClose={() => (SceneController.getInstance().runAnimationLoop())}>
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.35 }}
            >
                <div className="flex flex-col gap-4 p-4">
                    {Array.from({ length: 50 }, (_, i) => (
                        <div key={i}>Item {i}</div>
                    ))}
                </div>
            </motion.div>
        </BottomTab>
    );
}