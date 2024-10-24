import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import Navigation from "./components/nav/Navigation";
import Home from "./pages/Home";
import Test from "./pages/Test";
import Courses from "./pages/Courses";
import Contact from "./pages/Contact";
import PageTransition from "./components/PageTransition";
import AiAssisstant from "./pages/AiAssisstant";
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
import AddQuestion from "./pages/AddQuestion";
import TestCreation from "./pages/TestCreation";
function App() {
  const location = useLocation();
  const isDarkMode = useSelector((state) => state.app.isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);
  const routes = [
    { path: "/", element: <Home /> },
    { path: "/login", element: <Auth type="login" /> },
    { path: "/register", element: <Auth type="register" /> },
    { path: "/test", element: <Test /> },
    { path: "/courses", element: <Courses />, roles: ["admin", "user"] },
    { path: "/chat", element: <AiAssisstant />, roles: ["admin", "user"] },
    { path: "/question", element: <AddQuestion />, roles: ["admin", "user"] },
    {
      path: "/test-creation",
      element: <TestCreation />,
      roles: ["user"],
    },
  ];
  return (
    <div className="App">
      <Navigation />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                route.roles ? (
                  <ProtectedRoute allowedRoles={route.roles}>
                    <PageTransition>{route.element}</PageTransition>
                  </ProtectedRoute>
                ) : (
                  <PageTransition>{route.element}</PageTransition>
                )
              }
            />
          ))}
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
