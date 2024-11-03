import React from "react";
import { Play } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useCheckTestAttemptMutation } from "@/app/services/testAttemptApi";
const TestAttemptButton = ({ id }) => {
  const navigate = useNavigate();
  const [checkTestAttempt, { isLoading, error }] =
    useCheckTestAttemptMutation();

  const handleAttempt = async () => {
    const response = await checkTestAttempt({ testId: id });
    if (response.data) {
      //console.log("response", response.data);
      navigate(`/test-attempt/${response.data._id}`);
      if (response.data.test !== id) {
        toast.error("You can only attempt a test once at a time");
      }
    } else {
      toast.error(response.error?.errors);
    }
  };

  return (
    <div className="flex items-center justify-center text-green-500 hover:text-green-600 border border-green-500 hover:border-green-600 rounded-md p-1">
      <button className="flex items-center gap-0.5" onClick={handleAttempt}>
        <Play className="w-3.5 h-3.5" />
        <span className="hidden md:block text-xs px-1">Attempt</span>
      </button>
    </div>
  );
};

export default TestAttemptButton;
