import React from "react";
import FormField from "./FormField";

export default function TrueFalseFields({ register, errors, prefix }) {
  return (
    <>
      {" "}
      <FormField
        label="Statement"
        id={`${prefix}.statement`}
        register={register}
        errors={errors}
        type="textarea"
        required={true}
      />
      {errors?.statement && (
        <p className="text-red-500">{errors.statement.message}</p>
      )}
      <FormField
        label="Correct Answer"
        id={`${prefix}.correctAnswer`}
        register={register}
        errors={errors}
        type="select"
        options={[
          { value: true, label: "True" },
          { value: false, label: "False" },
        ]}
        transform={{
          input: (value) => String(value),
          output: (value) => value === "true",
        }}
      />
    </>
  );
}
