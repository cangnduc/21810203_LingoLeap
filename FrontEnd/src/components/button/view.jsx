import { Eye } from "lucide-react";
const ViewButton = ({ onClick }) => {
  return (
    <div className="flex items-center justify-center text-blue-500 hover:text-blue-600 border border-blue-500 hover:border-blue-600 rounded-md p-1">
      <button className="flex items-center gap-0.5" onClick={onClick}>
        <Eye className="w-3.5 h-3.5" />
        <span className="hidden md:block text-xs px-1">View</span>
      </button>
    </div>
  );
};
export default ViewButton;
