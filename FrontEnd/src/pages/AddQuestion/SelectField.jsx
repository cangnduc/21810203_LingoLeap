import React from "react";

export default function SelectField({
  id,
  registerOptions,
  className,
  placeholder,
  options,
  transform,
}) {
  return (
    <select id={id} {...registerOptions} className={className}>
      <option value="" disabled hidden>
        {placeholder}
      </option>
      {options.map((option) => (
        <option
          key={option.value}
          value={transform.input(option.value)}
          className="dark:bg-black dark:text-gray-300"
        >
          {option.label}
        </option>
      ))}
    </select>
  );
}
