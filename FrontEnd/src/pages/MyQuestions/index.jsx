import React, { useState } from "react";
import { useGetMyQuestionsQuery } from "@/app/services/questionApi";
import QuestionTable from "./QuestionTable";
import QuestionModal from "./QuestionModal";
import FilterBar from "./FilterBar";
const MyContent = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sections: "",
    types: "",
    search: "",
    sortBy: "createdAt",
    order: "desc",
  });

  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const { data, isLoading, error } = useGetMyQuestionsQuery(filters);

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };
  console.log("data", data);
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Content</h1>

      <FilterBar filters={filters} onFilterChange={handleFilterChange} />

      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 p-4">
          Error loading content: {error.message}
        </div>
      ) : (
        <>
          <QuestionTable
            questions={data?.questions || []}
            passages={data?.passages || []}
            onQuestionClick={setSelectedQuestion}
            onPageChange={handlePageChange}
            currentPage={filters.page}
            totalPages={data?.totalPages || 1}
            filters={filters}
          />

          {selectedQuestion && (
            <QuestionModal
              question={selectedQuestion}
              onClose={() => setSelectedQuestion(null)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default MyContent;
