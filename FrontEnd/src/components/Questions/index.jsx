import React, { useState, useEffect, useRef } from "react";
import { useSearchQuestionsQuery } from "../../app/services/questionApi";
import { sectionList, typeList } from "../../constant/Samples";

const Questions = ({ type, section, text, createdBy = "me" }) => {
  const [filters, setFilters] = useState({
    type: type || "",
    section: section || "",
    text: text || "",
    createdBy: createdBy || "",
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const timerRef = useRef(null);

  const { data, error, isLoading } = useSearchQuestionsQuery({
    ...debouncedFilters,
    page,
    limit,
  });

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setDebouncedFilters(filters);
      setPage(1); // Reset to first page when filters change
    }, 500); // 500ms of idle time

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return (
      <div className="text-center py-8 text-red-500">
        Error: {error.message}
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <select
          name="type"
          value={filters.type}
          onChange={handleFilterChange}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Types</option>
          {typeList.map((type) => (
            <option key={type.name} value={type.name}>
              {type.label}
            </option>
          ))}
        </select>
        <select
          name="section"
          value={filters.section}
          onChange={handleFilterChange}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Sections</option>
          {sectionList.map((section) => (
            <option key={section.name} value={section.name}>
              {section.label}
            </option>
          ))}
        </select>
        <input
          name="text"
          value={filters.text}
          onChange={handleFilterChange}
          placeholder="Search text"
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          name="createdBy"
          value={filters.createdBy}
          onChange={handleFilterChange}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All questions</option>
          <option value="me">My questions</option>
        </select>
      </div>

      {data && data.questions && Array.isArray(data.questions) ? (
        <div className="space-y-4">
          {data.questions.map((question) => (
            <div
              key={question._id}
              className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300"
            >
              <h3 className="text-lg font-semibold mb-2">
                {question.questionText}
              </h3>
              <p className="text-sm text-gray-600">Type: {question.type}</p>
              <p className="text-sm text-gray-600">
                Section: {question.section}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No questions found or invalid data format.
        </div>
      )}

      {data && data.totalPages > 0 && (
        <div className="mt-8 flex justify-center items-center space-x-4">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {page} of {data.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === data.totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Questions;
