import React, { useState } from "react";
import FormField from "./FormField";
import { FaPlus, FaMinus } from "react-icons/fa";

const matchingInput = {
  type: "matching",
  section: "vocabulary",
  questionText: "Match the words with their definitions.",
  instruction:
    "Drag the items from the right column to match the items in the left column.",
  difficulty: 3,
  leftColumn: [
    { id: 1, text: "Exuberant" },
    { id: 2, text: "Melancholy" },
    { id: 3, text: "Stoic" },
  ],
  rightColumn: [
    { id: "A", text: "Joyfully unrestrained" },
    { id: "B", text: "Sad or depressed" },
    { id: "C", text: "Showing little emotion" },
  ],
  correctPairs: [
    { left: 1, right: "A" },
    { left: 2, right: "B" },
    { left: 3, right: "C" },
  ],
};

export default function MatchingFields({ register, errors, prefix }) {
  const [itemCount, setItemCount] = useState(3);

  const addItem = () => {
    if (itemCount < 8) {
      setItemCount(itemCount + 1);
    }
  };

  const removeItem = (indexToRemove) => {
    if (itemCount > 3) {
      setItemCount(itemCount - 1);
      // Shift the remaining items
      for (let i = indexToRemove; i < itemCount - 1; i++) {
        ["leftColumn", "rightColumn"].forEach((column) => {
          const nextId = `${prefix}.${column}.${i + 1}.id`;
          const nextText = `${prefix}.${column}.${i + 1}.text`;
          const currentId = `${prefix}.${column}.${i}.id`;
          const currentText = `${prefix}.${column}.${i}.text`;

          const nextIdValue = register(nextId).value;
          const nextTextValue = register(nextText).value;

          register(currentId).onChange({ target: { value: nextIdValue } });
          register(currentText).onChange({ target: { value: nextTextValue } });
        });

        const nextLeft = `${prefix}.correctPairs.${i + 1}.left`;
        const nextRight = `${prefix}.correctPairs.${i + 1}.right`;
        const currentLeft = `${prefix}.correctPairs.${i}.left`;
        const currentRight = `${prefix}.correctPairs.${i}.right`;

        const nextLeftValue = register(nextLeft).value;
        const nextRightValue = register(nextRight).value;

        register(currentLeft).onChange({ target: { value: nextLeftValue } });
        register(currentRight).onChange({ target: { value: nextRightValue } });
      }
      // Clear the last item
      ["leftColumn", "rightColumn"].forEach((column) => {
        register(`${prefix}.${column}.${itemCount - 1}.id`).onChange({
          target: { value: "" },
        });
        register(`${prefix}.${column}.${itemCount - 1}.text`).onChange({
          target: { value: "" },
        });
      });
      register(`${prefix}.correctPairs.${itemCount - 1}.left`).onChange({
        target: { value: "" },
      });
      register(`${prefix}.correctPairs.${itemCount - 1}.right`).onChange({
        target: { value: "" },
      });
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Matching Items</h3>
        <div>
          <button
            type="button"
            onClick={() => removeItem(itemCount - 1)}
            className="mr-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            disabled={itemCount <= 3}
          >
            <FaMinus />
          </button>
          <button
            type="button"
            onClick={addItem}
            className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            disabled={itemCount >= 8}
          >
            <FaPlus />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Left Column
          </label>
          {[...Array(itemCount)].map((_, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <FormField
                id={`${prefix}.leftColumn.${index}.id`}
                register={register}
                errors={errors}
                className="w-[50px] flex-shrink-0"
                placeholder={`${matchingInput.leftColumn[index]?.id}`}
                type="number"
                transform={{
                  input: (value) => value,
                  output: (value) => Number(value),
                }}
              />
              <div className="flex-grow">
                <FormField
                  id={`${prefix}.leftColumn.${index}.text`}
                  register={register}
                  errors={errors}
                  className="w-full"
                  placeholder={matchingInput.leftColumn[index]?.text}
                />
              </div>
            </div>
          ))}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Right Column
          </label>
          {[...Array(itemCount)].map((_, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <FormField
                id={`${prefix}.rightColumn.${index}.id`}
                register={register}
                errors={errors}
                className="w-[50px] flex-shrink-0"
                placeholder={matchingInput.rightColumn[index]?.id}
                required={true}
              />
              <div className="flex-grow">
                <FormField
                  id={`${prefix}.rightColumn.${index}.text`}
                  register={register}
                  errors={errors}
                  className="w-full"
                  placeholder={matchingInput.rightColumn[index]?.text}
                  required={true}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Correct Pairs
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[...Array(itemCount)].map((_, index) => (
            <div key={index} className="flex items-center gap-2">
              <FormField
                id={`${prefix}.correctPairs.${index}.left`}
                register={register}
                errors={errors}
                className="w-12 flex-shrink-0"
                placeholder={matchingInput.correctPairs[index]?.left.toString()}
                required={true}
                type="number"
                transform={{
                  input: (value) => value,
                  output: (value) => Number(value),
                }}
              />
              <FormField
                id={`${prefix}.correctPairs.${index}.right`}
                register={register}
                errors={errors}
                className="w-12 flex-shrink-0"
                placeholder={matchingInput.correctPairs[index]?.right}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
