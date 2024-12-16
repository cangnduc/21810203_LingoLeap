import React from "react";

export default function InputField({
  id,
  type,
  registerOptions,
  className,
  placeholder,
  required,
}) {
  return (
    <input
      id={id}
      type={type}
      {...registerOptions}
      className={className}
      placeholder={placeholder}
      required={required}
    />
  );
}
