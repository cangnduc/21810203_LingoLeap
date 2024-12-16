import React, { useState, useRef } from "react";
import TestModel from "./test.model";
import { X } from "lucide-react";
import DeleteButton from "@/components/button/delete";
import ViewButton from "@/components/button/view";
import TestAttemptButton from "@/components/button/test.attempt";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDeleteTestMutation } from "@/app/services/testApi";

const TestCard = ({ test, userId, index }) => {
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);
  const navigate = useNavigate();
  const [deleteTest, { isLoading: isDeleting }] = useDeleteTestMutation();

  const {
    title,
    description,
    testType,
    isPublished,
    totalAttempts,
    createdBy,
    _id,
  } = test;

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

  // Mobile Card
  const MobileCard = () => (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700 h-full flex flex-col"
      onClick={() => setShowModal(true)}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate pr-2">
          {title}
        </h3>
        <span
          className={`px-2 py-0.5 rounded-full text-xs flex-shrink-0 ${
            isPublished
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
          }`}
        >
          {isPublished ? "Published" : "Private"}
        </span>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        {description?.length > 40
          ? `${description.substring(0, 40)}...`
          : description}
      </p>

      <div className="flex-grow"></div>

      <div className="flex justify-between items-center mt-auto">
        <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full text-xs">
          {testType}
        </span>
        <div className="flex items-center gap-1">
          {userId === createdBy._id && (
            <DeleteButton onClick={handleDelete} isLoading={isDeleting} />
          )}
          <ViewButton onClick={handleView} />
          <TestAttemptButton id={_id} />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile View */}
      <div className="md:hidden h-full">
        <MobileCard />
      </div>

      {/* Desktop View - Full Model */}
      <div className="hidden md:block h-full">
        <TestModel test={test} userId={userId} />
      </div>

      {/* Mobile Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 md:hidden">
          <div
            ref={modalRef}
            className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto relative"
          >
            <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 py-1 px-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <p className="text-lg font-semibold text-gray-800 dark:text-white">
                STT: {index + 1}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowModal(false);
                }}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2">
              <TestModel test={test} userId={userId} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TestCard;
