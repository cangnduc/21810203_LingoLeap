import React, { useState } from "react";
import FormField from "./FormField";
import { FaTrash, FaPlus } from "react-icons/fa";
import { useFieldArray } from "react-hook-form";

export default function OrderingFields({
  control,
  register,
  errors,
  prefix,
  getValues,
}) {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `${prefix}.items`,
  });
  console.log("fields", fields);
  const addItem = () => {
    if (fields.length < 8) {
      append({ id: fields.length + 1, text: "" });
    }
  };
  console.log("errors", errors);
  const removeItem = (index) => {
    if (fields.length > 3) {
      remove(index);
      //reset the index of the items

      // Update the correctOrder array
      const currentCorrectOrder = getValues(`${prefix}.correctOrder`);
      console.log("currentCorrectOrder", currentCorrectOrder);
      if (Array.isArray(currentCorrectOrder)) {
        const updatedCorrectOrder = currentCorrectOrder
          .filter((id) => id !== fields[index].id)
          .map((id) => {
            const idNumber = parseInt(id);
            return idNumber > index ? (idNumber - 1).toString() : id;
          });
        register(`${prefix}.correctOrder`).onChange({
          target: { value: updatedCorrectOrder.join(",") },
        });
        console.log("updatedCorrectOrder", updatedCorrectOrder);
      }
    }
  };

  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Items
        </label>
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2 mb-2">
            <div className="w-[60px] flex-shrink-0">
              <FormField
                id={`${prefix}.items.${index}.id`}
                register={register}
                errors={errors}
                className="w-full text-center"
                placeholder={field.id}
                required={true}
                disabled={true}
              />
            </div>
            <div className="flex-grow">
              <FormField
                id={`${prefix}.items.${index}.text`}
                register={register}
                errors={errors}
                className="w-full"
                placeholder={`Item ${index + 1}`}
                required={true}
              />
            </div>
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="p-2 text-red-500 hover:text-red-700 transition-colors"
              disabled={fields.length <= 3}
            >
              <FaTrash />
            </button>
          </div>
        ))}
        {errors.question?.items && (
          <p className="mt-1 text-sm text-red-600">
            {errors.question.items.message}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={addItem}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center"
        disabled={fields.length >= 8}
      >
        <FaPlus className="mr-2" /> Add Item
      </button>
      <div className="mt-4">
        <FormField
          label="Correct Order"
          id={`${prefix}.correctOrder`}
          register={register}
          errors={errors}
          transform={{
            input: (value) => (Array.isArray(value) ? value.join(",") : value),
            output: (value) =>
              typeof value === "string" ? value.split(",") : [],
          }}
          required={true}
          placeholder={`2,1,3,4`}
        />
      </div>
    </>
  );
}
