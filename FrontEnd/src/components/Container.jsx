import React from "react";
import { useSelector } from "react-redux";
export default function Container({ children, className }) {
  return <div className={`${className}`}>{children}</div>;
}
