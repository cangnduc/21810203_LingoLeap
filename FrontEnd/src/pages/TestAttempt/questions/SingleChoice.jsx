import React, { useState, useEffect } from "react";

const SingleChoice = ({ question, onAnswerChange, currentAnswer }) => {
  // Initialize currentAnswer as null if undefined
  const answer = currentAnswer || null;

  // State to hold randomized answers
  const [randomizedAnswers, setRandomizedAnswers] = useState([]);

  // Randomize answers when component mounts or when question changes
  useEffect(() => {
    const shuffleArray = (array) => {
      const newArray = [...array];
      for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      }
      return newArray;
    };

    setRandomizedAnswers(shuffleArray(question.answers));
  }, [question.answers]);

  return (
    <div className="mb-6">
      <h3 className="font-medium mb-2">{question.questionText}</h3>
      {question.instruction && (
        <p className="text-gray-600 mb-2">{question.instruction}</p>
      )}
      <div className="space-y-2">
        {randomizedAnswers.map((option, index) => (
          <label key={index} className="flex items-center space-x-2">
            <input
              type="radio"
              name={question._id}
              checked={answer === option}
              onChange={() => onAnswerChange(option)}
              className="form-radio"
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default SingleChoice;
