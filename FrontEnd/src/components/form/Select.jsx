import React from "react";

const Select = ({ children, className, label, options, ...props }) => {
  return (
    <div className="relative min-w-[200px]">
      <select
        id={label}
        {...props}
        className={`w-full
        block px-3 py-2 text-sm text-gray-900 bg-white border rounded-lg border-gray-300 
        appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
        dark:bg-black dark:text-white dark:border-gray-600 dark:focus:border-blue-500
        ${className}`}
      >
        {options?.map((option, index) => (
          <option
            className="dark:bg-black dark:text-gray-300"
            key={index}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
      {label && (
        <label
          htmlFor={label}
          className="absolute text-xs text-gray-500 dark:text-gray-400 -top-2 left-2 bg-white dark:bg-black px-1"
        >
          {label}
        </label>
      )}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-400">
        <svg
          className="fill-current h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
};

export default Select;
