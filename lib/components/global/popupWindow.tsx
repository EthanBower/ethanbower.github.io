"use client";

import { useRef } from "react";
import {
  motion,
  useDragControls,
  Variants,
  AnimatePresence,
} from "framer-motion";
import DashedSeparator from "../utilities/dashedSeperator";
import Typewriter from "../utilities/typewriter";
import TextScramble from "../utilities/textScramble";
import ExitIcon from "../icons/exit";

// todo - make window full screen if viewport too small

const windowVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.85,
    filter: "blur(12px)",
    y: 20,
  },
  enter: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    filter: "blur(8px)",
    y: 10,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
} as const;

type PopupWindowProps = Readonly<{
  windowTitle: string;
  windowTitleDescription: string;
  windowIcon: React.ReactNode;
  isEnabled: boolean;
  onClose?: () => Promise<void> | void;
  children: React.ReactNode;
}>;

export default function PopupWindow({
  windowTitle,
  windowTitleDescription,
  windowIcon,
  isEnabled,
  onClose,
  children,
}: PopupWindowProps) {
  async function handleClose() {
    if (onClose) {
      await onClose();
    }
  }

  return (
    <AnimatePresence>
      {isEnabled && (
        <WindowContent
          windowTitle={windowTitle}
          windowTitleDescription={windowTitleDescription}
          windowIcon={windowIcon}
          onClose={handleClose}
        >
          {children}
        </WindowContent>
      )}
    </AnimatePresence>
  );
}

function WindowContent({
  windowTitle,
  windowTitleDescription,
  windowIcon,
  onClose,
  children,
}: {
  windowTitle: string;
  windowTitleDescription: string;
  windowIcon: React.ReactNode;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const dragControls = useDragControls();
  const windowRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={windowRef}
      className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
    >
      <motion.div
        className="z-10 pointer-events-auto select-none"
        drag
        dragListener={false}
        dragControls={dragControls}
        dragConstraints={windowRef}
        dragMomentum={true}
        dragElastic={0.05}
      >
        <motion.div
          layout
          className="popup-window shadow-2xl backdrop-blur-md overflow-hidden rounded-xl border border-white/10"
          variants={windowVariants}
          initial="initial"
          animate="enter"
          exit="exit"
        >
          <motion.div whileDrag={{ cursor: "grabbing" }} >
            <div
              className="cursor-grab active:cursor-grabbing flex items-center gap-4 p-4 pb-2"
              onPointerDown={(e) => dragControls.start(e)}
            >
              {windowIcon}
              <div className="flex flex-col text-left">
                <h3 className="text-sm font-semibold text-white font-mono flex items-center gap-1">
                  <Typewriter text={windowTitle} />
                </h3>
                <TextScramble
                  text={windowTitleDescription}
                  className="text-xs text-white/50 mt-0.5"
                />
              </div>
            </div>
          </motion.div>
          <DashedSeparator />
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.3 }}
          >
            {children}
          </motion.div>
          <div className="p-2">
            <motion.button
              whileHover="hover"
              whileTap="hover"
              onClick={onClose}
              className="popup-button-red w-full flex items-center justify-center gap-2 cursor-pointer transition-transform"
            >
              <ExitIcon />
              <span>Exit Window</span>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
