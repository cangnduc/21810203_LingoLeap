import React, { useRef, useEffect } from "react";
import { useSelector } from "react-redux";

import Logout from "./Logout";
const UserProfile = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
          {user ? user.username.slice(0, 2).toUpperCase() : "U"}
        </div>
        <p className="text-white text-sm font-bold">
          {user ? user.email : "Guest"}
        </p>
      </div>
      <div className="">
        <p className="text-white text-sm font-bold">
          Welcome, {user ? user.username : "Guest"}
        </p>
      </div>
      <div className="">
        <Logout />
      </div>
    </div>
  );
};

export default UserProfile;
