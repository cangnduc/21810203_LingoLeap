import React from "react";
import { sectionColors, resultPageColors } from "@/constant/colors";
import { sectionList } from "@/constant/Samples";
import ScrollToTopBtn from "@/components/ScrollToTopBtn";
const TestResultPage = ({ testResult = {} }) => {
  const { testInfo, sectionScores, questions, writingAssessments } = testResult;

  // Helper function to capitalize first letter
  const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className={`min-h-screen p-6 ${resultPageColors.mainBg}`}>
      <ScrollToTopBtn />
      <div className="max-w-4xl mx-auto">
        <div
          className={`${resultPageColors.cardBg} rounded-xl shadow-lg overflow-hidden border ${resultPageColors.header.border} transition-all duration-300`}
        >
          {/* Header */}
          <div
            className={`px-6 py-4 border-b ${resultPageColors.header.border}`}
          >
            <h1
              className={`text-2xl font-bold ${resultPageColors.text.primary}`}
            >
              {testInfo?.title} - Results
            </h1>
          </div>

          {/* Score Overview */}
          <div className={`px-6 py-4 ${resultPageColors.scoreOverview.bg}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                className={`${resultPageColors.scoreOverview.cardBg} ${resultPageColors.questionCard.hover} p-6 rounded-lg text-center col-span-2 border ${resultPageColors.scoreOverview.border} shadow-sm`}
              >
                <h3
                  className={`text-sm font-medium ${resultPageColors.text.muted}`}
                >
                  Overall Score
                </h3>
                <p
                  className={`mt-2 text-4xl font-bold ${resultPageColors.text.primary}`}
                >
                  {testInfo?.scorePercentage?.toFixed(1)}%
                </p>
                <p className={`text-sm ${resultPageColors.text.muted}`}>
                  {testInfo?.totalScore?.toFixed(1)}/{testInfo?.maxTotalScore}{" "}
                  points
                </p>
                <div className="mt-3">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      testInfo?.isPassing
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200"
                        : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-200"
                    }`}
                  >
                    {testInfo?.isPassing ? "PASSED" : "FAILED"}
                  </span>
                </div>
              </div>
              <div
                className={`${resultPageColors.scoreOverview.cardBg} ${resultPageColors.questionCard.hover} p-6 rounded-lg flex flex-col items-center justify-center border ${resultPageColors.scoreOverview.border} shadow-sm`}
              >
                <h3
                  className={`text-sm font-medium ${resultPageColors.text.muted}`}
                >
                  Passing Score
                </h3>
                <p
                  className={`mt-2 text-3xl font-bold ${resultPageColors.text.primary}`}
                >
                  {testInfo?.passingScore || 0}
                </p>
                <p className={`text-sm ${resultPageColors.text.muted}`}>
                  Required to pass
                </p>
              </div>
            </div>
          </div>

          {/* Section Scores */}
          <div
            className={`px-6 py-4 border-t ${resultPageColors.header.border}`}
          >
            <h2
              className={`text-xl font-semibold mb-4 ${resultPageColors.text.primary}`}
            >
              Section Scores
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {sectionScores?.map((section) => {
                // Convert section name to lowercase for consistent matching
                const sectionName = section.name?.toLowerCase();
                // Use the section colors or fall back to default if not found
                const colors =
                  sectionColors[sectionName] || sectionColors.default;
                const icon = sectionList.find(
                  (item) => item.name.toLowerCase() === sectionName
                )?.icon;
                return (
                  <div
                    key={section.name}
                    className={`p-4 rounded-lg border shadow-sm cursor-pointer ${
                      colors?.bg || ""
                    } ${colors?.border || ""} ${colors?.hover || ""}`}
                  >
                    <div className="flex items-center space-x-7 md:space-x-5 sm:px-2">
                      <div className={`text-4xl ${colors?.text || ""}`}>
                        {icon}
                      </div>
                      <div>
                        <h3
                          className={`text-sm font-medium ${
                            colors?.text || ""
                          }`}
                        >
                          {capitalizeFirst(section.name)}
                        </h3>
                        <p
                          className={`mt-2 text-2xl font-bold ${resultPageColors.text.primary}`}
                        >
                          {section.score.toFixed(1)}
                        </p>
                        <p className={`text-sm ${colors?.text || ""}`}>
                          {section.totalQuestions} questions
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Question Scores */}
          <div
            className={`px-6 py-4 border-t ${resultPageColors.header.border}`}
          >
            <h2
              className={`text-xl font-semibold mb-4 ${resultPageColors.text.primary}`}
            >
              Question Details
            </h2>
            <div className="space-y-3">
              {questions?.map((question) => (
                <div
                  key={question.number}
                  className={`${resultPageColors.questionCard.bg} p-4 rounded-lg border ${resultPageColors.questionCard.border} transition-all duration-200 ${resultPageColors.questionCard.hover} shadow-sm`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3
                      className={`font-medium ${resultPageColors.text.primary}`}
                    >
                      Question {question.number}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${resultPageColors.questionCard.score.bg} ${resultPageColors.questionCard.score.text}`}
                    >
                      {question.score} / {question.points}
                    </span>
                  </div>
                  <p className={resultPageColors.text.secondary}>
                    {question.text}
                  </p>
                  <div>
                    {question.speakingResult && (
                      <div className="mt-4 space-y-3">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div
                            className={`${resultPageColors.cardBg} p-3 rounded-lg border ${resultPageColors.header.border} hover:border-blue-500 transition-colors duration-200`}
                          >
                            <h4
                              className={`text-sm font-medium ${resultPageColors.text.muted}`}
                            >
                              Fluency
                            </h4>
                            <p
                              className={`text-lg font-semibold ${resultPageColors.text.primary}`}
                            >
                              {question.speakingResult.fluency}%
                            </p>
                          </div>
                          <div
                            className={`${resultPageColors.cardBg} p-3 rounded-lg border ${resultPageColors.header.border} hover:border-blue-500 transition-colors duration-200`}
                          >
                            <h4
                              className={`text-sm font-medium ${resultPageColors.text.muted}`}
                            >
                              Pronunciation
                            </h4>
                            <p
                              className={`text-lg font-semibold ${resultPageColors.text.primary}`}
                            >
                              {question.speakingResult.pronunciation}%
                            </p>
                          </div>
                          <div
                            className={`${resultPageColors.cardBg} p-3 rounded-lg border ${resultPageColors.header.border} hover:border-blue-500 transition-colors duration-200`}
                          >
                            <h4
                              className={`text-sm font-medium ${resultPageColors.text.muted}`}
                            >
                              Vocabulary
                            </h4>
                            <p
                              className={`text-lg font-semibold ${resultPageColors.text.primary}`}
                            >
                              {question.speakingResult.vocabulary}%
                            </p>
                          </div>
                          <div
                            className={`${resultPageColors.cardBg} p-3 rounded-lg border ${resultPageColors.header.border} hover:border-blue-500 transition-colors duration-200`}
                          >
                            <h4
                              className={`text-sm font-medium ${resultPageColors.text.muted}`}
                            >
                              Communication
                            </h4>
                            <p
                              className={`text-lg font-semibold ${resultPageColors.text.primary}`}
                            >
                              {question.speakingResult.overallCommunication}%
                            </p>
                          </div>
                        </div>
                        <div
                          className={`${resultPageColors.cardBg} p-4 rounded-lg border ${resultPageColors.header.border} hover:border-blue-500 transition-colors duration-200`}
                        >
                          <h4
                            className={`font-medium ${resultPageColors.text.primary} mb-2`}
                          >
                            Feedback
                          </h4>
                          <p className={resultPageColors.text.secondary}>
                            {question.speakingResult.feedback}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Writing Assessment */}
          {writingAssessments?.map((assessment, index) => (
            <div
              key={index}
              className={`px-6 py-4 border-t ${resultPageColors.header.border}`}
            >
              <h2
                className={`text-xl font-semibold mb-4 ${resultPageColors.text.primary}`}
              >
                Writing Assessment {index + 1}
              </h2>
              <div className="space-y-4">
                {assessment.aspects?.map((aspect) => (
                  <div
                    key={aspect.name}
                    className={`${resultPageColors.writingAssessment.cardBg} p-4 rounded-lg border ${resultPageColors.writingAssessment.border} ${resultPageColors.writingAssessment.hover}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3
                        className={`font-medium ${resultPageColors.text.primary}`}
                      >
                        {aspect.name}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${resultPageColors.writingAssessment.score.bg} ${resultPageColors.writingAssessment.score.text}`}
                      >
                        {aspect.score}/{aspect.maxScore}
                      </span>
                    </div>
                    <p className={resultPageColors.text.secondary}>
                      {aspect.feedback}
                    </p>
                  </div>
                ))}
                <div
                  className={`mt-4 p-4 ${resultPageColors.writingAssessment.cardBg} rounded-lg border ${resultPageColors.writingAssessment.border} shadow-sm`}
                >
                  <h4
                    className={`font-medium ${resultPageColors.text.primary} mb-2`}
                  >
                    Overall Feedback
                  </h4>
                  <p className={resultPageColors.text.secondary}>
                    {assessment.overallFeedback}
                  </p>
                  <p
                    className={`mt-2 font-bold ${resultPageColors.text.primary}`}
                  >
                    Total Writing Score: {assessment.totalScore.toFixed(1)} /{" "}
                    {assessment.maxScore}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestResultPage;
