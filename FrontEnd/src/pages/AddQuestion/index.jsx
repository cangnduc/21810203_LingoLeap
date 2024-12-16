"use client";

import BaseQuestion from "./BaseQuestion";

export default function AddQuestion({ mode = "add", initialData = null }) {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-2">
        {mode === "edit" ? "Edit Question" : "Add Question"}
      </h2>
      <BaseQuestion mode={mode} initialData={initialData} />
    </div>
  );
}
