import React from "react";

const Essay = ({ question, onAnswerChange, currentAnswer = "" }) => {
  const countWords = (text) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const handleChange = (e) => {
    onAnswerChange(e.target.value);
  };

  const wordCount = countWords(currentAnswer);

  return (
    <div className="mb-6">
      <h3 className="font-medium mb-2 dark:text-gray-200">
        {question.questionText}
      </h3>
      {question.instruction && (
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          {question.instruction}
        </p>
      )}
      <div className="mt-4">
        <textarea
          value={currentAnswer}
          onChange={handleChange}
          className="w-full h-64 p-3 border rounded focus:ring-2 focus:ring-blue-500 
                   dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
          placeholder="Write your essay here..."
        />
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Word count: {wordCount} / {question.minWords}-{question.maxWords}
          {wordCount < question.minWords && (
            <span className="text-red-500 dark:text-red-400 ml-2">
              (Need {question.minWords - wordCount} more words)
            </span>
          )}
          {wordCount > question.maxWords && (
            <span className="text-red-500 dark:text-red-400 ml-2">
              ({wordCount - question.maxWords} words over limit)
            </span>
          )}
        </div>
        {question.rubric && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded">
            <h4 className="font-medium mb-2 dark:text-gray-200">Rubric:</h4>
            <pre className="whitespace-pre-wrap text-sm dark:text-gray-300">
              {question.rubric}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Essay;
