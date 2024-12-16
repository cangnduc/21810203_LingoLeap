import React, { useState } from "react";

const TruncatedText = ({ text, maxLength = 100 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (text.length <= maxLength) return <span>{text}</span>;

  return (
    <div>
      <span>{isExpanded ? text : `${text.slice(0, maxLength)}...`}</span>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 text-sm font-medium"
      >
        {isExpanded ? "Show less" : "Read more"}
      </button>
    </div>
  );
};

export default TruncatedText;
