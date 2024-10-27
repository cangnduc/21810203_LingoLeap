import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
// Import icons (assuming you're using a library like react-icons)
import {
  FaHome,
  FaClipboardCheck,
  FaBook,
  FaGamepad,
  FaEnvelope,
  FaSignInAlt,
  FaUserPlus,
  FaQuestion,
  FaPen,
} from "react-icons/fa";
import { RiSpeakFill } from "react-icons/ri";

export default function NavLinks({ className = "", showIcons = false }) {
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

  const defaultIcons = {
    "/": FaHome,
    "/test": FaClipboardCheck,
    "/courses": FaBook,
    "/question": FaQuestion,
    "/game": FaGamepad,
    "/chat": RiSpeakFill,
    "/login": FaSignInAlt,
    "/register": FaUserPlus,
    "/test-creation": FaPen,
  };

  const NavLink = ({ to, children }) => {
    const isActive = location.pathname === to;
    const Icon = defaultIcons[to];

    return (
      <Link
        to={to}
        className={`${
          isActive
            ? "text-black font-semibold dark:text-white bg-gray-200 dark:bg-gray-800 rounded-md"
            : ""
        } ${className}`}
      >
        {showIcons && Icon && <Icon className="w-5 h-5" />}
        {children}
      </Link>
    );
  };

  return (
    <>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/test-creation">Tests</NavLink>
      <NavLink to="/chat">Speaking</NavLink> <NavLink to="/game">Game</NavLink>
      <NavLink to="/question">Questions</NavLink>
      {!user && (
        <>
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/register">Signup</NavLink>
        </>
      )}
    </>
  );
}
