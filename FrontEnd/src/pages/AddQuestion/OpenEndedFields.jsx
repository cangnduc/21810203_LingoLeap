import React from "react";
import FormField from "./FormField";

export default function OpenEndedFields({ register, errors, prefix }) {
  return (
    <>
      <FormField
        label="Prompt"
        id={`${prefix}.prompt`}
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
