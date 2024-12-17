import React from "react";
import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import { useGetTestQuery } from "@/app/services/testApi";
import { difficultyLevels } from "@/constant";
import ReviewContainer from "@/components/reviews";
//import useSelector
import { useSelector } from "react-redux";
const TestDetail = () => {
  const { id } = useParams();
  const { data: test, isLoading, isError, error } = useGetTestQuery(id);
  const { user } = useSelector((state) => state.auth);
  const formatDate = (date) => {
    return format(new Date(date), "MMM dd, yyyy");
  };

  const getDifficultyColor = (difficulty) => {
    const colors = difficultyLevels.find(
      (level) => level.value === difficulty
    )?.color;
    return colors || "bg-blue-500";
  };
  console.log("test", test);

  const calculatePassingPercentage = () => {
    return (test.passingScore / test.totalPossibleScore) * 100;
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    test && (
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold dark:text-white">
                {test.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                {test.description}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-end gap-2">
              {test.createdBy === user._id && (
                <Link
                  to={`/tests/${id}/edit`}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded-full text-sm transition-colors"
                >
                  Edit Test
                </Link>
              )}

              <div className="flex gap-2">
                <span
                  className={`${getDifficultyColor(
                    test.difficulty
                  )} text-white px-3 py-1 rounded-full text-sm`}
                >
                  {test.difficulty}
                </span>
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                  {test.testType.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Test Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-center">
            <h6 className="text-gray-600 dark:text-gray-300">Duration</h6>
            <h3 className="text-xl font-bold mt-2 dark:text-white">
              {test.duration} mins
            </h3>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-center">
            <h6 className="text-gray-600 dark:text-gray-300">Total Score</h6>
            <h3 className="text-xl font-bold mt-2 dark:text-white">
              {test.totalPossibleScore}
            </h3>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-center">
            <h6 className="text-gray-600 dark:text-gray-300">
              Attempts Allowed
            </h6>
            <h3 className="text-xl font-bold mt-2 dark:text-white">
              {test.totalAttempts}/{test.attemptsAllowed}
            </h3>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-center">
            <h6 className="text-gray-600 dark:text-gray-300">
              Total participants
            </h6>
            <h3 className="text-xl font-bold mt-2 dark:text-white">
              {test.participantCount || 0}
            </h3>
          </div>
        </div>

        {/* Passing Score */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h5 className="font-bold mb-3 dark:text-white">
            Passing Score: {test.passingScore} / {test.totalPossibleScore}
          </h5>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${calculatePassingPercentage()}%` }}
            ></div>
          </div>
        </div>

        {/* Sections */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700 p-4">
            <h5 className="font-bold dark:text-white">Test Sections</h5>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {test.sections.map((section) => (
              <div key={section._id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h6 className="font-semibold capitalize mb-1 dark:text-white">
                      {section.name}
                    </h6>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {section.instruction}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-3 py-1 rounded-full text-sm whitespace-nowrap">
                      {section.duration} mins
                    </span>
                    <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-3 py-1 rounded-full text-sm whitespace-nowrap">
                      {section.sectionScore} points
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h5 className="font-bold mb-4 dark:text-white">Test Availability</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 dark:text-gray-300 mb-1">
                Available From:
              </p>
              <strong className="dark:text-white">
                {formatDate(test.availableFrom)}
              </strong>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-300 mb-1">
                Available Until:
              </p>
              <strong className="dark:text-white">
                {formatDate(test.availableUntil)}
              </strong>
            </div>
          </div>
        </div>
        <ReviewContainer />
      </div>
    )
  );
};

export default TestDetail;
