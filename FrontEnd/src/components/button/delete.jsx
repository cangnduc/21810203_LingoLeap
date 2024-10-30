import React from "react";
import { Trash } from "lucide-react";
const DeleteButton = ({ onClick, isLoading }) => {
  return (
    <div className="flex items-center justify-center text-red-500 hover:text-red-600 border border-red-500 hover:border-red-600 rounded-md p-1">
      <button
        className="flex items-center gap-0.5"
        onClick={onClick}
        disabled={isLoading}
      >
        <Trash className="w-3.5 h-3.5" />
        <span className="hidden md:block text-xs px-1">Delete</span>
      </button>
    </div>
  );
};
export default DeleteButton;
