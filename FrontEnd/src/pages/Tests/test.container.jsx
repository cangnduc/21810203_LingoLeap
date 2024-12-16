import React, { useState } from "react";
import { useGetTestsQuery } from "@/app/services/testApi";
import TestCard from "./test.card";
import Selection from "@/components/form/Select";
import { difficultyLevels, testTypes, testOrderOptions } from "@/constant";
import { useSelector } from "react-redux";
const TestContainer = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const user = useSelector((state) => state.auth.user);

  const [filters, setFilters] = useState({
    difficulty: "",
    testType: "",
    orderBy: "createdAt",
    sortBy: "desc",
    createdBy: "",
  });
  const { data, isLoading, isError, error } = useGetTestsQuery({
    page,
    limit,
    ...filters,
  });
  console.log("data", data);
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPage(1); // Reset to first page when filters change
  };

  // Format options for Selection components
  const difficultyOptions = [
    { value: "", label: "All Difficulties" },
    ...difficultyLevels.map((level) => ({
      value: level.value,
      label: level.label,
      color: level.color,
    })),
  ];

  const typeOptions = [
    { value: "", label: "All Types" },
    ...testTypes.map((type) => ({ value: type, label: type })),
  ];

  const orderOptions = testOrderOptions.map((option) => ({
    value: option.value,
    label: `Order by ${option.label}`,
  }));

  const sortOptions = [
    { value: "desc", label: "Descending" },
    { value: "asc", label: "Ascending" },
  ];

  const createdByOptions = [
    { value: "", label: "All Tests" },
    { value: "me", label: "My Tests" },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>{error.message}</div>;
  if (!data) return <div>No data available</div>;

  const { tests, totalPages } = data;

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Filters */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Selection
            label="Difficulty"
            name="difficulty"
            value={filters.difficulty}
            onChange={handleFilterChange}
            options={difficultyOptions}
          />

          <Selection
            label="Test Type"
            name="testType"
            value={filters.testType}
            onChange={handleFilterChange}
            options={typeOptions}
          />

          <Selection
            label="Order By"
            name="orderBy"
            value={filters.orderBy}
            onChange={handleFilterChange}
            options={orderOptions}
          />

          <Selection
            label="Sort Order"
            name="sortBy"
            value={filters.sortBy}
            onChange={handleFilterChange}
            options={sortOptions}
          />

          <Selection
            label="Created By"
            name="createdBy"
            value={filters.createdBy}
            onChange={handleFilterChange}
            options={createdByOptions}
          />
        </div>
      </div>

      {/* Test Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
        {tests?.data.map((test, index) => (
          <TestCard
            userId={user?._id}
            key={test._id}
            index={index}
            test={test}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center gap-2">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Previous
        </button>
        <span className="px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-md">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TestContainer;
