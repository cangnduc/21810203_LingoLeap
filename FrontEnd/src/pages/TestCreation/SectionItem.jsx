import React, { useState } from "react";
import Input from "../../components/form/Input";
import { FaTrash } from "react-icons/fa";
import styles from "./Section.module.css";
import {
  useGetPassagesWithQuestionsQuery,
  useGetQuestionsBySectionQuery,
} from "../../app/services/questionApi";
import QuestionDisplay from "./QuestionDisplay";
import PassageDisplay from "./PassageDisplay";

const SectionItem = ({ section, index, onUpdateSection, onDeleteSection }) => {
  const isReadingOrListening = ["reading", "listening"].includes(section.name);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [createdBy, setCreatedBy] = useState("me");
  const queryArgs = {
    section: section.name,
    createdBy,
    page: currentPage,
    limit: 5,
    sortBy: sortField,
    orderBy: sortOrder,
  };

  const {
    data: passagesData,
    isLoading: isPassagesLoading,
    error: passagesError,
  } = useGetPassagesWithQuestionsQuery(queryArgs, {
    skip: !isReadingOrListening,
  });

  const { data: questionsData, isLoading: isQuestionsLoading } =
    useGetQuestionsBySectionQuery(queryArgs, {
      skip: isReadingOrListening,
    });

  const handleCreatedByChange = (e) => {
    setCreatedBy(e.target.value);
    setCurrentPage(1);
  };

  const handleSectionChange = (field, value) => {
    const updatedSection = { ...section, [field]: value };
    onUpdateSection(updatedSection);
  };
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleAddQuestion = (questionId) => {
    if (!section.questions.find((q) => q._id === questionId)) {
      const updatedSection = {
        ...section,
        sectionScore: section.sectionScore + 1,
        questions: [...section.questions, { _id: questionId, points: 1 }],
      };
      onUpdateSection(updatedSection);
    }
  };

  const handleDeleteQuestion = (questionId) => {
    const updatedSection = {
      ...section,
      questions: section.questions.filter((q) => q._id !== questionId),
    };
    // subtract the points of the deleted question from the section score
    const deletedQuestion = section.questions.find((q) => q._id === questionId);
    const updatedSectionScore = section.sectionScore - deletedQuestion.points;
   
    onUpdateSection({ ...updatedSection, sectionScore: updatedSectionScore });
  };

  const handleAddPassage = (passageId, points) => {
    const foundPassage = section.passages.find((p) => p._id === passageId);
    if (!foundPassage) {
      const updatedSection = {
        ...section,
        sectionScore: section.sectionScore + points,
        passages: [...section.passages, { _id: passageId, points: points }],
      };

      onUpdateSection(updatedSection);
    }
  };
  const handlePassagePointChange = (passageId, points) => {
    const updatedSection = {
      ...section,
      sectionScore:
        section.sectionScore +
        points -
        section.passages.find((p) => p._id === passageId).points,
      passages: section.passages.map((p) =>
        p._id === passageId ? { ...p, points } : p
      ),
    };
    onUpdateSection(updatedSection);
  };
  const handleQuestionScoreChange = (questionId, points) => {
    const updatedSection = {
      ...section,
      sectionScore:
        section.sectionScore +
        points -
        section.questions.find((q) => q._id === questionId).points,
      questions: section.questions.map((q) =>
        q._id === questionId ? { ...q, points } : q
      ),
    };
    onUpdateSection(updatedSection);
  };
  const handleDeletePassage = (passageId) => {
    const updatedSection = {
      ...section,
      sectionScore:
        section.sectionScore -
        section.passages.find((p) => p._id === passageId).points,
      passages: section.passages.filter((p) => p._id !== passageId),
    };
    onUpdateSection(updatedSection);
  };
  const handleSortChange = (field, order) => {
    setSortField(field);
    setSortOrder(order);
  };
  return (
    <div className="border p-4 rounded-md border-gray-300 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          {section.name.charAt(0).toUpperCase() + section.name.slice(1)} Section
        </h3>
        {passagesError && (
          <p>There is an error in loading data, please try again later</p>
        )}
        <div className="flex items-center">
          <p>Total Score: {section.sectionScore}</p>
        </div>
        <button
          onClick={onDeleteSection}
          className="text-red-500 hover:text-red-700"
          title="Delete Section"
        >
          <FaTrash />
        </button>
      </div>
      <Input
        name={`section-${index}-duration`}
        label="Duration (minutes)"
        type="number"
        value={section.duration}
        onChange={(e) =>
          handleSectionChange("duration", parseInt(e.target.value))
        }
        required
      />
      <select
        value={createdBy}
        onChange={handleCreatedByChange}
        className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-900 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-300 dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-5 ${styles.customSelect}`}
      >
        <option value="me">My Questions</option>
        <option value="all">All Questions</option>
      </select>

      <Input
        name={`section-${index}-instructions`}
        label="Instructions"
        type="textarea"
        value={section.instructions}
        onChange={(e) => handleSectionChange("instructions", e.target.value)}
        required
        className="mt-5"
      />
      {isReadingOrListening ? (
        isPassagesLoading ? (
          <p>Loading passages...</p>
        ) : (
          passagesData && (
            <PassageDisplay
              passages={passagesData.data.passages}
              currentPage={currentPage}
              totalPages={passagesData.data.totalPages}
              onPageChange={handlePageChange}
              onAddQuestion={handleAddQuestion}
              onDeleteQuestion={handleDeleteQuestion}
              selectedQuestions={section.questions}
              onAddPassage={(passageId, score) =>
                handleAddPassage(passageId, score)
              }
              onDeletePassage={handleDeletePassage}
              selectedPassages={section.passages}
              onSortChange={handleSortChange}
              onPassagePointChange={handlePassagePointChange}
            />
          )
        )
      ) : isQuestionsLoading ? (
        <p>Loading questions...</p>
      ) : (
        questionsData && (
          <QuestionDisplay
            questions={questionsData.data.questions}
            currentPage={currentPage}
            totalPages={questionsData.data.totalPages}
            onPageChange={handlePageChange}
            onAddQuestion={(questionId, score) =>
              handleAddQuestion(questionId, score)
            }
            onDeleteQuestion={handleDeleteQuestion}
            selectedQuestions={section.questions}
            onSortChange={handleSortChange}
            onQuestionScoreChange={handleQuestionScoreChange}
          />
        )
      )}
    </div>
  );
};

export default SectionItem;
