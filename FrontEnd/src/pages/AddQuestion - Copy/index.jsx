"use client";

import BaseQuestion from "./BaseQuestion";
// Define the section and type lists

export default function AddQuestion() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-2">Question</h2>
      <BaseQuestion />
    </div>
  );
}
