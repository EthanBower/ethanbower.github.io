"use client";

import { buttonStyles } from "@/src/styles/buttonStyles";
import { motion } from "framer-motion";
import ExitIcon from "../icons/exit";
import { ReactNode } from "react";
import { animationVariants } from "../utils/globals";

type CloseButtonProps = {
    className?: string;
    onClick: () => void;
    children: ReactNode;
}

export default function CloseButton({ className, onClick, children }: CloseButtonProps) {
    return (
        <motion.button
            variants={animationVariants.buttonVariant}
            whileHover="hover"
            whileTap={["hover", "tap"]}
            onClick={onClick}
            className={`
                ${buttonStyles.red} 
                ${className}
                !m-0 
                !p-1.5 
                flex 
                items-center 
                justify-center 
                gap-2 
                cursor-pointer 
                whitespace-nowrap`} >
            <ExitIcon className="" />
            <span>{children}</span>
        </motion.button>
    );
}