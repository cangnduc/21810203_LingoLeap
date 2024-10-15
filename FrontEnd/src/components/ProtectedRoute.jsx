import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({
  children,
  allowedRoles = [],
  fallbackPath = "/login",
}) => {
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();

  // Check authentication and authorization
  const isAuthenticated = !!user;
  const isAuthorized =
    allowedRoles.length === 0 || (user && allowedRoles.includes(user.role));

  if (!isAuthenticated) {
    // User is not authenticated, redirect to login
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  if (!isAuthorized) {
    // User doesn't have the required role, redirect to unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated and authorized
  return children;
};

export default ProtectedRoute;
