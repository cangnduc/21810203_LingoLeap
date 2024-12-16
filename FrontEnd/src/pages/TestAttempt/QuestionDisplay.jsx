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
  OpenEnded,
} from "./questions";

const QuestionDisplay = ({
  question,
  onAnswerChange,
  currentAnswer,
  index,
  duration,
  testAttemptId,
}) => {
  if (!question) {
    return (
      <div className="border rounded-lg p-4 mb-4 dark:border-gray-800 dark:bg-gray-900 transition-colors">
        <h3 className="font-medium mb-2 dark:text-gray-200">
          Question {index + 1}:
        </h3>
        <div>Failed to load question or the question is not available</div>
      </div>
    );
  }
  const renderQuestion = () => {
    switch (question.type) {
      case "open_ended":
        return (
          <OpenEnded
            question={question}
            duration={duration}
            testAttemptId={testAttemptId}
            onAnswerChange={onAnswerChange}
            currentAnswer={currentAnswer}
          />
        );
      case "multiple_choice":
        return (
          <MultipleChoice
            question={question}
            onAnswerChange={onAnswerChange}
            currentAnswer={currentAnswer}
          />
        );
      case "single_choice":
        return (
          <SingleChoice
            question={question}
            onAnswerChange={onAnswerChange}
            currentAnswer={currentAnswer}
          />
        );
      case "true_false":
        return (
          <TrueFalse
            question={question}
            onAnswerChange={onAnswerChange}
            currentAnswer={currentAnswer}
          />
        );
      case "fill_in_the_blank":
        return (
          <FillInTheBlank
            question={question}
            onAnswerChange={onAnswerChange}
            currentAnswer={currentAnswer}
          />
        );
      case "matching":
        return (
          <MatchingV1
            question={question}
            onAnswerChange={onAnswerChange}
            currentAnswer={currentAnswer}
          />
        );
      case "ordering":
        return (
          <Ordering
            question={question}
            onAnswerChange={onAnswerChange}
            currentAnswer={currentAnswer}
          />
        );
      case "essay":
        return (
          <Essay
            question={question}
            onAnswerChange={onAnswerChange}
            currentAnswer={currentAnswer}
          />
        );
      default:
        return <div>Unsupported question type: {question.type}</div>;
    }
  };

  return (
    <div className="border rounded-lg p-4 mb-4 dark:border-gray-800 dark:bg-gray-900 transition-colors">
      <h3 className="font-medium mb-2 dark:text-gray-200">
        Question {index + 1}:
      </h3>
      {renderQuestion()}
    </div>
  );
};

export default QuestionDisplay;
