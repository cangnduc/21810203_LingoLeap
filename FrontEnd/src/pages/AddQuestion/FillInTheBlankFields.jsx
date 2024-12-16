import React from "react";
import FormField from "./FormField";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useFieldArray } from "react-hook-form";

const DEFAULT_TEXT =
  "The Great Barrier Reef, located off the coast of _____, is the world's largest coral reef system. It is so vast that it can be seen from _____. The reef is _____ to an incredible diversity of marine life;";

export default function FillInTheBlankFields({
  register,
  errors,
  prefix,
  control,
  setValue,
  watch,
  trigger,
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `${prefix}.blanks`,
  });

  // Add state for managing option inputs
  const [optionInputs, setOptionInputs] = React.useState({});

  // Initialize form only once with correct number of blanks
  useEffect(() => {
    if (fields.length === 0) {
      setValue(`${prefix}.text`, DEFAULT_TEXT);
      const initialBlankCount = (DEFAULT_TEXT.match(/_____/g) || []).length;

      // Add initial blanks
      for (let i = 0; i < initialBlankCount; i++) {
        append({ index: i + 1, correctAnswer: "", options: [] });
      }
    }
  }, []); // Run only once on mount

  // Watch the text field to count blanks
  const text = watch(`${prefix}.text`);
  const blankCount = (text?.match(/_____/g) || []).length;
  console.log("error", errors);
  // Sync number of blanks with text
  useEffect(() => {
    const currentBlanks = fields.length;
    if (blankCount > currentBlanks) {
      // Add new blanks
      for (let i = currentBlanks; i < blankCount; i++) {
        append({ index: i + 1, correctAnswer: "", options: [] });
      }
    } else if (blankCount < currentBlanks) {
      // Remove excess blanks
      for (let i = currentBlanks - 1; i >= blankCount; i--) {
        remove(i);
      }
    }
  }, [blankCount]);

  const addOption = (fieldIndex, newOption) => {
    if (!newOption?.trim()) return;

    const currentOptions =
      watch(`${prefix}.blanks.${fieldIndex}.options`) || [];
    if (currentOptions.includes(newOption.trim())) return;

    setValue(`${prefix}.blanks.${fieldIndex}.options`, [
      ...currentOptions,
      newOption.trim(),
    ]);

    setOptionInputs((prev) => ({
      ...prev,
      [fieldIndex]: "",
    }));
  };

  // Add a validation helper function
  const validateCorrectAnswer = (index, value) => {
    const currentOptions = watch(`${prefix}.blanks.${index}.options`) || [];

    if (value && currentOptions.length > 0 && !currentOptions.includes(value)) {
      return "Correct answer must be in the options list";
    }
    return "";
  };

  const removeOption = (fieldIndex, optionIndex) => {
    const currentOptions =
      watch(`${prefix}.blanks.${fieldIndex}.options`) || [];
    setValue(
      `${prefix}.blanks.${fieldIndex}.options`,
      currentOptions.filter((_, index) => index !== optionIndex)
    );
  };
  const [correctAnswerError, setCorrectAnswerError] = useState(null);
  console.log("errors", errors);
  return (
    <>
      <FormField
        label="Text (Use _____ (5 underscores) for blanks)"
        id={`${prefix}.text`}
        type="textarea"
        register={register}
        errors={errors}
        defaultValue={DEFAULT_TEXT}
      />

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Blanks
        </label>

        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex flex-col gap-2 mb-4 p-4 border rounded bg-white dark:bg-gray-800 dark:border-gray-700"
          >
            <div className="flex items-center gap-2">
              <span className="w-8 text-center font-medium text-gray-600 dark:text-gray-300">
                #{index + 1}
              </span>
              <div className="flex-1">
                <input
                  {...register(`${prefix}.blanks.${index}.correctAnswer`)}
                  className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 
                           border-gray-300 dark:border-gray-600 
                           text-gray-900 dark:text-gray-100
                           focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 
                           focus:border-blue-500 dark:focus:border-blue-600
                           placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Enter correct answer"
                />
              </div>
            </div>

            <div className="ml-8">
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  className="flex-1 p-2 rounded-md
                           bg-gray-50 dark:bg-gray-700 
                           border border-gray-300 dark:border-gray-600
                           text-gray-900 dark:text-gray-100
                           focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600
                           focus:border-blue-500 dark:focus:border-blue-600
                           placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Add an option (optional)"
                  value={optionInputs[index] || ""}
                  onChange={(e) =>
                    setOptionInputs((prev) => ({
                      ...prev,
                      [index]: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addOption(index, optionInputs[index]);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => addOption(index, optionInputs[index])}
                  className="px-3 py-2 rounded-md
                           bg-green-50 dark:bg-green-900
                           text-green-600 dark:text-green-400
                           hover:bg-green-100 dark:hover:bg-green-800
                           transition-colors duration-200"
                >
                  <FaPlus />
                </button>
              </div>

              {/* Display options */}
              <div className="flex flex-wrap gap-2">
                {watch(`${prefix}.blanks.${index}.options`, [])?.map(
                  (option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className="px-3 py-1 rounded-full
                               bg-gray-100 dark:bg-gray-700
                               text-gray-700 dark:text-gray-300
                               border border-gray-200 dark:border-gray-600
                               flex items-center gap-2"
                    >
                      <span>{option}</span>
                      <button
                        type="button"
                        onClick={() => removeOption(index, optionIndex)}
                        className="text-red-500 dark:text-red-400
                                 hover:text-red-700 dark:hover:text-red-300
                                 transition-colors duration-200"
                      >
                        ×
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>

            {errors?.blanks?.[index] && (
              <p className="text-red-500 dark:text-red-400 text-sm ml-8">
                {errors.blanks[index].message}
              </p>
            )}
          </div>
        ))}
      </div>

      {errors?.blanks && (
        <p className="text-red-500">{errors.blanks.message}</p>
      )}
    </>
  );
}
