"use client";

import Image from "next/image";
import CardLayout from "../cardLayout";
import { motion, Variants } from "framer-motion";

const PanelVariants: Variants = {
    initial: {
        opacity: 0,
        y: "100%"
    },
    whenVisible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 200,
            damping: 8,
            mass: 0.6,
            opacity: {
                type: "tween",
                ease: "easeIn",
                duration: 0.2
            },
        }
    }
}

type PictureCardProps = {
    src: string;
    alt: string;
    title?: string;
    titleDescription?: string;
};

export default function PictureCard({ src, alt, title, titleDescription }: PictureCardProps) {
    return (
        <CardLayout className="" saturateBackground={false}>
            <div className="flex items-center justify-center md:h-[95dvh] md:max-w-[50vw]">
                <div className="relative inline-block overflow-hidden rounded-2xl">
                    <Image
                        src={src}
                        alt={alt}
                        width={450}
                        height={560}
                        priority
                        className="block max-h-[85vh] w-auto object-contain"
                    />
                    {title || titleDescription ? (
                        <motion.div
                            variants={PanelVariants}
                            className="absolute bottom-4 left-4 right-4 flex items-center justify-center">
                            <div className="rounded-xl border border-white/30 bg-slate-700/50 dark:bg-black/60 backdrop-blur-[4px] p-4 text-center w-full max-w-[400px]">
                                <h2 className="text-2xl font-bold text-white">
                                    {title}
                                </h2>
                                <p className="mt-1 font-bold text-xs uppercase tracking-[0.25em] text-cyan-300">
                                    {titleDescription}
                                </p>
                            </div>
                        </motion.div>
                    ) : null}
                </div>
            </div >
        </CardLayout >
    );
}