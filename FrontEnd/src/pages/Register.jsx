import React, { useState, useEffect } from "react";
import { FaCheck } from "react-icons/fa";
import { useRegisterMutation } from "../app/services/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../app/features/authSlice";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [register, { isLoading, error }] = useRegisterMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setPasswordsMatch(password === confirmPassword && password !== "");
  }, [password, confirmPassword]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const result = await register({
        username: name,
        email,
        password,
        role,
      }).unwrap();
      dispatch(setCredentials({ ...result }));
      navigate("/");
      // toast.success("Registration successful!");
    } catch (err) {
      setErrorMessage(
        err.data?.message ||
          err.message ||
          "An error occurred during registration"
      );
      console.error("Failed to register:", err);
    }
  };

  return (
    <form onSubmit={submitHandler} className="space-y-4">
      <input
        onChange={(e) => setName(e.target.value)}
        type="text"
        placeholder="Full Name"
        required
        className="w-full p-3 rounded border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark"
      />
      <input
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        required
        placeholder="Email"
        className="w-full p-3 rounded border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark"
      />
      <div className="relative">
        <input
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
          placeholder="Password"
          className="w-full p-3 rounded border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark"
        />
      </div>
      <div className="relative">
        <input
          onChange={(e) => setConfirmPassword(e.target.value)}
          type="password"
          required
          placeholder="Confirm Password"
          className={`w-full p-3 rounded border ${
            confirmPassword
              ? passwordsMatch
                ? "border-green-500"
                : "border-red-500"
              : "border-border-light dark:border-border-dark"
          } bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark`}
        />
        {passwordsMatch && confirmPassword && (
          <FaCheck className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" />
        )}
      </div>
      <select
        onChange={(e) => setRole(e.target.value)}
        required
        className="w-full p-3 rounded border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark"
      >
        <option value="">Select Role</option>
        <option value="user">Student</option>
        <option value="teacher">Teacher</option>
      </select>
      {error && (
        <p className="text-red-500 text-center">
          {error?.data?.message || "An error occurred"}
        </p>
      )}
      {errorMessage && (
        <p className="text-red-500 text-center">{errorMessage}</p>
      )}
      <button
        type="submit"
        disabled={isLoading || !passwordsMatch}
        className="w-full bg-button-gradient-light dark:bg-button-gradient-dark text-white p-3 rounded transition duration-300 hover:opacity-90 disabled:opacity-50"
      >
        {isLoading ? "Loading..." : "Register"}
      </button>
    </form>
  );
};

export default Register;
