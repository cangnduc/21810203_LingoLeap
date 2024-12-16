import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaEnvelope, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { FaNoteSticky, FaUser } from "react-icons/fa6";
import { useLogoutMutation } from "@/app/services/authApi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "@/app/features/authSlice";
const UserProfile = ({ toggleClose }) => {
  const user = useSelector((state) => state.auth.user);
  const [error, setError] = useState(null);
  const [logoutApi, { isLoading: isLogoutLoading }] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const result = await logoutApi().unwrap();
      if (result) {
        dispatch(logout());
        navigate("/login");
        window.location.reload();
      }
    } catch (error) {
      setError(error?.data?.message);
    }
  };
  return (
    <div className="flex flex-col gap-5 p-4 bg-white dark:bg-gray-900 rounded-lg mt-5">
      <div className="flex items-center gap-3">
        <FaUserCircle className="text-blue-500 text-3xl" />
        <div>
          <p className="text-gray-800 dark:text-white text-lg font-bold">
            {user ? user.username : "Guest"}
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center gap-1">
            <FaEnvelope className="text-blue-500" />
            {user ? user.email : "guest@example.com"}
          </p>
        </div>
      </div>
      <div>
        <Link
          to={`/view-test-attempts/${user?._id}`}
          className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors flex items-center gap-2"
          onClick={toggleClose}
        >
          <FaNoteSticky />
          View Test Attempts
        </Link>
      </div>
      <div>
        <Link
          to="/profile"
          className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors flex items-center gap-2"
          onClick={toggleClose}
        >
          <FaUser />
          Profile
        </Link>
      </div>
      <div></div>
      <button
        onClick={() => {
          handleLogout();
          toggleClose();
        }}
        className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors flex items-center gap-2"
      >
        <FaSignOutAlt />
        {isLogoutLoading ? "Logging out..." : "Logout"}
      </button>
    </div>
  );
};

export default UserProfile;
