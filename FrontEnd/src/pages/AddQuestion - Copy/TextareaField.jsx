import React from "react";

export default function TextareaField({
  id,
  registerOptions,
  className,
  placeholder,
  required,
}) {
  return (
    <textarea
      id={id}
      {...registerOptions}
      className={className}
      placeholder={placeholder}
      required={required}
    />
  );
}
