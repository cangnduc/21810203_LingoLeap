import { useLogoutMutation } from "@/app/services/authApi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "@/app/features/authSlice";
import { useState } from "react";

export default function Logout() {
  const [logoutApi, { isLoading: isLogoutLoading }] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(logout());
      navigate("/login", { replace: true });
    } catch (error) {
      setError(error?.data?.message || "Logout failed");
    }
  };

  return (
    <div>
      <button
        onClick={handleLogout}
        disabled={isLogoutLoading}
        className="text-red-500 hover:text-red-700 disabled:opacity-50"
      >
        {isLogoutLoading ? "Logging out..." : "Logout"}
      </button>
      {error && <div className="text-red-500 text-sm">{error}</div>}
    </div>
  );
}
