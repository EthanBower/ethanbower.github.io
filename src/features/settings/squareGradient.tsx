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
    onClick: (colors: number[]) => void
}

export default function SquareGradient({ presetName, colors, onClick }: SquareGradientProps) {
    const cssColors = colors.map((num) => {
        return `#${num.toString(16).padStart(6, "0")}`;
    });

    return (
        <div className="flex flex-col gap-2">
            <span className="text-sm text-white/70 font-medium">
                <p className="inline-block rounded-full px-2 py-1 bg-black/35 dark:bg-black/80">
                    {presetName}
                </p>
            </span>
            <motion.div
                className="h-24 rounded-2xl border border-white/40 cursor-pointer rounded-lg border-1"
                variants={dynamicSquareVariants}
                whileHover="hover"
                whileTap="tap"
                style={{
                    background: `linear-gradient(150deg, ${cssColors.join(", ")})`
                }}
                onClick={() => { onClick(colors) }} />
        </div>
    );
}