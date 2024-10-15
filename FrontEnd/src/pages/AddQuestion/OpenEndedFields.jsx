import React from "react";
import FormField from "./FormField";

export default function OpenEndedFields({ register, errors, prefix }) {
  return (
    <>
      <FormField
        label="Max Words"
        id={`${prefix}.maxWords`}
        type="number"
        register={register}
        errors={errors}
        transform={{
          input: (value) => value,
          output: (value) => Number(value),
        }}
      />
      {errors?.maxWords && (
        <p className="mt-1 text-sm text-red-600">{errors.maxWords.message}</p>
      )}

      <FormField
        label="Sample Answer"
        id={`${prefix}.sampleAnswer`}
        type="textarea"
        register={register}
        errors={errors}
        required={true}
      />
      {errors?.sampleAnswer && (
        <p className="mt-1 text-sm text-red-600">
          {errors.sampleAnswer.message}
        </p>
      )}
    </>
  );
}
