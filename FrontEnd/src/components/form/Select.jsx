import React from "react";

const Selection = ({ children, className, label, options, ...props }) => {
  return (
    <div className={`relative`}>
      <select
        id={label}
        {...props}
        className={`w-full
    block px-2.5 pb-2.5 pt-4 text-sm text-gray-900 bg-transparent border rounded-lg border-1 border-gray-300 shadow-sm appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer
    ${className}`}
      >
        {options.map((option, index) => (
          <option
            className="dark:bg-black dark:text-gray-300"
            key={index}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Selection;
