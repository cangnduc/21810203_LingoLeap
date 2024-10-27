import React from "react";

const Selection = ({ children, className, label, options, ...props }) => {
  return (
    <div className="relative">
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
      <label
        htmlFor={label}
        className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-black px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-200 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
      >
        {label}
      </label>
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center px-2 text-gray-700 dark:text-gray-400">
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

export default Selection;
