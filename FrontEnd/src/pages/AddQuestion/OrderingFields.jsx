import React, { useState, useEffect } from "react";
import FormField from "./FormField";
import { FaTrash, FaPlus } from "react-icons/fa";

const orderingInput = {
  type: "ordering",

  questionText: "Arrange the following sentences to form a coherent paragraph.",
  instruction: "Drag and drop the sentences into the correct order.",
  difficulty: 4,
  items: [
    {
      id: "1",
      text: "However, with proper planning and execution, these challenges can be overcome.",
    },
    {
      id: "2",
      text: "Urban gardening is becoming increasingly popular in cities around the world.",
    },
    {
      id: "3",
      text: "It offers numerous benefits, including fresh produce and improved air quality.",
    },
    {
      id: "4",
      text: "Space constraints and pollution are common obstacles faced by urban gardeners.",
    },
  ],
  correctOrder: ["2", "3", "4", "1"],
};

export default function OrderingFields({
  register,
  getValues,
  errors,
  prefix,
  setValue,
}) {
  const [fields, setFields] = useState([
    { id: "1", text: "" },
    { id: "2", text: "" },
    { id: "3", text: "" },
  ]);
  useEffect(() => {
    const items = getValues(`${prefix}.items`);
    if (items.length > 0) {
      setFields(items);
    }
  }, []);
  const addItem = () => {
    if (fields.length < 8) {
      const newId = (fields.length + 1).toString();
      console.log("newId", newId);
      setFields([...fields, { id: newId, text: "" }]);
    }
  };
  useEffect(() => {
    setValue(`${prefix}.items`, fields);
  }, [fields]);
  //console.log("fields", fields);
  const removeItem = (index) => {
    if (fields.length > 3) {
      const newFields = fields.filter((_, idx) => idx !== index);
      setFields(
        newFields.map((field, idx) => ({ ...field, id: (idx + 1).toString() }))
      );
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
                value={field.id}
              />
            </div>
            <div className="flex-grow">
              <FormField
                id={`${prefix}.items.${index}.text`}
                register={register}
                errors={errors}
                className="w-full"
                placeholder={`item ${index + 1}`}
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
          placeholder={orderingInput.correctOrder.join(",")}
        />
      </div>
    </>
  );
}
