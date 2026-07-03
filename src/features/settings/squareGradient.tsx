import CheckMark from "@/src/components/icons/checkMark";
import { motion, Variants } from "framer-motion";

const dynamicSquareVariants: Variants = {
    hover: {
        scale: 1.1,
        boxShadow: "0px 0px 20px rgba(37, 37, 37, 0.5)",
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 12,
            mass: 0.6
        }
    },
    tap: {
        scale: 1.05,
        boxShadow: "0px 0px 20px rgba(66, 66, 66, 0.2)",
    }
} as const;

interface SquareGradientProps {
    presetName: string,
    colors: number[],
    selected: boolean,
    onClick: (presetName: string, colors: number[]) => void
}

export default function SquareGradient({ presetName, colors, selected, onClick }: SquareGradientProps) {
    const cssColors = colors.map((num) => {
        return `#${num.toString(16).padStart(6, "0")}`;
    });

    return (
        <div className="flex flex-col gap-2">
            <motion.div
                className={`
                    relative h-24 rounded-2xl cursor-pointer rounded-lg
                    ${selected ? "border-2 border-cyan-300/60" : "border-white/40 border-1"}`}
                variants={dynamicSquareVariants}
                whileHover="hover"
                whileTap="tap"
                style={{
                    background: `linear-gradient(150deg, ${cssColors.join(", ")})`
                }}
                onClick={() => { onClick(presetName, colors) }} >
                {selected && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            initial={{ scale: 1, y: 15 }}
                            animate={{ scale: 1.2, y: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 200,
                                damping: 7,
                            }}>
                            <CheckMark />
                        </motion.div>
                    </div>
                )}
            </motion.div>
            <span className="text-sm font-medium text-white/70">
                <p className={`
                        inline-block rounded-full px-2 py-1 
                        ${selected ? "bg-emerald-400/50 dark:bg-emerald-700/50" : "bg-black/35 dark:bg-black/80"}
                    `}>
                    {presetName}
                </p>
            </span>
        </div>
    );
}