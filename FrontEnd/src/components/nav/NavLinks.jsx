import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  RiHomeFill,
  RiTestTubeFill,
  RiChat3Fill,
  RiQuestionFill,
  RiContactsFill,
  RiLoginBoxFill,
  RiUserAddFill,
} from "react-icons/ri";

export default function NavLinks({ className = "", showIcons = false }) {
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

  const siteLinks = {
    "/": RiHomeFill,
    "/test-creation": RiTestTubeFill,
    "/chat": RiChat3Fill,
    "/tests": RiTestTubeFill,
    "/question": RiQuestionFill,
    "/contact": RiContactsFill,
    "/login": RiLoginBoxFill,
    "/register": RiUserAddFill,
  };

  const NavLink = ({ to, children }) => {
    const isActive = location.pathname === to;
    const Icon = siteLinks[to];

    return (
      <Link
        to={to}
        className={`${
          isActive
            ? "text-black font-semibold dark:text-white bg-gray-200 dark:bg-gray-800 rounded-md"
            : ""
        } ${className} flex items-center gap-2 whitespace-nowrap overflow-hidden text-ellipsis px-2 md:px-3 lg:px-5`}
      >
        {showIcons && Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
        {children}
      </Link>
    );
  };

  return (
    <>
      <NavLink to="/">Home</NavLink>
      {(user?.role.includes("admin") || user?.role.includes("teacher")) && (
        <NavLink to="/test-creation">Tests Creation</NavLink>
      )}
      <NavLink to="/tests">Tests</NavLink>

      {user?.role.includes("admin") ||
        (user?.role.includes("teacher") && (
          <>
            <NavLink to="/question">Add Questions</NavLink>
            <NavLink to="/my-questions">My Questions</NavLink>
          </>
        ))}
      <NavLink to="/contact">Contact</NavLink>
      {!user && (
        <>
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/register">Signup</NavLink>
        </>
      )}
    </>
  );
}
