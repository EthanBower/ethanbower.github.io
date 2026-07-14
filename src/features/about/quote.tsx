"use client";

import Typewriter from "@/src/components/ui/typewriter";
import { glass } from "@/src/styles/surfaces";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

type QuoteProps = {
    enable: boolean;
}

export default function Quote({ enable }: QuoteProps) {
    return (
        <section className="absolute inset-0 pointer-events-none flex items-center justify-center text-white z-1">
            <AnimatePresence>
                {enable && (
                    <QuoteContent />
                )}
            </AnimatePresence>
        </section>
    );
}

function QuoteContent() {
    const [showAuthor, setShowAuthor] = useState(false);

    return (<motion.div
        exit={{ opacity: 0, scale: 1.2, filter: "blur(8px)" }}
        className="pointer-events-auto max-w-3xl px-8 text-center">
        <Typewriter
            text={`"Don't tell me the sky's the limit when there are footprints on the moon." `}
            minSpeed={30}
            maxSpeed={60}
            typoChance={.05}
            onDone={() => setShowAuthor(true)}
            className="
                text-3xl md:text-5xl
                italic
                font-light
                leading-relaxed
                tracking-wide
                drop-shadow-[0_0_20px_rgba(255,255,255,0.35)]
            "/>
        <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={showAuthor ? { opacity: 1, y: 0 } : {}}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 1 }}
            className={`
                inline-block
                mt-8
                p-3
                text-sm
                md:text-lg
                uppercase
                tracking-[0.35em]
                text-white/70
                drop-shadow-[0_0_12px_rgba(255,255,255,0.25)] dark:drop-shadow-[0_4px_16px_rgba(0,0,0,0.75)]
                rounded-xl
                ${glass}
            `}>
            <>Paul Brandt</>
        </motion.p>
    </motion.div>);
}