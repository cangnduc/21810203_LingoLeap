import React from "react";
import { BACKEND_URL } from "@/constant";
const PassageDisplay = ({ passage, index }) => {
  // Convert backend path to frontend URL
  const getAudioUrl = (filePath) => {
    if (!filePath) return "";

    return `${BACKEND_URL}/uploads/audio/${filePath}`;
  };

  const file = getAudioUrl(passage?.soundFile);
  return (
    <div
      className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow 
                    transition-colors"
    >
      <h3 className="text-xl font-semibold mb-3 dark:text-gray-200">
        No. {index + 1}: {passage?.title}
      </h3>
      {passage?.passageType === "listening" && passage?.soundFile && (
        <div className="mb-4">
          <audio controls className="w-full dark:bg-gray-700">
            <source src={file} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
      <div className="prose dark:prose-invert max-w-none">
        {passage?.text?.split("\n").map((paragraph, index) => (
          <p key={index} className="mb-4 dark:text-gray-300">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
};

export default PassageDisplay;
