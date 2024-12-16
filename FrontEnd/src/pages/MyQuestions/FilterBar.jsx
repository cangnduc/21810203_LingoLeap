import React, { useState, useCallback } from "react";
import { sectionToTypeMap, sectionList, typeList } from "@/constant/Samples";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import debounce from "lodash/debounce";

const FilterBar = ({ filters, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState(filters.search);

  const debouncedSearch = useCallback(
    debounce((value) => {
      onFilterChange({ search: value });
    }, 1000),
    []
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  useCallback(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSectionChange = (sectionName) => {
    const currentSections = filters.sections ? filters.sections.split(",") : [];
    let newSections;

    if (currentSections.includes(sectionName)) {
      newSections = currentSections.filter((s) => s !== sectionName);
    } else {
      newSections = [...currentSections, sectionName];
    }

    onFilterChange({
      sections: newSections.join(","),
      // Reset types if no sections selected
      types: newSections.length === 0 ? "" : filters.types,
    });
  };

  const handleTypeChange = (typeName) => {
    const currentTypes = filters.types ? filters.types.split(",") : [];
    let newTypes;

    if (currentTypes.includes(typeName)) {
      newTypes = currentTypes.filter((t) => t !== typeName);
    } else {
      newTypes = [...currentTypes, typeName];
    }

    onFilterChange({ types: newTypes.join(",") });
  };

  // Get available types based on selected sections
  const getAvailableTypes = () => {
    const selectedSections = filters.sections
      ? filters.sections.split(",")
      : [];
    if (selectedSections.length === 0) return typeList;

    const availableTypes = new Set();
    selectedSections.forEach((section) => {
      sectionToTypeMap[section]?.forEach((type) => {
        availableTypes.add(type);
      });
    });

    return typeList.filter((type) => availableTypes.has(type.name));
  };

  const selectedSections = filters.sections ? filters.sections.split(",") : [];
  const selectedTypes = filters.types ? filters.types.split(",") : [];

  const sortOptions = [
    { value: "createdAt", label: "Date Created" },
    { value: "type", label: "Question Type" },
    { value: "difficulty", label: "Difficulty" },
    { value: "section", label: "Section" },
  ];

  const handleSortChange = (value) => {
    if (value === filters.sortBy) {
      // If clicking the same field, toggle order
      onFilterChange({ order: filters.order === "asc" ? "desc" : "asc" });
    } else {
      // If clicking a new field, set it with default desc order
      onFilterChange({ sortBy: value, order: "desc" });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow mb-6 space-y-4">
      <div className="space-y-4">
        {/* Sections */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sections
          </label>
          <div className="flex flex-wrap gap-2">
            {sectionList.map((section) => (
              <button
                key={section.name}
                onClick={() => handleSectionChange(section.name)}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                  ${
                    selectedSections.includes(section.name)
                      ? `${section.color} text-white`
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                  }`}
              >
                <span className="mr-1">{section.icon}</span>
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {/* Types */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Question Types
          </label>
          <div className="flex flex-wrap gap-2">
            {getAvailableTypes().map((type) => (
              <button
                key={type.name}
                onClick={() => handleTypeChange(type.name)}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                  ${
                    selectedTypes.includes(type.name)
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                  }`}
                disabled={
                  selectedSections.length > 0 &&
                  !getAvailableTypes().some((t) => t.name === type.name)
                }
              >
                <span className="mr-1">{type.icon}</span>
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Controls */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <div className="flex flex-wrap gap-2">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                  ${
                    filters.sortBy === option.value
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                  }`}
              >
                {option.label}
                {filters.sortBy === option.value && (
                  <span className="ml-1">
                    {filters.order === "asc" ? <FaSortUp /> : <FaSortDown />}
                  </span>
                )}
                {filters.sortBy !== option.value && <FaSort className="ml-1" />}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Search
          </label>
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full border dark:border-gray-700 rounded px-3 py-2 
              focus:outline-none focus:ring-2 focus:ring-blue-500 
              dark:bg-gray-800 dark:text-gray-200"
          />
        </div>
      </div>

      {/* Active Filters Display */}
      {(filters.sections || filters.types || filters.search) && (
        <div className="flex flex-wrap gap-2 pt-2">
          {/* Existing active filters ... */}

          {/* Sort indicator */}
          {filters.sortBy && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
              Sorted by:{" "}
              {sortOptions.find((opt) => opt.value === filters.sortBy)?.label}(
              {filters.order === "asc" ? "ascending" : "descending"})
              <button
                onClick={() =>
                  onFilterChange({ sortBy: "createdAt", order: "desc" })
                }
                className="ml-2 text-indigo-600 hover:text-indigo-800"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterBar;
