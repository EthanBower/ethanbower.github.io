import { motion, Variants } from "framer-motion";

const dynamicSquareVariants: Variants = {
    hover: {
        scale: 1.1,
        boxShadow: "0px 0px 20px rgba(157, 157, 157, 0.5)",
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 12,
            mass: 0.6
        }
    },
    tap: {
        scale: 1.05,
        boxShadow: "0px 0px 20px rgba(157, 157, 157, 0.2)"
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
        <motion.div
            className="rounded-lg rounded-2xl border-white/40 border-1 cursor-pointer"
            variants={dynamicSquareVariants}
            whileHover="hover"
            whileTap="tap"
            style={{
                background: `linear-gradient(150deg, ${cssColors.join(", ")})`
            }}
            onClick={() => { onClick(colors) }}
        >
            <div className="
                p-1 bg-black/20 rounded-md break-words
                m-2
                sm:m-4">
                <span>
                    {presetName}
                </span>
            </div>
        </motion.div>
    );
}