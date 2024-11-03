import React from "react";
import Selection from "../../../components/form/Select";

const Matching = ({ question, onAnswerChange, currentAnswer = [] }) => {
  const handleMatch = (leftId, rightId) => {
    const newAnswer = currentAnswer.filter((pair) => pair.left !== leftId);
    newAnswer.push({ left: leftId, right: rightId });
    onAnswerChange(newAnswer);
  };

  const getMatchedRight = (leftId) => {
    const pair = currentAnswer.find((p) => p.left === leftId);
    return pair?.right;
  };

  return (
    <div className="mb-6">
      <h3 className="font-medium mb-2 text-gray-200">
        {question.questionText}
      </h3>
      {question.instruction && (
        <p className="text-gray-400 mb-2">{question.instruction}</p>
      )}

      <div className="flex flex-col space-y-3 mt-4">
        {question.leftColumn.map((left, index) => (
          <div key={left.id} className="flex items-center">
            <div className="w-1/3">
              <span className="text-gray-300">
                {index + 1}. {left.text}
              </span>
            </div>
            <div className="w-2/3">
              <Selection
                value={getMatchedRight(left.id) || ""}
                onChange={(e) => handleMatch(left.id, e.target.value)}
                options={[
                  { value: "", label: "Select match" },
                  ...question.rightColumn.map((right) => ({
                    value: right.id,
                    label: right.text,
                  })),
                ]}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Matching;
