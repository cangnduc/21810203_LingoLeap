import React from "react";
import DeleteButton from "@/components/button/delete";
import ViewButton from "@/components/button/view";
import TestAttemptButton from "@/components/button/test.attempt";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDeleteTestMutation } from "@/app/services/testApi";
import { format } from "date-fns";
import { useTogglePublishedMutation } from "@/app/services/testApi";
import { FaStar } from "react-icons/fa";

const ToggleSwitch = ({ checked, onChange, disabled, label }) => {
  return (
    <button
      onClick={onChange}
      disabled={disabled}
      className="flex items-center gap-2 focus:outline-none"
    >
      <div
        className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        } ${checked ? "bg-blue-600" : "bg-gray-300"}`}
      >
        <div
          className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </div>
      <span className="text-sm text-gray-500 dark:text-gray-400">
        {disabled ? "Updating..." : checked ? "Published" : "Draft"}
      </span>
    </button>
  );
};

const TestModel = ({ test, userId }) => {
  const navigate = useNavigate();
  const [togglePublished, { isLoading: isToggling }] =
    useTogglePublishedMutation();
  const [deleteTest, { isLoading: isDeleting }] = useDeleteTestMutation();
  const {
    title,
    description,
    testType,
    duration,
    totalPossibleScore,
    passingScore,
    sections,
    createdBy,
    _id,
    availableFrom,
    availableUntil,
    totalAttempts,
    attemptsAllowed,
    averageRating,
    difficulty,
    isPublished,
    participantCount,
  } = test;
  const handleTogglePublished = async () => {
    try {
      await togglePublished(_id).unwrap();
      toast.success("Test published successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to publish test");
    }
  };
  const handleDelete = async () => {
    try {
      await deleteTest(_id).unwrap();
      toast.success("Test deleted successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete test");
    }
  };

  const handleView = () => {
    navigate(`/tests/${_id}`);
  };

  const formatDate = (date) => {
    return format(new Date(date), "MMM dd, yyyy");
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700 h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate pr-2">
          {title}
        </h3>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-1">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {averageRating && averageRating.toFixed(1)}
            </span>
            <FaStar className="text-yellow-400" />
          </div>
          <div className="flex gap-2">
            <span className="px-2 py-0.5 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 rounded-full text-xs">
              {difficulty}
            </span>
            {isPublished && (
              <span className="px-2 py-0.5 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full text-xs">
                Published
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        {description?.length > 100
          ? `${description.substring(0, 100)}...`
          : description}
      </p>

      {/* Test Details Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Duration:
          </span>
          <p className="font-medium dark:text-white">{duration} minutes</p>
        </div>
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Passing Score Required:
          </span>
          <p className="font-medium dark:text-white">
            {passingScore}/{totalPossibleScore}
          </p>
        </div>
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Attempts:
          </span>
          <p className="font-medium dark:text-white">
            {totalAttempts}/{attemptsAllowed || "∞"}
          </p>
        </div>
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Type:
          </span>
          <p className="font-medium dark:text-white">{testType}</p>
        </div>
      </div>

      {/* Sections */}
      <div className="mb-4">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Sections:
        </span>
        <div className="flex flex-wrap gap-2 mt-1">
          {sections.map((section) => (
            <span
              key={section._id}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-700 dark:text-gray-300"
            >
              {section.name} ({section.sectionScore} pts)
            </span>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="mb-4">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Available:
        </span>
        <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-600 dark:text-gray-400">
          <span>From: {formatDate(availableFrom)}</span>
          <span>To: {formatDate(availableUntil)}</span>
        </div>
      </div>

      {/* Created By */}
      <div className="mb-4 flex justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Created by:
          </span>

          <span className="text-sm font-medium dark:text-white">
            {createdBy.username}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Total Participants:
          </span>

          <span className="text-sm font-medium dark:text-white">
            {participantCount || 0}
          </span>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-grow"></div>

      {/* Footer - Updated with responsive classes */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
        {userId === createdBy._id && (
          <ToggleSwitch
            checked={isPublished}
            onChange={handleTogglePublished}
            disabled={isToggling}
          />
        )}

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {userId === createdBy._id && (
            <DeleteButton onClick={handleDelete} isLoading={isDeleting} />
          )}
          <ViewButton onClick={handleView} />
          <TestAttemptButton id={_id} />
        </div>
      </div>
    </div>
  );
};

export default TestModel;
