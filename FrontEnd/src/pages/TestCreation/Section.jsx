import React, { useState } from "react";
import Input from "../../components/form/Input";
import { sectionList } from "../../constant/Samples";
import styles from "./Section.module.css";
import SectionItem from "./SectionItem";

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
        sectionScore: 0,
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
        sectionScore: 0,
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

export default Section;
