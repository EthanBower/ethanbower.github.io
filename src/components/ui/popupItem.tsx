"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { animationVariants } from "../utils/globals";

type PopupItemProps = {
    children: ReactNode;
}

export default function PopupItem({ children }: PopupItemProps) {
    return (
        <motion.section variants={animationVariants.popupWindowChildrenItemVariant} className="m-[5px] bg-black/15 dark:bg-slate-500/10 p-3 rounded-xl">
            {children}
        </motion.section>
    );
}