import { useState } from "react";
import { useAddCommentMutation } from "@/app/services/reviewApi";

const AddComment = ({ testId }) => {
  const [comment, setComment] = useState("");
  const [addComment, { isLoading }] = useAddCommentMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      await addComment({ testId, comment: comment.trim() }).unwrap();
      setComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="comment"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Add a Comment
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
          placeholder="Share your thoughts..."
        />
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg 
                 hover:bg-blue-700 focus:outline-none focus:ring-2 
                 focus:ring-blue-500 focus:ring-offset-2 
                 dark:focus:ring-offset-gray-800 transition-colors
                 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading || !comment.trim()}
      >
        Add Comment
      </button>
    </form>
  );
};

export default AddComment;
