"use client";

import { motion } from "framer-motion";

const resetIconVariants = {
  initial: {
    rotate: 0,
  },
  hover: {
    rotate: 180,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 18,
    },
  },
}; 

export default function ResetArrowsIcon() {
  return (
    <motion.svg
      width="26px"
      height="26px"
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      variants={resetIconVariants}
    >
      <path
        fill="#a5f3fc"
        stroke="#a5f3fc"
        strokeWidth="16"
        strokeLinejoin="round"
        strokeLinecap="round"
        d="M64,256H34A222,222,0,0,1,430,118.15V85h30V190H355V160h67.27A192.21,192.21,0,0,0,256,64C150.13,64,64,150.13,64,256Zm384,0c0,105.87-86.13,192-192,192A192.21,192.21,0,0,1,89.73,352H157V322H52V427H82V393.85A222,222,0,0,0,478,256Z"
      />
    </motion.svg>
  );
}