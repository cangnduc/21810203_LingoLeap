import React from "react";

export const Avatar = ({ children, className = "" }) => {
  return (
    <div
      className={`relative inline-block h-10 w-10 rounded-full bg-gray-200 ${className}`}
    >
      {children}
    </div>
  );
};

export const AvatarFallback = ({ children, className = "" }) => {
  return (
    <div
      className={`flex h-full w-full items-center justify-center rounded-full bg-gray-200 text-gray-600 ${className}`}
    >
      {children}
    </div>
  );
};
