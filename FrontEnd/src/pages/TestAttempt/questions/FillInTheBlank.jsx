import React from "react";

const FillInTheBlank = ({ question, onAnswerChange, currentAnswer = {} }) => {
  const handleChange = (index, value) => {
    const newAnswer = { ...currentAnswer, [index]: value };
    onAnswerChange(newAnswer);
  };

  const renderInput = (index) => (
    <input
      key={index}
      type="text"
      className="border-b-2 border-gray-300 dark:border-gray-600 
                focus:border-blue-500 dark:focus:border-blue-400 
                outline-none px-2 py-1 mx-2
                dark:bg-gray-800 dark:text-gray-200"
      value={currentAnswer[index] || ""}
      placeholder={`${index + 1}`}
      onChange={(e) => handleChange(index, e.target.value)}
    />
  );

  const parts = question.text.split(/\(\d+\)/);
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
            <span>{part}</span>
            {index < parts.length - 1 && renderInput(index)}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default FillInTheBlank;
