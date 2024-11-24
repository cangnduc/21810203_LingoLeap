import React, { useState } from "react";
import { sectionList } from "@/constant/Samples";
import { useDispatch } from "react-redux";
import { clearTestAnswers } from "@/app/features/testAnswerSlice";

const SectionNavigation = ({ sections }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const dispatch = useDispatch();
  const getSectionIcon = (sectionName) => {
    const section = sectionList.find((s) => s.name === sectionName);
    return section?.icon;
  };

  const handleSectionClick = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(`section-${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsExpanded(false); // Close mobile menu after clicking
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 transition-colors">
      <button onClick={() => dispatch(clearTestAnswers(true))}>
        Clear answers
      </button>
      {/* Mobile Toggle Button */}
      <div className="flex justify-between items-center lg:hidden mb-2">
        <h2 className="text-lg font-semibold dark:text-gray-200">
          Test Information
        </h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          {isExpanded ? (
            <span className="text-gray-600 dark:text-gray-400">▼</span>
          ) : (
            <span className="text-gray-600 dark:text-gray-400">▶</span>
          )}
        </button>
      </div>

      {/* Desktop Title */}
      <h2 className="text-lg font-semibold mb-4 dark:text-gray-200 hidden lg:block">
        Test Sections
      </h2>

      {/* Navigation Links - Responsive */}
      <nav className={`${isExpanded ? "block" : "hidden"} lg:block`}>
        {sections?.map((section) => (
          <a
            key={section._id}
            href={`#section-${section._id}`}
            onClick={(e) => handleSectionClick(e, section._id)}
            className="flex items-center p-2 hover:bg-gray-100 
                     dark:hover:bg-gray-700 rounded transition-colors
                     mb-1 gap-4 last:mb-0"
          >
            <span className="mr-2 dark:text-gray-400 text-2xl">
              {getSectionIcon(section.name)}
            </span>
            <div className="flex-1">
              <div className="font-medium capitalize dark:text-gray-200">
                {section.name}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {section.name === "reading" || section.name === "listening"
                  ? `${section.passages?.length || 0} passages / ${(
                      section.passages || []
                    ).reduce(
                      (acc, curr) => acc + (curr._id?.questions?.length || 0),
                      0
                    )} questions`
                  : `${section.questions?.length || 0} questions`}
              </div>
            </div>
          </a>
        ))}
      </nav>
    </div>
  );
};

export default SectionNavigation;
