"use client";

import { Variants } from "framer-motion";

export const appVersion =
  process.env.NEXT_PUBLIC_SITE_APP_VERSION || "dev-local";
export const whatsNewJsonUrl = "/release-notes.json";
export const animationVariants: Record<string, Variants> = {
  buttonVariant: {
    hover: {
      scale: 1.05,
      boxShadow: "0px 0px 20px rgba(37, 37, 37, 0.5)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 12,
        mass: 0.6,
        layout: { type: "spring", stiffness: 300, damping: 25 },
      },
    },
    tap: {
      scale: 0.95,
      boxShadow: "0px 0px 20px rgba(66, 66, 66, 0.2)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 12,
        mass: 0.6,
        layout: { type: "spring", stiffness: 300, damping: 25 },
      },
    },
  },
  popupWindowVariant: {
    initial: {
      opacity: 0,
      scale: 0.85,
      y: 20,
    },
    enter: {
      opacity: 1,
      scale: 1,
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
      y: 10,
      transition: {
        duration: 0.15,
        delay: 0.25,
        ease: "easeIn",
      },
    },
  },
  popupWindowChildrenContentVariant: {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.09,
        delayChildren: 0.15,
      },
    },
    exit: {
      transition: {
        staggerChildren: -0.09,
        delayChildren: 0.15,
      },
    },
  },
  popupWindowChildrenItemVariant: {
    hidden: {
      opacity: 0,
      y: 25,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 18,
      },
    },
    exit: {
      opacity: 0,
      y: 25,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 18,
      },
    },
  },
};
