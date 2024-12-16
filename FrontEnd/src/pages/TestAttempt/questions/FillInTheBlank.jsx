import React from "react";

const FillInTheBlank = ({ question, onAnswerChange, currentAnswer = {} }) => {
  const handleChange = (index, value) => {
    const newAnswer = { ...currentAnswer, [index]: value };
    onAnswerChange(newAnswer);
  };

  const renderInput = (index) => {
    const blank = question.blanks?.[index];

    if (blank?.options && blank?.options.length > 0) {
      // Render select dropdown if options are available
      return (
        <select
          key={index}
          value={currentAnswer[index] || ""}
          onChange={(e) => handleChange(index, e.target.value)}
          className="border-b-2 border-gray-300 dark:border-gray-600 
                    focus:border-blue-500 dark:focus:border-blue-400 
                    outline-none px-2 py-1 mx-2 rounded
                    dark:bg-gray-800 text-blue-500 dark:text-blue-300"
        >
          <option value="">Select answer</option>
          {blank.options.map((option, optionIndex) => (
            <option key={optionIndex} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    // Render text input if no options
    return (
      <input
        key={index}
        type="text"
        className="border-b-2 border-gray-300 dark:border-gray-600 
                  focus:border-blue-500 dark:focus:border-blue-400 
                  outline-none px-2 py-1 mx-2
                  dark:bg-gray-800 text-blue-500 dark:text-blue-300"
        value={currentAnswer[index] || ""}
        placeholder={`${index + 1}`}
        onChange={(e) => handleChange(index, e.target.value)}
      />
    );
  };

  const parts = question.text.split("_____");

  return (
    <div className="mb-6">
      {question.instruction && (
        <p className="font-medium mb-2 dark:text-gray-200">
          {question.instruction}
        </p>
      )}
      <div className="mt-4 dark:text-gray-200">
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            <span className="whitespace-pre-line">{part}</span>
            {index < parts.length - 1 && renderInput(index)}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default FillInTheBlank;
