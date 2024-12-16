import { Star } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";

const RatingSummary = ({ ratings }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
        User Ratings
      </h3>
      <div className="space-y-3">
        {ratings.map((rating) => (
          <div
            key={rating._id}
            className="flex items-center justify-between py-2 border-b last:border-0 dark:border-gray-700"
          >
            <div className="flex items-center space-x-3">
              {rating.user.avatar ? (
                <img
                  src={rating.user.avatar}
                  alt={rating.user.username}
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="text-xs">
                    {rating.user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {rating.user.username}
              </span>
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                {rating.rating.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
