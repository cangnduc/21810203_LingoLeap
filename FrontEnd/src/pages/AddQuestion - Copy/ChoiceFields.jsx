import React from "react";
import FormField from "./FormField";

export default function ChoiceFields({ type, register, errors, prefix }) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Answers
        </label>
        <div className="flex flex-col gap-2">
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="flex items-center gap-2">
              <FormField
                id={`${prefix}.answers.${index}`}
                register={register}
                errors={errors}
                className="flex-grow"
              />
              {type === "multiple_choice" && (
                <input
                  type="checkbox"
                  id={`${prefix}.correctAnswers.${index}`}
                  {...register(`${prefix}.correctAnswers.${index}`)}
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
              )}
            </div>
          ))}
        </div>
        {type === "multiple_choice" && errors[`${prefix}.correctAnswers`] && (
          <p className="text-red-500 text-sm mt-1">
            {errors[`${prefix}.correctAnswers`].message}
          </p>
        )}
      </div>
      {type === "single_choice" && (
        <FormField
          label="Correct Answer"
          id={`${prefix}.correctAnswer`}
          register={register}
          errors={errors}
        />
      )}
    </>
  );
}
