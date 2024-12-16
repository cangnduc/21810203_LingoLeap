import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { useRegisterMutation } from "../app/services/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../app/features/authSlice";
import { useNavigate } from "react-router-dom";
import { signupSchema } from "../validator/auth.validator";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [errors, setErrors] = useState({});
  const [register, { isLoading }] = useRegisterMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      // Validate form data
      const validatedData = signupSchema.parse(formData);

      // If validation passes, proceed with registration
      const result = await register({
        username: validatedData.username,
        email: validatedData.email,
        password: validatedData.password,
        role: validatedData.role,
      }).unwrap();

      dispatch(setCredentials({ ...result }));
      navigate("/");
    } catch (err) {
      if (err.errors) {
        // Handle Zod validation errors
        const newErrors = {};
        err.errors.forEach((error) => {
          newErrors[error.path[0]] = error.message;
        });
        setErrors(newErrors);
      } else {
        // Handle API errors
        setErrors({
          api: err.data?.message || "An error occurred during registration",
        });
      }
    }
  };

  return (
    <form onSubmit={submitHandler} className="space-y-4">
      <div>
        <input
          name="username"
          onChange={handleChange}
          value={formData.username}
          type="text"
          placeholder="Full Name"
          className={`w-full p-3 rounded border ${
            errors.username
              ? "border-red-500"
              : "border-border-light dark:border-border-dark"
          } bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark`}
        />
        {errors.username && (
          <p className="text-red-500 text-sm mt-1">{errors.username}</p>
        )}
      </div>

      <div>
        <input
          name="email"
          onChange={handleChange}
          value={formData.email}
          type="email"
          placeholder="Email"
          className={`w-full p-3 rounded border ${
            errors.email
              ? "border-red-500"
              : "border-border-light dark:border-border-dark"
          } bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      <div>
        <input
          name="password"
          onChange={handleChange}
          value={formData.password}
          type="password"
          placeholder="Password"
          className={`w-full p-3 rounded border ${
            errors.password
              ? "border-red-500"
              : "border-border-light dark:border-border-dark"
          } bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark`}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        )}
      </div>

      <div className="relative">
        <input
          name="confirmPassword"
          onChange={handleChange}
          value={formData.confirmPassword}
          type="password"
          placeholder="Confirm Password"
          className={`w-full p-3 rounded border ${
            errors.confirmPassword
              ? "border-red-500"
              : formData.confirmPassword && !errors.confirmPassword
              ? "border-green-500"
              : "border-border-light dark:border-border-dark"
          } bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark`}
        />
        {formData.confirmPassword && !errors.confirmPassword && (
          <FaCheck className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" />
        )}
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
        )}
      </div>

      <div>
        <select
          name="role"
          onChange={handleChange}
          value={formData.role}
          className={`w-full p-3 rounded border ${
            errors.role
              ? "border-red-500"
              : "border-border-light dark:border-border-dark"
          } bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark`}
        >
          <option value="">Select Role</option>
          <option value="user">Student</option>
          <option value="teacher">Teacher</option>
        </select>
        {errors.role && (
          <p className="text-red-500 text-sm mt-1">{errors.role}</p>
        )}
      </div>

      {errors.api && <p className="text-red-500 text-center">{errors.api}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-button-gradient-light dark:bg-button-gradient-dark text-white p-3 rounded transition duration-300 hover:opacity-90 disabled:opacity-50"
      >
        {isLoading ? "Loading..." : "Register"}
      </button>
    </form>
  );
};

export default Register;
