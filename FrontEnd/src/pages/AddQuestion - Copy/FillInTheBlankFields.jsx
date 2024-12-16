import React from "react";
import FormField from "./FormField";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useFieldArray } from "react-hook-form";

const fillInTheBlank = {
  type: "fill_in_the_blank",
  section: "reading",
  questionText: "Complete the passage with the correct words.",
  instruction:
    "Fill in the blanks with the most appropriate words from the context.",
  difficulty: 4,
  text: "The Great Barrier Reef, located off the coast of _____, is the world's largest coral reef system. It is so vast that it can be seen from _____. The reef is home to an incredible diversity of marine life, including over 1,500 species of fish, 400 species of hard coral, and numerous other _____.",
  blanks: [
    { index: 0, correctAnswer: "Australia" },
    { index: 1, correctAnswer: "space" },
    { index: 2, correctAnswer: "organisms" },
  ],
};

export default function FillInTheBlankFields({
  register,
  errors,
  prefix,
  control,
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `${prefix}.blanks`,
  });

  useEffect(() => {
    // Initialize with default values if no fields exist
    if (fields.length === 0) {
      fillInTheBlank.blanks.forEach((blank) => {
        append(blank);
      });
    }
  }, []);

  const addBlank = () => {
    append({ index: fields.length, correctAnswer: "" });
  };

  const removeBlank = (index) => {
    remove(index);
  };

  return (
    <>
      <FormField
        label="Text"
        id={`${prefix}.text`}
        type="textarea"
        register={register}
        errors={errors}
      />
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Blanks
        </label>
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2 mt-2">
            <div className="w-[60px] flex-shrink-0">
              <input
                {...register(`${prefix}.blanks.${index}.index`)}
                type="number"
                className="w-full p-2 border rounded text-center"
                defaultValue={index}
                readOnly
              />
            </div>
            <div className="w-3/4 flex-grow">
              <input
                {...register(`${prefix}.blanks.${index}.correctAnswer`)}
                className="w-full p-2 border rounded"
                placeholder="Enter correct answer"
              />
            </div>
            <div className="w-[60px] flex gap-5">
              <button
                type="button"
                onClick={() => removeBlank(index)}
                className="text-red-500"
              >
                <FaMinus />
              </button>
              <button
                type="button"
                onClick={addBlank}
                className="text-green-500"
              >
                <FaPlus />
              </button>
            </div>
          </div>
        ))}
      </div>
      {errors?.blanks && (
        <p className="text-red-500">{errors.blanks.message}</p>
      )}
    </>
  );
}
