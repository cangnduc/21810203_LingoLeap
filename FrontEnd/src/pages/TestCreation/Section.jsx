import React, { useState, useEffect } from "react";
import Input from "../../components/form/Input";
import { sectionList } from "../../constant/Samples";
import {
  useGetPassagesWithQuestionsQuery,
  useGetQuestionsBySectionQuery,
} from "../../app/services/questionApi";
import QuestionDisplay from "./QuestionDisplay";
import PassageDisplay from "./PassageDisplay";
import { FaTrash } from "react-icons/fa";
import styles from "./Section.module.css"; // Add this import

const Section = ({
  sections,
  onAddSection,
  onUpdateSection,
  onDeleteSection,
}) => {
  const [selectedSection, setSelectedSection] = useState("");
  const [newSectionDuration, setNewSectionDuration] = useState(0);
  const [newSectionInstructions, setNewSectionInstructions] = useState("");

  const handleAddSection = () => {
    if (selectedSection && ["reading", "listening"].includes(selectedSection)) {
      const newSection = {
        name: selectedSection,

        passages: [],
        duration: newSectionDuration,
        instructions: newSectionInstructions,
      };
      onAddSection(newSection);
      setSelectedSection("");
      setNewSectionDuration(0);
      setNewSectionInstructions("");
    } else if (selectedSection) {
      const newSection = {
        name: selectedSection,
        questions: [],
        duration: newSectionDuration,
        instructions: newSectionInstructions,
      };
      onAddSection(newSection);
      setSelectedSection("");
      setNewSectionDuration(0);
      setNewSectionInstructions("");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Test Sections</h2>
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center items-center">
        <div className="w-full sm:w-1/4">
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${styles.customSelect}`}
          >
            <option value="">Choose a section</option>
            {sectionList.map((section) => (
              <option value={section.name} key={section.name}>
                {section.label}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full sm:w-1/5">
          <Input
            name="newSectionDuration"
            label="Duration (minutes)"
            type="number"
            value={newSectionDuration}
            onChange={(e) => setNewSectionDuration(parseInt(e.target.value))}
            required
          />
        </div>
        <div className="w-full sm:w-1/3">
          <Input
            name="newSectionInstructions"
            label="Instructions"
            type="textarea"
            value={newSectionInstructions}
            onChange={(e) => setNewSectionInstructions(e.target.value)}
            required
            className="w-full"
          />
        </div>
        <div className="w-full sm:w-auto sm:self-end">
          <button
            onClick={handleAddSection}
            className="w-full sm:w-auto bg-blue-500 text-white px-4 py-3 rounded hover:bg-blue-600 whitespace-nowrap"
          >
            Add Section
          </button>
        </div>
      </div>
      {sections.map((section, index) => (
        <SectionItem
          key={index}
          section={section}
          index={index}
          onUpdateSection={(updatedSection) =>
            onUpdateSection(index, updatedSection)
          }
          onDeleteSection={() => onDeleteSection(index)}
        />
      ))}
    </div>
  );
};

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

  const { data: passagesData, isLoading: isPassagesLoading } =
    useGetPassagesWithQuestionsQuery(queryArgs, {
      skip: !isReadingOrListening,
    });

  const { data: questionsData, isLoading: isQuestionsLoading } =
    useGetQuestionsBySectionQuery(queryArgs, {
      skip: isReadingOrListening,
    });

  const handleCreatedByChange = (e) => {
    setCreatedBy(e.target.value);
    setCurrentPage(1); // Reset to first page when createdBy changes
  };

  const handleSectionChange = (field, value) => {
    const updatedSection = { ...section, [field]: value };
    onUpdateSection(updatedSection);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const handleAddQuestion = (questionId) => {
    if (!section.questions.includes(questionId)) {
      const updatedSection = {
        ...section,
        questions: [...section.questions, questionId],
      };
      onUpdateSection(updatedSection);
    }
  };

  const handleDeleteQuestion = (questionId) => {
    const updatedSection = {
      ...section,
      questions: section.questions.filter((id) => id !== questionId),
    };
    onUpdateSection(updatedSection);
  };
  const handleAddPassage = (passageId) => {
    if (!section.passages.includes(passageId)) {
      const updatedSection = {
        ...section,
        passages: [...section.passages, passageId],
      };
      onUpdateSection(updatedSection);
    }
  };
  const handleDeletePassage = (passageId) => {
    const updatedSection = {
      ...section,
      passages: section.passages.filter((id) => id !== passageId),
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
              onAddPassage={handleAddPassage}
              onDeletePassage={handleDeletePassage}
              selectedPassages={section.passages}
              onSortChange={handleSortChange}
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
            onAddQuestion={handleAddQuestion}
            onDeleteQuestion={handleDeleteQuestion}
            selectedQuestions={section.questions}
            onSortChange={handleSortChange}
          />
        )
      )}
    </div>
  );
};

export default Section;
