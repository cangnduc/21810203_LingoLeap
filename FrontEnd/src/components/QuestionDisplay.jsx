import React from "react";
import MultipleChoice from "../pages/TestAttempt/questions/MultipleChoice";
import SingleChoice from "../pages/TestAttempt/questions/SingleChoice";
import TrueFalse from "./questions/TrueFalse";
import FillInTheBlank from "./questions/FillInTheBlank";
import Matching from "./questions/Matching";
import Ordering from "./questions/Ordering";
import Essay from "./questions/Essay";

const QuestionDisplay = ({ question, onAnswerChange, currentAnswer }) => {
  const QuestionComponent = {
    multiple_choice: MultipleChoice,
    single_choice: SingleChoice,
    true_false: TrueFalse,
    fill_in_the_blank: FillInTheBlank,
    matching: Matching,
    ordering: Ordering,
    essay: Essay,
  }[question.type];
  if (!QuestionComponent) {
    return <div>Unsupported question type: {question.type}</div>;
  }

  return (
    <div className="border rounded-lg p-4 mb-4">
      <QuestionComponent
        question={question}
        onAnswerChange={onAnswerChange}
        currentAnswer={currentAnswer}
      />
    </div>
  );
};

export default QuestionDisplay;
