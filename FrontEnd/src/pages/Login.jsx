import React, { useState } from "react";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { useLoginMutation } from "@/app/services/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/app/features/authSlice";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { BACKEND_URL } from "@/constant";
const Login = () => {
  const [email, setEmail] = useState("john.doe@example.com");
  const [password, setPassword] = useState("password123");
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const result = await login({ email, password }).unwrap();
      if (result.user) {
        dispatch(setCredentials({ ...result }));
        navigate("/");
      }
      // toast.success("Login successful!");
    } catch (err) {
      setErrorMessage(
        err.data?.errors ||
          err.errors ||
          "An error occurred during authentication"
      );
      console.error("Failed to login:", err);
    }
  };
  const handleGoogleLogin = async (credentialResponse) => {
    const token = credentialResponse.access_token;

    const response = await fetch(`${BACKEND_URL}/api/v1/auth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });
    const data = await response.json();
    dispatch(setCredentials({ ...data }));
    navigate("/");
  };
  const loginWithGoogle = useGoogleLogin({
    onSuccess: (codeResponse) => {
      handleGoogleLogin(codeResponse);
    },
  });
  return (
    <>
      <form onSubmit={submitHandler} className="space-y-4">
        <input
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          value={email}
          required
          placeholder="Email"
          className="w-full p-3 rounded border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark"
        />
        <div className="relative">
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            value={password}
            required
            placeholder="Password"
            className="w-full p-3 rounded border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark"
          />
        </div>
        {/* {error && (
        <p className="text-red-500 text-center">
          {error?.data?.message || "An error occurred"}
        </p>
      )} */}
        {errorMessage && (
          <p className="text-red-500 text-center">{errorMessage}</p>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-button-gradient-light dark:bg-button-gradient-dark text-white p-3 rounded transition duration-300 hover:opacity-90 disabled:opacity-50"
        >
          {isLoading ? "Loading..." : "Login"}
        </button>
        <div className="mt-4 flex items-center justify-between">
          <hr className="w-full border-border-light dark:border-border-dark" />
          <span className="px-2 text-text-light dark:text-text-dark">Or</span>
          <hr className="w-full border-border-light dark:border-border-dark" />
        </div>
      </form>
      <div className="mt-4 space-y-2">
        <button
          onClick={() => loginWithGoogle()}
          className="w-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white p-3 rounded transition duration-300"
        >
          <FaGoogle className="mr-2" /> Continue with Google
        </button>
      </div>
    </>
  );
};

export default Login;
