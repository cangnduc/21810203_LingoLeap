import React from "react";
import Input from "../../components/form/Input";
import Select from "../../components/form/Select";
import { difficultyList } from "../../constant/Samples";
import { testTypeList } from "../../constant/Samples";
const TestInfo = ({
  testInfo,
  handleBasicInfoChange,
  handleDifficultyChange,
  handleTestTypeChange,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Basic Information</h2>
      <Input
        name="title"
        label="Test Title"
        value={testInfo.title}
        onChange={handleBasicInfoChange}
        minLength={10}
        maxLength={100}
        required
      />
      <Input
        name="description"
        label="Test Description"
        value={testInfo.description}
        onChange={handleBasicInfoChange}
        minLength={10}
        maxLength={200}
        type="textarea"
        required
      />
      <Select
        name="difficulty"
        label="Difficulty"
        options={difficultyList}
        onChange={handleDifficultyChange}
        required
      />
      <Select
        name="testType"
        label="Test Type"
        options={testTypeList}
        onChange={handleTestTypeChange}
        required
      />
      <Input
        name="passingScore"
        type="number"
        label="Passing Score"
        value={testInfo.passingScore || 0}
        onChange={handleBasicInfoChange}
        required
      />
      <Input
        name="availableFrom"
        type="date"
        label="Available From"
        value={testInfo.availableFrom || ""}
        onChange={handleBasicInfoChange}
        required
      />
      <Input
        name="availableUntil"
        type="date"
        label="Available Until"
        value={testInfo.availableUntil || ""}
        onChange={handleBasicInfoChange}
      />
      <Input
        name="attemptsAllowed"
        type="number"
        label="Attempts Allowed"
        min="1"
        value={testInfo.attemptsAllowed || ""}
        onChange={handleBasicInfoChange}
        required
      />
    </div>
  );
};

export default TestInfo;
