import React from "react";

const PreviewDisplay = ({ testInfo, sections }) => {
  const renderSectionContent = (section) => (
    <div className="space-y-2">
      <p>
        <span className="font-semibold">Duration:</span> {section.duration}{" "}
        minutes
      </p>
      <p>
        <span className="font-semibold">Instructions:</span>{" "}
        {section.instructions}
      </p>

      {section.passages && (
        <div>
          <p className="font-semibold">Passages: {section.passages.length}</p>
          <ul className="list-disc pl-5 mt-1">
            {section.passages.map((passage, pIndex) => (
              <li key={pIndex}>
                Passage {pIndex + 1}: {passage.points} points
              </li>
            ))}
          </ul>
          <p className="mt-1">
            <span className="font-semibold">Total Passage Points:</span>{" "}
            {section.passages.reduce((sum, passage) => sum + passage.points, 0)}
          </p>
        </div>
      )}

      {section.questions && (
        <div>
          <p className="font-semibold">Questions: {section.questions.length}</p>
          <p>
            <span className="font-semibold">Total Question Points:</span>{" "}
            {section.questions.reduce(
              (sum, question) => sum + question.points,
              0
            )}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6 dark:text-gray-200">
      <h2 className="text-2xl font-bold dark:text-white">Test Preview</h2>

      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Test Information
          </h3>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700">
          <dl>
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">
                Title
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200 sm:mt-0 sm:col-span-2">
                {testInfo.title}
              </dd>
            </div>
            <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">
                Description
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200 sm:mt-0 sm:col-span-2">
                {testInfo.description}
              </dd>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">
                Difficulty
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200 sm:mt-0 sm:col-span-2">
                {testInfo.difficulty}
              </dd>
            </div>
            <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">
                Duration
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200 sm:mt-0 sm:col-span-2">
                {testInfo.duration} minutes
              </dd>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">
                Available From
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200 sm:mt-0 sm:col-span-2">
                {testInfo.availableFrom}
              </dd>
            </div>

            <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">
                Available To
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200 sm:mt-0 sm:col-span-2">
                {testInfo.availableTo}
              </dd>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">
                Attempts Allowed
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200 sm:mt-0 sm:col-span-2">
                {testInfo.attemptsAllowed}
              </dd>
            </div>
            <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">
                Passing Score
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200 sm:mt-0 sm:col-span-2">
                {testInfo.passingScore}
              </dd>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">
                Total Possible Score
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200 sm:mt-0 sm:col-span-2">
                {testInfo.totalPossibleScore}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mt-6">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Test Sections
          </h3>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700">
          {sections.map((section, index) => (
            <div
              key={index}
              className={`${
                index % 2 === 0
                  ? "bg-white dark:bg-gray-800"
                  : "bg-gray-50 dark:bg-gray-700"
              } px-4 py-5 sm:px-6 flex gap-6 sm:grid sm:grid-cols-3 sm:gap-4`}
            >
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                {section.name.charAt(0).toUpperCase() + section.name.slice(1)}
              </h4>
              {renderSectionContent(section)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PreviewDisplay;
