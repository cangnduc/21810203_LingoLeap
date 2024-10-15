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
      className={`p-5 w-[300px] h-[98vh] bg-gray-900 fixed rounded-lg ${
        position === "left" ? "left-[1vh] top-[1vh]" : "right-[1vh] top-[1vh]"
      } z-50 justify-between ${className}`}
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
