import React from "react";

export default function TextareaField({
  id,
  registerOptions,
  className,
  placeholder,
  required,
  defaultValue,
}) {
  return (
    <textarea
      id={id}
      {...registerOptions}
      className={className}
      placeholder={placeholder}
      required={required}
      defaultValue={defaultValue}
    />
  );
}
