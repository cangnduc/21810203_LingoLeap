import React from "react";

const TrueFalse = ({ question, onAnswerChange, currentAnswer }) => {
  // Initialize currentAnswer as null if undefined
  const answer = currentAnswer ?? null;

  return (
    <div className="mb-6">
      <h3 className="font-medium mb-2">{question.questionText}</h3>
      {question.instruction && (
        <p className="text-gray-600 mb-2">{question.instruction}</p>
      )}
      <div className="space-y-2">
        {["True", "False"].map((option) => (
          <label key={option} className="flex items-center space-x-2">
            <input
              type="radio"
              name={question._id}
              checked={answer === (option === "True")}
              onChange={() => onAnswerChange(option === "True")}
              className="form-radio"
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default TrueFalse;
