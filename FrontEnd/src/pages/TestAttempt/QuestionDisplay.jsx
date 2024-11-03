import React from "react";
import {
  MultipleChoice,
  SingleChoice,
  TrueFalse,
  FillInTheBlank,
  Matching,
  Ordering,
  Essay,
  MatchingV1,
} from "./questions";

const QuestionDisplay = ({
  question,
  onAnswerChange,
  currentAnswer,
  index,
}) => {
  const QuestionComponent = {
    multiple_choice: MultipleChoice,
    single_choice: SingleChoice,
    true_false: TrueFalse,
    fill_in_the_blank: FillInTheBlank,
    matching: MatchingV1,
    ordering: Ordering,
    essay: Essay,
  }[question.type];

  if (!QuestionComponent) {
    return <div>Unsupported question type: {question.type}</div>;
  }

  return (
    <div
      className="border rounded-lg p-4 mb-4 
                dark:border-gray-800 
                dark:bg-gray-900 
                transition-colors"
    >
      <h3 className="font-medium mb-2 dark:text-gray-200">
        Question {index + 1}:
      </h3>
      <QuestionComponent
        question={question}
        onAnswerChange={onAnswerChange}
        currentAnswer={currentAnswer}
        index={index}
      />
    </div>
  );
};

export default QuestionDisplay;
