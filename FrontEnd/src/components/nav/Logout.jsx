import { useLogoutMutation } from "../../app/services/authApi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../app/features/authSlice";
import { useState } from "react";
export default function Logout() {
  const [logoutApi, { isLoading: isLogoutLoading }] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const handleLogout = async () => {
    try {
      const result = await logoutApi();
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
    <div>
      <button onClick={handleLogout}>
        {isLogoutLoading ? "Logging out..." : "Logout"}
      </button>
      {error && <div>{error}</div>}
    </div>
  );
}
