import React from "react";
import FormField from "./FormField";

export default function EssayFields({ register, errors, prefix }) {
  return (
    <>
      <FormField
        label="Min Words"
        id={`${prefix}.minWords`}
        type="number"
        register={register}
        errors={errors}
        transform={{
          input: (value) => value,
          output: (value) => Number(value),
        }}
      />

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

      <FormField
        label="Rubric"
        id={`${prefix}.rubric`}
        type="textarea"
        register={register}
        errors={errors}
      />
    </>
  );
}
