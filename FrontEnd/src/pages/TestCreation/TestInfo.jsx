import React from "react";
import Input from "../../components/form/Input";
import Select from "../../components/form/Select";
import { difficultyList } from "../../constant/Samples";
const TestInfo = ({
  testInfo,
  handleBasicInfoChange,
  handleDifficultyChange,
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
      ></Input>
      <Select
        name="difficulty"
        label="Difficulty"
        options={difficultyList}
        onChange={handleDifficultyChange}
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
        name="availableTo"
        type="date"
        label="Available Until"
        value={testInfo.availableTo || ""}
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
