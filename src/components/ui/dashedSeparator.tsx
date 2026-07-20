import { motion } from "framer-motion";

const dashedLineSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='2'%3E%3Crect x='2' y='0' width='14' height='2' rx='1' ry='1' fill='%239ca3af' opacity='0.5'/%3E%3C/svg%3E")`;

export default function DashedSeparator() {
  return (
    <div className="relative flex items-center justify-center w-full h-6 overflow-hidden">
      <div
        className="w-full h-[2px] flex"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
          maskImage:
            "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
        }}
      >
        <motion.div
          className="w-1/2 h-full scale-x-[-1]"
          style={{
            backgroundImage: dashedLineSvg,
            backgroundSize: "24px 2px",
            backgroundPosition: "right center",
          }}
          animate={{ backgroundPositionX: ["0px", "24px"] }}
          transition={{
            ease: "linear",
            duration: 2,
            repeat: Infinity,
          }}
        />
        <motion.div
          className="w-1/2 h-full"
          style={{
            backgroundImage: dashedLineSvg,
            backgroundSize: "24px 2px",
            backgroundPosition: "left center",
          }}
          animate={{ backgroundPositionX: ["0px", "24px"] }}
          transition={{
            ease: "linear",
            duration: 2,
            repeat: Infinity,
          }}
        />
      </div>
    </div>
  );
}
