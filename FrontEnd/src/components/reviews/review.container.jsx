import React, { useEffect, useRef, useState, useCallback } from "react";
import { useGetReviewsByTestIdQuery } from "@/app/services/reviewApi";
import { useParams } from "react-router-dom";
import ReviewCard from "./review.card";
import Loader from "@/components/loader";
import AddReview from "./add.review";
import ScrollToTopButton from "@/components/HomeComponent/ScrollToTopBtn";
import { useSelector } from "react-redux";

const ReviewContainer = () => {
  const user = useSelector((state) => state.auth.user);
  const { id: testId } = useParams();
  const [page, setPage] = useState(1);
  const loader = useRef(null);
  const observerRef = useRef(null);

  const {
    data: reviewsData,
    isLoading,
    error,
    isFetching,
  } = useGetReviewsByTestIdQuery({
    testId,
    page,
    limit: 5,
  });

  const hasMore = reviewsData?.pagination?.hasMore || false;
  const reviews = reviewsData?.data || [];

  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && !isFetching && hasMore) {
        console.log("Loading next page...", { currentPage: page });
        setPage((prev) => prev + 1);
      }
    },
    [isFetching, hasMore, page]
  );

  // Setup intersection observer
  useEffect(() => {
    const currentLoader = loader.current;

    if (!currentLoader || !hasMore || isFetching) {
      return;
    }

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "100px",
      threshold: 0.1,
    });

    observerRef.current.observe(currentLoader);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver, hasMore, isFetching]);

  if (isLoading) return <Loader />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
        Reviews
      </h2>
      <AddReview testId={testId} userId={user?._id} />

      {reviews.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400">
            No reviews available
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <ReviewCard key={`${review._id}-${index}`} review={review} />
          ))}

          {isFetching && (
            <div className="py-4 text-center">
              <Loader />
            </div>
          )}

          {hasMore && (
            <div
              ref={loader}
              className="h-20 flex items-center justify-center"
              data-testid="load-more"
            >
              <span className="text-gray-500">
                {isFetching ? "Loading..." : "Load more reviews"}
              </span>
            </div>
          )}
        </div>
      )}
      <ScrollToTopButton />
    </div>
  );
};

export default ReviewContainer;
