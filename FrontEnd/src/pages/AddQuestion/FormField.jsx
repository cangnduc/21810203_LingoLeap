import React from "react";
import { motion } from "framer-motion";
import InputField from "./InputField";
import TextareaField from "./TextareaField";
import SelectField from "./SelectField";

export default function FormField({
  label,
  id,
  type = "text",
  register,
  errors,
  className = "",
  options = [],
  transform = { input: (v) => v, output: (v) => v },
  required = false,
  placeholder = " ",
  defaultValue = "",
  disabled = false,
}) {
  const registerOptions = {
    ...register(id, {
      setValueAs: transform.output,
    }),
  };

  const baseInputClass = `w-full
    block px-2.5 pb-2.5 pt-4 text-sm text-gray-900 bg-transparent border rounded-lg border-1  border-gray-300 dark:border-gray-600 shadow-sm appearance-none dark:text-white  dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer
    ${className}
  `;

  const renderInput = () => {
    switch (type) {
      case "textarea":
        return (
          <TextareaField
            id={id}
            registerOptions={registerOptions}
            className={baseInputClass}
            placeholder={placeholder}
            required={required}
            defaultValue={defaultValue}
            disabled={disabled}
          />
        );
      case "select":
        return (
          <SelectField
            id={id}
            registerOptions={registerOptions}
            className={baseInputClass}
            placeholder={placeholder}
            options={options}
            transform={transform}
            disabled={disabled}
          />
        );
      default:
        return (
          <InputField
            id={id}
            type={type}
            registerOptions={registerOptions}
            className={baseInputClass}
            placeholder={placeholder}
            required={required}
            defaultValue={defaultValue}
            disabled={disabled}
          />
        );
    }
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
          htmlFor={id}
          className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-black px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-200 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
        >
          {label}
        </label>
        {errors && (
          <p className="mt-1 text-sm text-red-600">{errors[label]?.message}</p>
        )}
      </div>
    </motion.div>
  );
}
