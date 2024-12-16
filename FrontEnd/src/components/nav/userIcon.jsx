import { useSelector } from "react-redux";

export default function UserIcon({ user }) {
  return (
    <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
      {user?.username?.slice(0, 2).toUpperCase()}
    </div>
  );
}
