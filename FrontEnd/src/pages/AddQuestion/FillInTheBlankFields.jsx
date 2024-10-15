import React from "react";
import FormField from "./FormField";
//import removeicon from react-icons/fa
import { FaMinus, FaPlus } from "react-icons/fa";
import { useState } from "react";
const fillInTheBlank = {
  type: "fill_in_the_blank",
  section: "reading",
  questionText: "Complete the passage with the correct words.",
  instruction:
    "Fill in the blanks with the most appropriate words from the context.",
  difficulty: 4,
  text: "The Great Barrier Reef, located off the coast of (1), is the world's largest coral reef system. It is so vast that it can be seen from (2). The reef is home to an incredible diversity of marine life, including over 1,500 species of fish, 400 species of hard coral, and numerous other (3).",
  blanks: [
    { index: 0, correctAnswer: "Australia" },
    { index: 1, correctAnswer: "space" },
    { index: 2, correctAnswer: "organisms" },
  ],
};

export default function FillInTheBlankFields({ register, errors, prefix }) {
  const [blanks, setBlanks] = useState(fillInTheBlank.blanks);
  function addBlank() {
    setBlanks([...blanks, { index: blanks.length, correctAnswer: "" }]);
  }
  function removeBlank(index) {
    console.log("index", index);
    setBlanks(blanks.filter((_, i) => i !== index));
  }
  console.log(blanks);
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
        {blanks.map((blank, index) => (
          <div key={index} className="flex gap-2 mt-2">
            <div className="w-[60px] flex-shrink-0">
              <FormField
                id={`${prefix}.blanks.${index}.index`}
                type="number"
                register={register}
                errors={errors}
                className="text-center"
                transform={{
                  input: (value) => value,
                  output: (value) => Number(value),
                }}
                placeholder={`${blanks[index].index + 1}`}
              />
            </div>
            <div className="w-3/4 flex-grow">
              <FormField
                id={`${prefix}.blanks.${index}.correctAnswer`}
                register={register}
                errors={errors}
                className="w-3/4"
                placeholder={`${blank.correctAnswer}`}
              />
            </div>
            <div className="w-[60px] flex gap-5">
              <button
                type="button"
                onClick={() => removeBlank(index)}
                className="text-red-500"
              >
                <FaMinus />
              </button>{" "}
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
