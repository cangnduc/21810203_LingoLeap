import React from "react";
import DeleteButton from "@/components/button/delete";
import { toast } from "react-toastify";
import Loader from "@/components/loader";
import ViewButton from "@/components/button/view";
import { useDeleteTestMutation } from "@/app/services/testApi";
import { useNavigate } from "react-router-dom";
import TestAttemptButton from "@/components/button/test.attempt";
const TestModel = ({ test, userId, className }) => {
  const navigate = useNavigate();
  const {
    title,
    description,
    duration,
    testType,
    difficulty,
    totalPossibleScore,
    passingScore,
    sections,
    isPublished,
    availableFrom,
    availableUntil,
    createdBy,
    totalAttempts,
    averageRating,
    _id,
  } = test;
  const [deleteTest, { isLoading: isDeleting }] = useDeleteTestMutation();

  const handleDelete = async () => {
    try {
      await deleteTest(test._id).unwrap();
      toast.success("Test deleted successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete test");
    }
  };
  const handleView = () => {
    navigate(`/tests/${test._id}`);
  };
  const handleAttempt = () => {
    navigate(`/tests/${test._id}/attempt`);
  };
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg md:shadow-md p-6 hover:shadow-lg transition-shadow md:border md:border-gray-200 dark:border-gray-700 flex flex-col ${className}`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {description?.length > 60 ? (
              <>
                {description.substring(0, 60)}...
                <span className="ml-1 cursor-pointer text-blue-500 hover:text-blue-600">
                  <i className="fas fa-chevron-right text-xs" />
                </span>
              </>
            ) : (
              description
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs ${
              isPublished
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
            }`}
          >
            {isPublished ? "Published" : "Draft"}
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full text-xs uppercase">
            {testType}
          </span>
        </div>
      </div>

      {/* Test Details */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
          <p className="font-medium dark:text-white">{duration} minutes</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Difficulty</p>
          <p className="font-medium capitalize dark:text-white">{difficulty}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total Score
          </p>
          <p className="font-medium dark:text-white">
            {totalPossibleScore} points
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Passing Score
          </p>
          <p className="font-medium dark:text-white">{passingScore} points</p>
        </div>
      </div>

      {/* Sections */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Sections:
        </p>
        <div className="flex flex-wrap gap-2">
          {sections.map((section, index) => (
            <span
              key={section._id || index}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-sm"
            >
              {section.name} ({section.sectionScore} pts)
            </span>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        <p>
          Available: {new Date(availableFrom).toLocaleDateString()} -{" "}
          {new Date(availableUntil).toLocaleDateString()}
        </p>
      </div>
      {/* Created By and Total Attempts */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Created by: {createdBy.username}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total Attempts: {totalAttempts}
          </p>
        </div>
      </div>
      {/* Reviews and actions */}
      <div className="flex justify-between items-center mt-auto">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Average Rating: {averageRating}
          </p>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          {isDeleting ? (
            <Loader />
          ) : (
            userId === createdBy._id && (
              <DeleteButton onClick={handleDelete} isLoading={isDeleting} />
            )
          )}
          <ViewButton onClick={handleView} />
          <TestAttemptButton onClick={handleAttempt} />
        </div>
      </div>
    </div>
  );
};

export default TestModel;
