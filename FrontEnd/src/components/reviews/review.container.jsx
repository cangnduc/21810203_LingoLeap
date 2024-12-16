import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useGetReviewsByTestIdQuery } from "@/app/services/reviewApi";
import { useParams } from "react-router-dom";
import Loader from "@/components/loader";
import AddRating from "./add.rating";
import AddComment from "./add.comment";
import ScrollToTopButton from "@/components/ScrollToTopBtn";
import CommentCard from "./comment.card";
import { Button } from "../ui/button";
import { MessageCircle } from "lucide-react";

const ReviewContainer = () => {
  const { id: testId } = useParams();
  const [showComments, setShowComments] = useState(false);
  const [page, setPage] = useState(1);
  const loader = useRef(null);

  // Always fetch ratings

  // Only fetch comments when showComments is true
  const {
    data: reviewsData,
    isLoading,
    error,
    isFetching,
  } = useGetReviewsByTestIdQuery(
    {
      testId,
      page,
      limit: 5,
    },
    {
      skip: !showComments,
    }
  );

  const comments = useMemo(() => {
    return reviewsData?.data?.comments || [];
  }, [reviewsData?.data?.comments]);

  const hasMore = reviewsData?.pagination?.hasMore || false;

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!hasMore || isFetching) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isFetching]);

  // Reset page when showComments changes
  useEffect(() => {
    setPage(1);
  }, [showComments]);

  const handleViewComments = () => {
    setShowComments(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
        Reviews
      </h2>

      <div className="space-y-6 mb-8">
        <AddRating testId={testId} />
        <AddComment testId={testId} />
      </div>

      {!showComments ? (
        <Button
          onClick={handleViewComments}
          className="w-full flex items-center justify-center gap-2 py-3"
        >
          <MessageCircle className="w-5 h-5" />
          View Comments
          {reviewsData?.pagination?.totalComments > 0 && (
            <span className="ml-2 px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm">
              {reviewsData.pagination.totalComments}
            </span>
          )}
        </Button>
      ) : (
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <Loader />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              Error: {error.message}
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400">
                No comments yet
              </p>
            </div>
          ) : (
            <>
              {comments.map((comment, index) => (
                <CommentCard
                  key={`${comment._id}-${index}`}
                  comment={comment}
                />
              ))}

              {hasMore && (
                <div
                  ref={loader}
                  className="h-16 flex items-center justify-center text-sm text-gray-500"
                >
                  {isFetching
                    ? "Loading more comments..."
                    : "Load more comments"}
                </div>
              )}
            </>
          )}
        </div>
      )}
      <ScrollToTopButton />
    </div>
  );
};

export default ReviewContainer;
