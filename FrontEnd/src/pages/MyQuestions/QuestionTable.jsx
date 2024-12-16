import React, { useState } from "react";
import {
  FaEye,
  FaTrash,
  FaGlobe,
  FaLock,
  FaChevronDown,
  FaChevronUp,
  FaEdit,
} from "react-icons/fa";
import {
  useDeleteQuestionMutation,
  useDeletePassageMutation,
} from "@/app/services/questionApi";
import TruncatedText from "./TruncatedText";
import { Link } from "react-router-dom";
const QuestionTable = ({
  questions,
  passages,
  onQuestionClick,
  onPageChange,
  currentPage,
  totalPages,
  filters,
}) => {
  const [expandedPassages, setExpandedPassages] = useState(new Set());

  const togglePassageExpansion = (passageId) => {
    setExpandedPassages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(passageId)) {
        newSet.delete(passageId);
      } else {
        newSet.add(passageId);
      }
      return newSet;
    });
  };
  const [
    deleteQuestion,
    { isLoading: deleteQuestionLoading, error: deleteQuestionError },
  ] = useDeleteQuestionMutation();
  const [
    deletePassage,
    { isLoading: deletePassageLoading, error: deletePassageError },
  ] = useDeletePassageMutation();
  const handleDeleteQuestion = async (id) => {
    try {
      await deleteQuestion({
        id,
        filters: {
          page: currentPage,
          limit: 10,
          sections: filters.sections,
          types: filters.types,
          search: filters.search,
          sortBy: filters.sortBy,
          order: filters.order,
        },
      }).unwrap();
    } catch (error) {
      console.error("Error deleting question from table:", error);
    }
  };
  const handleDeletePassage = async (id) => {
    try {
      await deletePassage({
        id,
        filters: {
          page: currentPage,
          limit: 10,
          sections: filters.sections,
          types: filters.types,
          search: filters.search,
          sortBy: filters.sortBy,
          order: filters.order,
        },
      }).unwrap();
    } catch (error) {
      console.error("Error deleting passage:", error);
    }
  };
  if (deleteQuestionError) {
    console.error("Error deleting question:", deleteQuestionError);
  }
  if (deletePassageError) {
    console.error("Error deleting passage:", deletePassageError);
  }
  // Desktop table row renderer
  const renderTableRow = (item) => {
    if (item.passageType) {
      const isExpanded = expandedPassages.has(item._id);
      return (
        <React.Fragment key={item._id}>
          <tr className="hover:bg-gray-50 dark:hover:bg-gray-800 border-b dark:border-gray-700">
            <td className="px-3 py-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => togglePassageExpansion(item._id)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                </button>
                <TruncatedText text={item.title} maxLength={50} />
              </div>
            </td>
            <td className="px-3 py-4 whitespace-nowrap">
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {item.passageType}
              </span>
            </td>
            <td className="px-3 py-4 whitespace-nowrap">
              <span className="text-gray-600 dark:text-gray-400">
                {item.questions?.length || 0} questions
              </span>
            </td>
            <td className="px-3 py-4 whitespace-nowrap">
              <div className="flex gap-1">
                <button
                  onClick={() => onQuestionClick(item)}
                  className="p-1.5 rounded-full text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                >
                  <FaEye />
                </button>
                <button
                  className="p-1.5 rounded-full text-red-600 hover:text-red-800 hover:bg-red-100"
                  onClick={() => handleDeletePassage(item._id)}
                >
                  <FaTrash />
                </button>
                <button className="p-1.5 rounded-full text-green-600 hover:text-green-800 hover:bg-green-100">
                  {item.isPublic ? <FaGlobe /> : <FaLock />}
                </button>
              </div>
            </td>
          </tr>
          {isExpanded &&
            item.questions?.map((question, idx) => (
              <tr key={question._id} className="bg-gray-50 dark:bg-gray-800/50">
                <td colSpan="3" className="px-3 py-3">
                  <div className="ml-6 border-l-2 border-gray-300 dark:border-gray-600 pl-4">
                    <div className="flex-1">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Question {idx + 1}
                      </span>
                      <TruncatedText
                        text={question.questionText}
                        maxLength={100}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <div className="flex gap-1 justify-end">
                    <button
                      onClick={() => onQuestionClick(question)}
                      className="p-1.5 rounded-full text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(question._id)}
                      className="p-1.5 rounded-full text-red-600 hover:text-red-800 hover:bg-red-100"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </React.Fragment>
      );
    } else {
      return (
        <tr
          key={item._id}
          className="hover:bg-gray-50 dark:hover:bg-gray-800 border-b dark:border-gray-700"
        >
          <td className="px-3 py-4">
            <TruncatedText text={item.questionText} maxLength={100} />
          </td>
          <td className="px-3 py-4 whitespace-nowrap">
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              {item.type}
            </span>
          </td>
          <td className="px-3 py-4 whitespace-nowrap">
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              {item.section}
            </span>
          </td>
          <td className="px-3 py-4 whitespace-nowrap">
            <div className="flex gap-1">
              <button
                onClick={() => onQuestionClick(item)}
                className="p-1.5 rounded-full text-blue-600 hover:text-blue-800 hover:bg-blue-100"
              >
                <FaEye />
              </button>
              <button
                onClick={() => handleDeleteQuestion(item._id)}
                className="p-1.5 rounded-full text-red-600 hover:text-red-800 hover:bg-red-100"
              >
                <FaTrash />
              </button>
              <button className="p-1.5 rounded-full text-green-600 hover:text-green-800 hover:bg-green-100">
                {item.isPublic ? <FaGlobe /> : <FaLock />}
              </button>
              <Link
                to={`/question/${item._id}/edit`}
                className="p-1.5 rounded-full text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100"
              >
                <FaEdit />
              </Link>
            </div>
          </td>
        </tr>
      );
    }
  };

  // Mobile card renderer
  const renderCard = (item) => {
    const isExpanded = expandedPassages.has(item._id);
    return (
      <div key={item._id} className="p-4 border-b dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {item.passageType ? (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <button
                    onClick={() => togglePassageExpansion(item._id)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                  <TruncatedText text={item.title} maxLength={50} />
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {item.passageType}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 text-sm">
                    {item.questions?.length || 0} questions
                  </span>
                </div>
              </>
            ) : (
              <>
                <TruncatedText text={item.questionText} maxLength={100} />
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    {item.type}
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {item.section}
                  </span>
                </div>
              </>
            )}
          </div>
          <div className="flex gap-1 ml-2">
            <button
              onClick={() => onQuestionClick(item)}
              className="p-1.5 rounded-full text-blue-600 hover:text-blue-800 hover:bg-blue-100"
            >
              <FaEye />
            </button>
            <button className="p-1.5 rounded-full text-red-600 hover:text-red-800 hover:bg-red-100">
              <FaTrash />
            </button>
            <button className="p-1.5 rounded-full text-green-600 hover:text-green-800 hover:bg-green-100">
              {item.isPublic ? <FaGlobe /> : <FaLock />}
            </button>
          </div>
        </div>
        {item.passageType && isExpanded && (
          <div className="mt-4 pl-4 border-l-2 border-gray-300 dark:border-gray-600">
            {item.questions?.map((question, idx) => (
              <div key={question._id} className="mb-4 last:mb-0">
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Question {idx + 1}
                    </span>
                    <TruncatedText
                      text={question.questionText}
                      maxLength={100}
                    />
                  </div>
                  <div className="flex gap-1 mt-1">
                    <button
                      onClick={() => onQuestionClick(question)}
                      className="p-1.5 rounded-full text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                    >
                      <FaEye />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
      {/* Desktop view */}
      <div className="hidden sm:block">
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider first:rounded-tl-lg">
                  Content
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Section
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider last:rounded-tr-lg">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>{[...questions, ...passages].map(renderTableRow)}</tbody>
          </table>
        </div>
      </div>

      {/* Mobile view */}
      <div className="sm:hidden">
        {[...questions, ...passages].map(renderCard)}
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 flex justify-between items-center bg-gray-50 dark:bg-gray-800 rounded-b-lg">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm border dark:border-gray-600 rounded disabled:opacity-50 
            text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Previous
        </button>
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm border dark:border-gray-600 rounded disabled:opacity-50 
            text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default QuestionTable;
