import { useState } from "react";
import { Star } from "lucide-react";
import { useAddRatingMutation } from "@/app/services/reviewApi";

const AddRating = ({ testId }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [addRating, { isLoading }] = useAddRatingMutation();

  const handleStarClick = async (selectedRating) => {
    try {
      await addRating({ testId, rating: selectedRating }).unwrap();
      setRating(selectedRating);
    } catch (error) {
      console.error("Failed to add rating:", error);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Rating
      </label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className="focus:outline-none"
            disabled={isLoading}
          >
            <Star
              className={`w-8 h-8 ${
                star <= (hoveredRating || rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300 dark:text-gray-600"
              } transition-colors duration-150`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default AddRating;
