import React, { useState } from "react";
import {
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
  FaChevronUp,
  FaTrash,
  FaSort,
} from "react-icons/fa";

const PassageDisplay = ({
  passages,
  currentPage,
  totalPages,
  onPageChange,
  onAddPassage,
  onDeletePassage,
  selectedPassages,
  onSortChange,
  onPassagePointChange,
}) => {
  const [expandedPassage, setExpandedPassage] = useState(null);
  const [questionPage, setQuestionPage] = useState(1);
  const questionsPerPage = 5; // You can adjust this number as needed
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const togglePassage = (passageId) => {
    setExpandedPassage(expandedPassage === passageId ? null : passageId);
    setQuestionPage(1); // Reset question page when toggling passage
  };

  const getPaginatedQuestions = (questions) => {
    const startIndex = (questionPage - 1) * questionsPerPage;
    const endIndex = startIndex + questionsPerPage;
    return questions.slice(startIndex, endIndex);
  };

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

  return (
    <div>
      <div className="relative overflow-x-auto mt-4 rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900 dark:text-gray-400">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer"
                onClick={() => handleSort("title")}
              >
                <span className="flex items-center">
                  Title {renderSortIcon("title")}
                </span>
              </th>
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer hidden md:table-cell"
                onClick={() => handleSort("text")}
              >
                <span className="flex items-center">
                  Text {renderSortIcon("text")}
                </span>
              </th>
              <th scope="col" className="px-6 py-3">
                Questions
              </th>
              <th scope="col" className="px-6 py-3">
                Point
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {passages.map((passage) => (
              <React.Fragment key={passage._id}>
                <tr className="bg-white border-b dark:bg-gray-950 dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-3 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-gray-400"
                  >
                    {passage.title}
                  </th>
                  <td className="px-3 py-2 hidden md:table-cell">
                    {passage.text.substring(0, 50)}...
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button
                      className="text-blue-500 hover:text-blue-700 mr-2"
                      onClick={() => togglePassage(passage._id)}
                    >
                      <div className="flex items-center ">
                        {expandedPassage === passage._id ? (
                          <FaChevronUp />
                        ) : (
                          <FaChevronDown />
                        )}
                        <p className="ml-2">{passage.questions.length}</p>
                      </div>
                    </button>
                  </td>
                  <td className="px-3 py-2">
                    {selectedPassages.find((p) => p._id === passage._id) && (
                      <input
                        type="number"
                        className="border text-center w-[70%] px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 dark:border-gray-700 transition-colors duration-200"
                        required
                        min={0}
                        max={100}
                        defaultValue={passage.questions.length}
                        onChange={(e) =>
                          onPassagePointChange(
                            passage._id,
                            parseInt(e.target.value) || 0
                          )
                        }
                      />
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex justify-center">
                      {selectedPassages.find((p) => p._id === passage._id) ? (
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => onDeletePassage(passage._id)}
                        >
                          <FaTrash />
                        </button>
                      ) : (
                        <button
                          className="text-blue-500 hover:text-blue-700"
                          onClick={() =>
                            onAddPassage(passage._id, passage.questions.length)
                          }
                        >
                          <FaPlus />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
                {expandedPassage === passage._id && (
                  <tr className="bg-white border-b dark:bg-gray-950 dark:border-gray-700">
                    <td colSpan="4" className="px-3 py-2">
                      <div className="p-3 w-full">
                        <h4 className="font-medium mb-2">Questions:</h4>
                        <ul className="space-y-4 w-full">
                          {getPaginatedQuestions(passage.questions).map(
                            (question) => (
                              <li
                                key={question._id}
                                className="border-b border-gray-200 dark:border-gray-600 pb-2"
                              >
                                <p className="text-sm mb-1">
                                  {question.questionText.substring(0, 100)}...
                                </p>
                                <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full dark:bg-blue-900 dark:text-blue-300">
                                    Type: {question.type}
                                  </span>
                                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full dark:bg-green-900 dark:text-green-300">
                                    Difficulty: {question.difficulty}
                                  </span>
                                </div>
                              </li>
                            )
                          )}
                        </ul>
                        {passage.questions.length > questionsPerPage && (
                          <div className="flex justify-between items-center mt-4">
                            <button
                              onClick={() => setQuestionPage(questionPage - 1)}
                              disabled={questionPage === 1}
                              className="flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                            >
                              <FaChevronLeft className="mr-2" />
                              Previous
                            </button>
                            <span className="text-sm text-gray-700 dark:text-gray-400">
                              Page {questionPage} of{" "}
                              {Math.ceil(
                                passage.questions.length / questionsPerPage
                              )}
                            </span>
                            <button
                              onClick={() => setQuestionPage(questionPage + 1)}
                              disabled={
                                questionPage ===
                                Math.ceil(
                                  passage.questions.length / questionsPerPage
                                )
                              }
                              className="flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                            >
                              Next
                              <FaChevronRight className="ml-2" />
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
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

export default PassageDisplay;
