"use client";

import { motion } from "framer-motion";

export default function Title() {
    return (
        <motion.section
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
                type: "spring",
                stiffness: 120,
                damping: 20,
            }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
            <div className="pointer-events-auto flex flex-col items-center">
                {/* Top Line */}
                <div className="mb-6 h-px w-64 bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent" />

                {/* Status */}
                <motion.div
                    animate={{
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 2,
                    }}
                    className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.45em] text-cyan-300"
                >
                    <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.9)]" />
                    Command Interface Online
                </motion.div>

                {/* Name */}
                <h1 className="font-mono text-5xl font-bold tracking-[0.18em] text-white drop-shadow-[0_0_18px_rgba(34,211,238,0.25)] sm:text-7xl">
                    ETHAN BOWER
                </h1>

                {/* Role */}
                <p className="mt-5 text-center font-mono text-cyan-300 tracking-[0.25em] uppercase">
                    Senior Full Stack Engineer
                </p>

                {/* Description */}
                <p className="mt-6 max-w-xl text-center leading-7 text-white/65">
                    Building modern web applications, interactive 3D experiences,
                    and scalable cloud software.
                </p>

                {/* Decorative Lines */}
                <div className="mt-10 flex items-center gap-5">
                    <div className="h-px w-20 bg-cyan-400/50" />
                    <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
                    <div className="h-px w-20 bg-cyan-400/50" />
                </div>

                {/* Buttons */}
                <div className="mt-10 flex flex-wrap justify-center gap-4">
                    <motion.button
                        whileHover={{
                            scale: 1.04,
                            boxShadow: "0 0 30px rgba(34,211,238,.25)",
                        }}
                        whileTap={{ scale: 0.97 }}
                        className="
                            rounded-full
                            border border-cyan-400/40
                            bg-cyan-400/5
                            px-7 py-3
                            font-mono
                            uppercase
                            tracking-[0.25em]
                            text-cyan-200
                            backdrop-blur-md
                        "
                    >
                        Begin Mission
                    </motion.button>

                    <motion.button
                        whileHover={{
                            scale: 1.04,
                            borderColor: "rgba(255,255,255,.4)",
                        }}
                        whileTap={{ scale: 0.97 }}
                        className="
                            rounded-full
                            border border-white/15
                            px-7 py-3
                            font-mono
                            uppercase
                            tracking-[0.25em]
                            text-white/80
                        "
                    >
                        Download Resume
                    </motion.button>
                </div>

                {/* Scroll Hint */}
                <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{
                        repeat: Infinity,
                        duration: 1.8,
                    }}
                    className="mt-16 text-center"
                >
                    <div className="text-xs uppercase tracking-[0.35em] text-white/35">
                        Scroll to Explore
                    </div>

                    <div className="mt-2 text-cyan-300 text-xl">
                        ↓
                    </div>
                </motion.div>

                {/* Bottom Line */}
                <div className="mt-8 h-px w-64 bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent" />
            </div>
        </motion.section>
    );
}