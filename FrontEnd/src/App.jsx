import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import Navigation from "./components/nav/Navigation";
import Home from "./pages/Home";
import Test from "./pages/Tests";
import Courses from "./pages/Courses";
import PageTransition from "./components/PageTransition";
import AiAssisstant from "./pages/AiAssisstant";
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
import AddQuestion from "./pages/AddQuestion";
import TestCreation from "./pages/TestCreationV1";
import TestDetail from "./pages/Tests/test.detail";
import TestAttempt from "./pages/TestAttempt";
import Contact from "./pages/Contact";
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
    { path: "/tests", roles: ["admin", "teacher", "user"], element: <Test /> },
    {
      path: "/tests/:id",
      element: <TestDetail />,
      roles: ["admin", "teacher", "user"],
    },
    {
      path: "/tests/:id/edit",
      element: <TestCreation mode="edit" />,
      roles: ["admin", "teacher"],
    },
    { path: "/courses", element: <Courses />, roles: ["admin", "user"] },

    {
      path: "/chat",
      element: <AiAssisstant />,
      roles: ["admin", "teacher", "user"],
    },
    {
      path: "/question",
      element: <AddQuestion />,
      roles: ["admin", "user", "teacher"],
    },
    {
      path: "/test-attempt/:testAttemptId",
      element: <TestAttempt />,
      roles: ["admin", "teacher", "user"],
    },
    {
      path: "/test-creation",
      element: <TestCreation />,
      roles: ["admin", "teacher"],
    },
    {
      path: "/contact",
      element: <Contact />,
      roles: ["admin", "teacher", "user"],
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
