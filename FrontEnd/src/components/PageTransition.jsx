import React from "react";
import { motion } from "framer-motion";

const PageTransition = ({
  children,
  initial = { opacity: 0 },
  animate = { opacity: 1 },
  exit = { opacity: 0 },
  duration = 0.25,
}) => {
  return (
    <motion.div
      initial={initial}
      animate={animate}
      exit={exit}
      transition={{ duration: duration }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
