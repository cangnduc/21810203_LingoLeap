import { useState } from "react";
import { Star } from "lucide-react";
const AddReview = ({ testId }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleStarClick = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleStarHover = (hoveredValue) => {
    setHoveredRating(hoveredValue);
  };
  const clearForm = () => {
    setRating(0);
    setComment("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await createReview({ testId, rating, comment }).unwrap();
    if (result) {
      clearForm();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Add Your Review
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
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
                onMouseEnter={() => handleStarHover(star)}
                onMouseLeave={() => handleStarHover(0)}
                className="focus:outline-none"
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

        <div className="space-y-2">
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Your Review
          </label>
          <textarea
            id="comment"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 
                     focus:border-blue-500 bg-white dark:bg-gray-700 
                     text-gray-900 dark:text-gray-100 border-gray-300 
                     dark:border-gray-600 placeholder-gray-400 
                     dark:placeholder-gray-500"
            placeholder="Share your experience..."
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg 
                   hover:bg-blue-700 focus:outline-none focus:ring-2 
                   focus:ring-blue-500 focus:ring-offset-2 
                   dark:focus:ring-offset-gray-800 transition-colors
                   disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!rating || !comment.trim()}
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default AddReview;
