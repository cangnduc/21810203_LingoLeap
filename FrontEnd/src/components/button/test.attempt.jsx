import React from "react";
import { Play } from "lucide-react";
const TestAttemptButton = ({ onClick }) => {
  return (
    <div className="flex items-center justify-center text-green-500 hover:text-green-600 border border-green-500 hover:border-green-600 rounded-md p-1">
      <button className="flex items-center gap-0.5" onClick={onClick}>
        <Play className="w-3.5 h-3.5" />
        <span className="hidden md:block text-xs px-1">Attempt</span>
      </button>
    </div>
  );
};
export default TestAttemptButton;
