import React from "react";
import { format, formatDistanceStrict } from "date-fns";
import Loader from "@/components/Loader";
import { useMemo } from "react";
import TestAttemptModal from "./TestAttemptModal";
import { useNavigate } from "react-router-dom";

const DisplayTestAttempt = ({ testAttempts = [] }) => {
  const [selectedAttempt, setSelectedAttempt] = React.useState(null);
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    return format(new Date(dateString), "MMM dd, yyyy HH:mm:ss");
  };

  const calculateDuration = (startTime, endTime) => {
    if (!endTime) return null;
    return formatDistanceStrict(new Date(endTime), new Date(startTime));
  };

  const sortedAttempts = useMemo(() => {
    return [...testAttempts].sort(
      (a, b) =>
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
  }, [testAttempts]);

  return (
    <div className="min-h-screen min-w-[400px] p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Test Attempt History
        </h1>

        {sortedAttempts && sortedAttempts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedAttempts.map((attempt) => (
              <div
                key={attempt._id}
                className="group hover:shadow-xl transition-all duration-300 p-6 rounded-xl shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {attempt.test.title}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      attempt.status === "completed"
                        ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                    }`}
                  >
                    {attempt.status}
                  </span>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Started:</span>
                    <span>{formatDate(attempt.startTime)}</span>
                  </div>

                  {attempt.endTime && (
                    <>
                      <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                        <span className="font-medium">Ended:</span>
                        <span>{formatDate(attempt.endTime)}</span>
                      </div>
                      <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                        <span className="font-medium">Duration:</span>
                        <span>
                          {calculateDuration(
                            attempt.startTime,
                            attempt.endTime
                          )}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-6 flex gap-2">
                  <button
                    className="flex-1 px-4 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 
                    dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium 
                    transition-colors duration-200 flex items-center justify-center gap-2"
                    onClick={() => setSelectedAttempt(attempt)}
                  >
                    <span>View Details</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>

                  {attempt.result && (
                    <button
                      className="flex-1 px-4 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 
                      dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium 
                      transition-colors duration-200 flex items-center justify-center gap-2"
                      onClick={() => {
                        navigate(`/test-results/${attempt._id}`);
                      }}
                    >
                      <span>View Result</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No test attempts
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              You haven't taken any tests yet.
            </p>
          </div>
        )}
      </div>

      {selectedAttempt && (
        <TestAttemptModal
          attempt={selectedAttempt}
          onClose={() => setSelectedAttempt(null)}
        />
      )}
    </div>
  );
};

export default DisplayTestAttempt;
