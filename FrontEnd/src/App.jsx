import React, { useEffect, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import Navigation from "./components/nav/Navigation";
import Loader from "./components/loader";

// Lazy load all pages
const Home = React.lazy(() => import("./pages/Home"));
const Test = React.lazy(() => import("./pages/Tests"));
const Auth = React.lazy(() => import("./pages/Auth"));
const AddQuestion = React.lazy(() => import("./pages/AddQuestion"));
const TestCreation = React.lazy(() => import("./pages/TestCreationV1"));
const TestDetail = React.lazy(() => import("./pages/Tests/test.detail"));
const TestAttempt = React.lazy(() => import("./pages/TestAttempt"));
const Contact = React.lazy(() => import("./pages/Contact"));
const ViewTestAttempt = React.lazy(() => import("./pages/viewTestAttempt"));
const TestResult = React.lazy(() => import("./pages/TestResult"));
const Profile = React.lazy(() => import("./pages/Profile"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const MyQuestions = React.lazy(() => import("./pages/MyQuestions"));
const EditQuestion = React.lazy(() =>
  import("./pages/MyQuestions/EditQuestion")
);
// Import other non-page components normally
import PageTransition from "./components/PageTransition";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const location = useLocation();
  const isDarkMode = useSelector((state) => state.app.isDarkMode);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);
  useEffect(() => {
    import("./pages/Tests");
    import("./pages/AddQuestion");
    import("./pages/MyQuestions");
  }, []);
  // Create a better loading component
  const LoadingFallback = () => (
    <div className="min-h-screen flex items-center justify-center">
      <Loader />
    </div>
  );

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

    {
      path: `/view-test-attempts/${user?._id}`,
      element: <ViewTestAttempt />,
      roles: ["admin", "teacher", "user"],
    },
    {
      path: "/question",
      element: <AddQuestion />,
      roles: ["admin", "teacher"],
    },
    {
      path: "/question/:id/edit",
      element: <EditQuestion />,
      roles: ["admin", "teacher"],
    },
    {
      path: "/my-questions",
      element: <MyQuestions />,
      roles: ["admin", "teacher"],
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
    {
      path: "/test-results/:attemptId",
      element: <TestResult />,
    },
    {
      path: "/profile",
      element: <Profile />,
      roles: ["admin", "teacher", "user"],
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ];

  return (
    <div className="App min-h-screen">
      <Navigation />
      <Suspense fallback={<LoadingFallback />}>
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
      </Suspense>
    </div>
  );
}

export default App;
