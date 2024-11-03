import React from "react";

const MultipleChoice = ({ question, onAnswerChange, currentAnswer }) => {
  // Initialize currentAnswer as an empty array if undefined
  const answers = currentAnswer || [];

  return (
    <div className="mb-6">
      <h3 className="font-medium mb-2">{question.questionText}</h3>
      {question.instruction && (
        <p className="text-gray-600 mb-2">{question.instruction}</p>
      )}
      <div className="space-y-2">
        {question.answers.map((answer, index) => (
          <label key={index} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={answers.includes(answer)}
              onChange={(e) => {
                const newAnswer = e.target.checked
                  ? [...answers, answer]
                  : answers.filter((a) => a !== answer);
                onAnswerChange(newAnswer);
              }}
              className="form-checkbox"
            />
            <span>{answer}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default MultipleChoice;
