import { Avatar, AvatarFallback } from "../ui/avatar";
import { Clock, Star } from "lucide-react";

const CommentCard = ({ comment }) => {
  const formattedDate = new Date(comment.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );

  // Find the rating for this comment's user

  // Get the first letter of username safely
  const userInitial = comment.user?.username
    ? comment.user.username.charAt(0).toUpperCase()
    : "?";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4 mb-3">
        {comment.user?.avatar ? (
          <img
            src={comment.user.avatar}
            alt={comment.user?.username || "User"}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <Avatar>
            <AvatarFallback>{userInitial}</AvatarFallback>
          </Avatar>
        )}
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-medium text-gray-800 dark:text-gray-100">
              {comment.user?.username || "Anonymous"}
            </h4>
          </div>
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Clock className="h-3 w-3 mr-1" />
            {formattedDate}
          </div>
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-300 text-sm">{comment.text}</p>
    </div>
  );
};

export default CommentCard;
