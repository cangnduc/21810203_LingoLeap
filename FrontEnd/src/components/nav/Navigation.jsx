import React, { useState, useCallback } from "react";
import { Sun, Moon } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import Sidebar from "../Sidebar";
import UserIcon from "./userIcon";
import { toggleDarkMode } from "@/app/features/appSlice";
import { Link } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import MenuPanel from "./MenuPanel";
import UserProfile from "./UserProfile";
import NavLinks from "./NavLinks";
export default function Navigation() {
  const isDarkMode = useSelector((state) => state.app.isDarkMode);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode());
  };
  const toggleProfile = useCallback(() => {
    setIsProfileOpen((prev) => !prev);
  }, []);

  return (
    <>
      <nav className="sticky top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 transition-colors duration-300 shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between max-w-full overflow-x-hidden">
          <button
            onClick={toggleMenu}
            aria-label="Toggle menu"
            className={`menu-icon md:hidden  ${isMenuOpen ? "open" : ""}`}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <Link
            to="/"
            className="text-2xl font-bold font-serif drop-shadow-glow"
          >
            <span className="text-blue1 dark:text-blue10">Lingo</span>
            <span className="text-indigo-500">Leap</span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {/* NavLinks */}
            <NavLinks className="py-2 font-bold hover:opacity-80 transition-opacity duration-200 relative px-5  " />
          </div>
          {/* User Profile */}
          <div className="hidden md:flex items-center gap-2">
            {" "}
            <button onClick={toggleProfile}>
              {user && <UserIcon user={user} />}
            </button>
            <button
              onClick={handleToggleDarkMode}
              className="hover:opacity-80 transition-opacity duration-200"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </div>
          <div className="md:hidden flex items-center space-x-4">
            {/* User Profile */}
            <button onClick={toggleProfile}>
              <UserIcon user={user} />
            </button>
            <button
              onClick={handleToggleDarkMode}
              className="hover:opacity-80 transition-opacity duration-200"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </div>
        </div>
        {/* Mobile Menu */}{" "}
        <div className="h-[1px] bg-gray-400 dark:bg-blue-900 w-full z-50 bottom-0"></div>
      </nav>
      <AnimatePresence>
        {isProfileOpen && user && (
          <Sidebar toggleClose={toggleProfile} position="right">
            <UserProfile toggleClose={toggleProfile} />
          </Sidebar>
        )}
      </AnimatePresence>{" "}
      <AnimatePresence>
        {isMenuOpen && (
          <Sidebar toggleClose={toggleMenu} position="left">
            <MenuPanel />
          </Sidebar>
        )}
      </AnimatePresence>
    </>
  );
}
