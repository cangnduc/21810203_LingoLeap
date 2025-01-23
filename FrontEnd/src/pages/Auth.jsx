import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Container from "../components/Container";
import { useLocation, useNavigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import { GoogleOAuthProvider } from "@react-oauth/google";

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    setIsLogin(location.pathname === "/login");
  }, [location.pathname]);

  const toggleForm = () => {
    if (isLogin) {
      navigate("/register");
    } else {
      navigate("/login");
    }
  };

  return (
    <Container className="h-[90vh] flex items-center justify-center">
      <motion.div
        className="bg-gradient-light dark:bg-gradient-dark w-full max-w-md"
        layout
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="bg-box-light dark:bg-box-dark p-8 rounded-lg shadow-lg w-full"
          layout
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-primary-light dark:text-primary-dark">
            {isLogin ? "Login" : "Register"}
          </h2>

          {isLogin ? (
            <GoogleOAuthProvider clientId="430282457443-05qn0bukdmgchidlcab4q2g36tqvidhj.apps.googleusercontent.com">
              <Login />
            </GoogleOAuthProvider>
          ) : (
            <Register />
          )}

          <p className="mt-4 text-center text-text-light dark:text-text-dark">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={toggleForm}
              className="ml-1 text-primary-light dark:text-primary-dark hover:underline"
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </p>
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default Auth;
