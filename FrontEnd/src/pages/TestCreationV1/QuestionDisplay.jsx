import React, { useState } from "react";
import {
  FaPlus,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
  FaSort,
} from "react-icons/fa";
import { MdReadMore } from "react-icons/md";

const QuestionDisplay = ({
  questions,
  currentPage,
  totalPages,
  onPageChange,
  onAddQuestion,
  onDeleteQuestion,
  selectedQuestions,
  onSortChange,
  onQuestionScoreChange,
}) => {
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [questionScore, setQuestionScore] = useState({});

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    onSortChange(field, sortOrder === "asc" ? "desc" : "asc");
  };

  const renderSortIcon = (field) => {
    if (sortField === field) {
      return (
        <FaSort
          className={`ml-1 inline-block ${
            sortOrder === "asc" ? "transform rotate-180" : ""
          }`}
        />
      );
    }
    return <FaSort className="ml-1 inline-block text-gray-300" />;
  };

  const toggleQuestionExpansion = (questionId) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const handleQuestionScoreChange = (questionId, score) => {
    setQuestionScore((prev) => ({ ...prev, [questionId]: score }));
  };
  console.log("questions", selectedQuestions);
  return (
    <div>
      <div className="relative overflow-x-auto mt-4 rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900 dark:text-gray-400">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer"
                onClick={() => handleSort("type")}
              >
                <span className="flex items-center">
                  Type {renderSortIcon("type")}
                </span>
              </th>
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer"
                onClick={() => handleSort("questionText")}
              >
                <span className="flex items-center">
                  Question {renderSortIcon("questionText")}
                </span>
              </th>
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer text-center"
                onClick={() => handleSort("difficulty")}
              >
                <span className="flex items-center justify-center">
                  Difficulty {renderSortIcon("difficulty")}
                </span>
              </th>
              <th scope="col" className="px-6 py-3">
                Score
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {questions.map((question) => (
              <tr
                key={question._id}
                className="bg-white border-b dark:bg-gray-950 dark:border-gray-700"
              >
                <th
                  scope="row"
                  className="px-3 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-gray-400"
                >
                  <span className="hidden sm:inline">{question.type}</span>
                  <span className="sm:hidden">
                    {question.type.split("_")[0]}
                  </span>
                </th>
                <td className="px-3 py-2">
                  {expandedQuestions[question._id]
                    ? question.questionText
                    : `${question.questionText.substring(0, 50)}...`}
                  <button
                    onClick={() => toggleQuestionExpansion(question._id)}
                    className="ml-2 text-blue-500 hover:text-blue-700"
                  >
                    {expandedQuestions[question._id] ? (
                      "close up"
                    ) : (
                      <MdReadMore />
                    )}
                  </button>
                </td>
                <td className="px-3 py-2 text-center">{question.difficulty}</td>
                <td className="px-3 py-2">
                  {selectedQuestions.find((q) => q._id === question._id) && (
                    <input
                      type="number"
                      className="border text-center w-[70%] px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 dark:border-gray-700 transition-colors duration-200"
                      required
                      min={0}
                      max={100}
                      defaultValue={
                        selectedQuestions.find((q) => q._id === question._id)
                          ?.points || 1
                      }
                      onChange={(e) =>
                        onQuestionScoreChange(
                          question._id,
                          parseInt(e.target.value) || 1
                        )
                      }
                    />
                  )}
                </td>
                <td className="px-3 py-2">
                  <div className="flex justify-center">
                    {selectedQuestions.find((q) => q._id === question._id) ? (
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => onDeleteQuestion(question._id)}
                      >
                        <FaTrash />
                      </button>
                    ) : (
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => onAddQuestion(question._id)}
                      >
                        <FaPlus />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <FaChevronLeft className="mr-2" />
            Previous
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            Next
            <FaChevronRight className="ml-2" />
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionDisplay;
