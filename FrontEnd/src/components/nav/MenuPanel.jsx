import React from "react";
import NavLinks from "./NavLinks";
import { Link } from "react-router-dom";
import logo from "../logo";
export default function MenuPanel({ className, toggleMenu }) {
  return (
    <div className="flex-grow">
      <div className="flex flex-col p-2 w-full mb-5">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold font-serif drop-shadow-glow">
          <span className="text-blue1 dark:text-blue10">Learn</span>
          <span className="text-indigo-500">App</span>
        </Link>
      </div>
      <NavLinks className="flex gap-3 items-center p-2" showIcons={true} />
    </div>
  );
}
