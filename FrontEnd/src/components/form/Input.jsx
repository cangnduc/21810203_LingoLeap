import React from "react";
import { motion } from "framer-motion";

const Input = ({ children, className, label, ...props }) => {
  const renderInput = () => {
    const baseClasses = `w-full block px-2.5 pb-2.5 pt-4 text-sm text-gray-900 bg-transparent border rounded-lg border-1 border-gray-300 shadow-sm appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer`;

    const dateInputClasses =
      props.type === "date" ? "dark:calendar-icon-white pr-4" : "";

    return (
      <input
        {...props}
        className={`${baseClasses} ${dateInputClasses} ${className}`}
      >
        {children}
      </input>
    );
  };

  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative">
        {renderInput()}
        <label
          htmlFor={label}
          className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-black px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-200 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
        >
          {label}
        </label>
      </div>
    </motion.div>
  );
};

export default Input;
