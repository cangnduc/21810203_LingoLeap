import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { AnimatePresence } from "framer-motion";
const Sidebar = ({ className, toggleClose, children, position }) => {
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        toggleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [toggleClose]);

  return (
    <motion.div
      ref={profileRef}
      initial={{ opacity: 0, x: position === "left" ? -300 : 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: position === "left" ? -300 : 300 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-0 ${
        position === "left" ? "left-0" : "right-0"
      } h-full w-[280px] max-w-[80vw] bg-white dark:bg-gray-900 shadow-xl z-50 ${className}`}
    >
      {children}
      <div className="absolute top-[2vh] right-[2vh]">
        <button onClick={() => toggleClose()}>
          <X size={24} />
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
