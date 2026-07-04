"use client";

import { useRef } from "react";
import { motion, useDragControls, AnimatePresence, } from "framer-motion";
import DashedSeparator from "./dashedSeperator";
import Typewriter from "./typewriter";
import ExitIcon from "../icons/exit";
import { buttonStyles } from "@/src/styles/buttonStyles";
import { popupWindow } from "@/src/styles/windows";
import { transparentNoGlass } from "@/src/styles/surfaces";
import { animationVariants } from "../utils/globals";

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
  const dragControls = useDragControls();
  const windowRef = useRef<HTMLDivElement>(null);

  return (
    <AnimatePresence>
      {isEnabled && (
        <div
          ref={windowRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none w-[100dvw] h-[100dvh]"
        >
          <motion.div
            className="z-10 pointer-events-auto select-none flex flex-col 
              justify-center w-[inherit] max-h-full
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
              className={`${popupWindow} ${transparentNoGlass}`}
              variants={animationVariants.popupWindowVariant}
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
                      <span className="text-xs text-white/50 mt-0.5">
                        {windowTitleDescription}
                      </span>
                    </div>
                  </div>
                  <div className="flex self-stretch ml-auto">
                    <motion.button
                      whileHover="hover"
                      whileTap="hover"
                      onClick={() => onClose?.()}
                      className={`${buttonStyles.red} !rounded-none !rounded-tr-xl !rounded-bl-xl !m-0 !p-1.5 h-full max-h-[80px] leading-none flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap`}
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
                  variants={animationVariants.popupWindowChildrenContentVariant}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                >
                  {children}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}