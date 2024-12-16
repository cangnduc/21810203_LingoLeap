import React from "react";

const QuestionModal = ({ question, onClose }) => {
  const renderQuestionDetails = () => {
    switch (question.type) {
      case "multiple_choice":
      case "single_choice":
        return (
          <div>
            <h3 className="font-semibold mt-4">Answers:</h3>
            <ul className="list-disc pl-5">
              {question.answers.map((answer, index) => (
                <li
                  key={index}
                  className={
                    question.type === "multiple_choice"
                      ? question.correctAnswers.includes(answer)
                        ? "text-green-600"
                        : ""
                      : question.correctAnswer === answer
                      ? "text-green-600"
                      : ""
                  }
                >
                  {answer}
                </li>
              ))}
            </ul>
          </div>
        );

      case "fill_in_the_blank":
        return (
          <div>
            <p className="mt-4">{question.text}</p>
            <h3 className="font-semibold mt-4">Answers:</h3>
            <ul className="list-disc pl-5">
              {question.blanks.map((blank, index) => (
                <li key={index}>
                  Blank {index + 1}: {blank.correctAnswer}
                </li>
              ))}
            </ul>
          </div>
        );

      case "true_false":
        return (
          <div>
            <p className="mt-4">{question.statement}</p>
            <p className="mt-4">
              Correct Answer: {question.correctAnswer ? "True" : "False"}
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex justify-between items-start mb-4 border-b dark:border-gray-700 pb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {question.passageType ? "Passage" : "Question"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <span className="text-2xl">×</span>
          </button>
        </div>

        <div className="space-y-4">
          {question.passageType ? (
            <>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {question.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {question.text}
              </p>
              <div className="mt-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Questions:
                </h3>
                <div className="space-y-4">
                  {question.questions?.map((q, index) => (
                    <div
                      key={q._id}
                      className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Question {index + 1}
                          </span>
                          <p className="mt-1 text-gray-700 dark:text-gray-300">
                            {q.questionText}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-4">
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">Section:</span>{" "}
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {question.section}
                  </span>
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">Type:</span>{" "}
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    {question.type}
                  </span>
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">Difficulty:</span>{" "}
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {question.difficulty}
                  </span>
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300">
                  {question.questionText}
                </p>
                {question.instruction && (
                  <p className="text-gray-600 dark:text-gray-400 italic mt-2">
                    {question.instruction}
                  </p>
                )}
              </div>
              {renderQuestionDetails()}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionModal;
