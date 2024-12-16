import React from "react";
import { Star, Clock } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";

const ReviewCard = ({ review }) => {
  const { user, comments, rating, createdAt } = review;

  // Format the date
  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.username}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <Avatar>
              <AvatarFallback>
                {user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
          <div className="space-y-1">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
              {user.username}
            </h3>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Clock className="h-3 w-3 mr-1" />
              {formattedDate}
            </div>
          </div>
        </div>
        {rating?.value && (
          <div className="flex items-center space-x-1">
            <Star className="h-5 w-5 text-yellow-400" />
            <span className="text-gray-600 dark:text-gray-300">
              {rating.value}/5
            </span>
          </div>
        )}
      </div>
      {comments && comments.length > 0 && (
        <div className="space-y-2">
          {comments.map((comment, index) => (
            <p
              key={index}
              className="text-gray-600 dark:text-gray-300 leading-relaxed"
            >
              {comment.text}
              <span className="text-xs text-gray-400 ml-2">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
