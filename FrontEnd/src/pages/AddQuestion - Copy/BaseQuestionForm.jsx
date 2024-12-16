import React from "react";
import FormField from "./FormField";
import QuestionTypeFields from "./QuestionTypeFields";
import { motion } from "framer-motion";
import { typeList } from "@/constant/Samples";

export default function BaseQuestionForm({
  questionType,
  section,
  register,
  errors,
  prefix,
  setQuestionType,
  questionTypes,
  control, // Add this line
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {/* Question Type Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Question Type</label>
        <div className="flex flex-wrap gap-2">
          {questionTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setQuestionType(type)}
              className={`p-2 rounded-md ${
                questionType === type
                  ? "bg-blue-500 text-white dark:bg-blue-700 dark:text-gray-300"
                  : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                {typeList.find((t) => t.name === type).icon}
                {type.replace("_", " ")}
              </div>
            </button>
          ))}
        </div>
      </div>

      <FormField
        label="Question Text"
        id={`${prefix}.questionText`}
        type="textarea"
        register={register}
        errors={errors}
      />
      {errors?.questionText && (
        <p className="text-red-500">{errors.questionText.message}</p>
      )}

      <FormField
        label="Instruction"
        id={`${prefix}.instruction`}
        type="textarea"
        register={register}
        errors={errors}
      />
      {errors?.instruction && (
        <p className="text-red-500">{errors.instruction.message}</p>
      )}

      <FormField
        label="Difficulty"
        id={`${prefix}.difficulty`}
        type="number"
        register={register}
        errors={errors}
        className="w-full"
        transform={{
          input: (value) => value,
          output: (value) => Number(value),
        }}
      />
      {errors?.difficulty && (
        <p className="text-red-500">{errors.difficulty.message}</p>
      )}

      <QuestionTypeFields
        type={questionType}
        register={register}
        errors={errors}
        prefix={prefix}
        control={control} // Add this line
      />
    </motion.div>
  );
}
