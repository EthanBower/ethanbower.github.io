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
      className="absolute inset-0 flex items-center justify-center pointer-events-none w-[100dvw] h-[100dvh]"
    >
      <motion.div
        className="z-10 pointer-events-auto select-none flex flex-col 
          justify-center w-[inherit] h-[inherit]
          sm:justify-normal sm:w-auto sm:h-auto sm:max-w-[90vw] sm:max-h-[min(90vh,900px)]"
        drag
        dragListener={false}
        dragControls={dragControls}
        dragConstraints={windowRef}
        dragMomentum={true}
        dragElastic={0.05}
      >
        <motion.div
          layout
          className="popup-window"
          variants={windowVariants}
          initial="initial"
          animate="enter"
          exit="exit"
        >
          <motion.div whileDrag={{ cursor: "grabbing" }} >
            <div
              className="cursor-grab active:cursor-grabbing flex gap-4"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <div className="flex self-center mt-3 ml-4 gap-4">
                <div className="flex items-center">
                  {windowIcon}
                </div>
                <div className="flex flex-col flex-1 text-left justify-center">
                  <h3 className="text-sm font-semibold text-white font-mono">
                    <Typewriter text={windowTitle} />
                  </h3>
                  <TextScramble
                    text={windowTitleDescription}
                    className="text-xs text-white/50 mt-0.5"
                  />
                </div>
              </div>
              <div className="flex self-stretch ml-auto">
                <motion.button
                  whileHover="hover"
                  whileTap="hover"
                  onClick={onClose}
                  className="popup-button-red !rounded-none !rounded-tr-xl !rounded-bl-xl !m-0 !p-1.5 h-full max-h-[80px] leading-none flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <ExitIcon />
                  <span>Exit</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
          <DashedSeparator />
          <div className="flex-1 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.3 }}
            >
              {children}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
