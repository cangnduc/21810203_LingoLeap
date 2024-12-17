import React, { useState, useEffect } from "react";
import TestInfo from "./TestInfo";
import Section from "./Section";
import PreviewDisplay from "./PreviewDisplay";
import { testTypeList, difficultyList } from "../../constant/Samples";
import {
  useAddTestMutation,
  useGetTestByIdQuery,
  useUpdateTestMutation,
} from "@/app/services/testApi";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
const INITIAL_TEST_INFO = {
  title: "",
  description: "",
  duration: 0,
  difficulty: difficultyList[0].name,
  testType: testTypeList[0].name,
  passingScore: 0,
  totalPossibleScore: 0,
  availableFrom: new Date().toISOString().split("T")[0],
  availableUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
    .toISOString()
    .split("T")[0],
  attemptsAllowed: 1,
};

const INITIAL_SECTIONS = [];

const TestCreation = ({ mode }) => {
  console.log("mode", mode);
  const { id } = useParams();
  const [step, setStep] = useState(1);
  const [testInfo, setTestInfo] = useState(INITIAL_TEST_INFO);
  const [sections, setSections] = useState(INITIAL_SECTIONS);
  const [errors, setErrors] = useState({});
  const [
    addTest,
    { isLoading: isAddingTest, isSuccess: isTestAdded, error: addTestError },
  ] = useAddTestMutation();
  const [
    updateTest,
    {
      isLoading: isUpdatingTest,
      isSuccess: isTestUpdated,
      error: updateTestError,
    },
  ] = useUpdateTestMutation();

  const {
    data: testData,
    isLoading: isLoadingTest,
    error: testError,
  } = useGetTestByIdQuery(id, { skip: !id });

  useEffect(() => {
    if (testData) {
      setTestInfo({
        ...testData.data,
        availableFrom: new Date(testData.data.availableFrom)
          .toISOString()
          .split("T")[0],
        availableUntil: new Date(testData.data.availableUntil)
          .toISOString()
          .split("T")[0],
      });
      setSections(testData.data?.sections);
    }
  }, [testData]);

  const handleBasicInfoChange = (e) => {
    const { name, value, type } = e.target;
    setTestInfo((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleDifficultyChange = (e) => {
    setTestInfo((prev) => ({ ...prev, difficulty: e.target.value }));
  };
  const handleTestTypeChange = (e) => {
    setTestInfo((prev) => ({ ...prev, testType: e.target.value }));
  };
  const handleAddSection = (newSection) => {
    setSections((prev) => [...prev, newSection]);
  };

  const handleUpdateSection = (index, updatedSection) => {
    setSections((prev) => {
      const updatedSections = [...prev];
      updatedSections[index] = updatedSection;
      return updatedSections;
    });
  };
  const calculateTotalPossibleScore = () => {
    let total = 0;

    for (const section of sections) {
      total += section.sectionScore;
    }
    return total;
  };
  useEffect(() => {
    setTestInfo((prev) => ({
      ...prev,
      totalPossibleScore: calculateTotalPossibleScore(),
    }));
  }, [sections]);
  const validateTestInfo = () => {
    const newErrors = {};
    if (!testInfo.title.trim()) newErrors.title = "Title is required";
    if (!testInfo.description.trim())
      newErrors.description = "Description is required";
    if (!testInfo.difficulty) newErrors.difficulty = "Difficulty is required";
    if (!testInfo.availableFrom)
      newErrors.availableFrom = "Available From date is required";
    if (!testInfo.availableUntil)
      newErrors.availableUntil = "Available Until date is required";
    if (!testInfo.attemptsAllowed)
      newErrors.attemptsAllowed = "Attempts Allowed is required";

    if (testInfo.passingScore <= 0)
      newErrors.passingScore = "Passing Score must be greater than 0";
    setErrors(newErrors); // Fix: Set the actual errors object instead of a number
    return Object.keys(newErrors).length === 0;
  };

  const validateSections = () => {
    if (sections.length === 0) {
      setErrors({ sections: "At least one section is required" });
      return false;
    }
    let totalDuration = 0;
    for (const section of sections) {
      const validationRules = [
        { condition: !section.name, message: "Section name is required" },
        {
          condition: !section.duration || section.duration <= 0,
          message: "Section duration must be greater than 0",
        },

        {
          condition: !section.instructions,
          message: "Section instructions are required",
        },
        {
          condition:
            (section.name === "reading" || section.name === "listening") &&
            (!section.passages || section.passages.length === 0),
          message: `Add at least one passage for ${section.name} section`,
        },
        {
          condition:
            section.name !== "reading" &&
            section.name !== "listening" &&
            (!section.questions || section.questions.length === 0),
          message: `Add at least one question for ${section.name} section`,
        },
      ];

      for (const rule of validationRules) {
        if (rule.condition) {
          setErrors({ sections: rule.message });
          return false;
        }
      }
      totalDuration += section.duration;
    }
    //update the testInfo duration
    setTestInfo((prev) => ({ ...prev, duration: totalDuration }));
    setErrors({}); // Clear errors if validation passes
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateTestInfo()) {
      setStep(2);
    } else if (step === 2 && validateSections()) {
      setStep(3);
    }
  };

  const handleSubmit = async () => {
    if (testInfo.passingScore > testInfo.totalPossibleScore) {
      setErrors({
        passingScore: "Passing score cannot exceed total possible score",
      });
      return;
    }

    if (validateTestInfo() && validateSections()) {
      const finalTestData = {
        ...testInfo,
        sections: sections,
      };

      try {
        if (id) {
          // Update existing test
          await updateTest({ id, ...finalTestData });
          console.log("finalTestData", finalTestData);
          toast.success("Test updated successfully!");
        } else {
          // Create new test
          //await addTest(finalTestData);
          console.log("finalTestData", finalTestData);
          toast.success("Test created successfully!");
        }

        if (!id) {
          setTestInfo(INITIAL_TEST_INFO);
          setSections(INITIAL_SECTIONS);
          await addTest(finalTestData);
          setStep(1);
        }
      } catch (error) {
        toast.error(error.message || "An error occurred");
      }
    }
  };

  const handleDeleteSection = (index) => {
    setSections((prev) => prev.filter((_, i) => i !== index));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <TestInfo
            testInfo={testInfo}
            handleBasicInfoChange={handleBasicInfoChange}
            handleDifficultyChange={handleDifficultyChange}
            handleTestTypeChange={handleTestTypeChange}
          />
        );
      case 2:
        return (
          <Section
            sections={sections}
            onAddSection={handleAddSection}
            onUpdateSection={handleUpdateSection}
            onDeleteSection={handleDeleteSection}
          />
        );
      case 3:
        return <PreviewDisplay testInfo={testInfo} sections={sections} />;
      default:
        return null;
    }
  };

  if (id && isLoadingTest) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  if (id && testError) {
    return (
      <div className="text-red-500 text-center">
        Error loading test: {testError.message}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">
        {id ? "Edit Test" : "Create New Test"}
      </h1>
      {renderStep()}
      {Object.keys(errors).length > 0 && (
        <div className="text-red-500 mt-4">
          {Object.values(errors).length > 0 && (
            <p>{Object.values(errors)[0]}</p>
          )}
        </div>
      )}
      <div className="mt-6 flex justify-between">
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors duration-200"
          >
            Previous
          </button>
        )}
        {step < 3 ? (
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors duration-200"
            disabled={isAddingTest}
          >
            {isAddingTest ? (
              <div className="flex items-center">
                <span className="mr-2">Finalizing...</span>
                <div className="loader"></div>
              </div>
            ) : (
              "Finalize Test"
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default TestCreation;
