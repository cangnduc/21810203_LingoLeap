import React from "react";

const getSkillColor = (skill) => {
  const colors = {
    Reading: "bg-blue-500 dark:bg-blue-300 text-white dark:text-blue-900",
    Writing: "bg-green-500 dark:bg-green-300 text-white dark:text-green-900",
    Listening:
      "bg-purple-500 dark:bg-purple-300 text-white dark:text-purple-900",
    Speaking:
      "bg-orange-500 dark:bg-orange-300 text-white dark:text-orange-900",
  };
  return (
    colors[skill] ||
    "bg-gray-500 dark:bg-gray-300 text-white dark:text-gray-900"
  );
};

export default function TestCard({
  name,
  icon,
  description,
  skills,
  difficulty,
}) {
  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded-lg shadow-md overflow-hidden flex flex-col h-full p-6 lg:gap-4 md:gap-2 gap-1">
      {/* Icon and Name */}
      <div className="flex items-center mb-4 flex-shrink-0">
        <div className="text-3xl mr-3">{icon}</div>
        <h3 className="text-xl font-bold truncate">{name}</h3>
      </div>

      {/* Description */}
      <p className="mb-4 text-gray-700 dark:text-gray-300 flex-grow overflow-hidden">
        {description}
      </p>

      {/* Skills */}
      <div className="flex flex-wrap gap-2 mb-4 flex-shrink-0">
        {skills.map((skill, skillIndex) => (
          <span
            key={skillIndex}
            className={`${getSkillColor(skill)} px-2 py-1 rounded text-sm`}
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Difficulty */}
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <span className="text-sm font-semibold">Difficulty:</span>
        <span className="text-sm">{difficulty}</span>
      </div>

      {/* Button */}
      <button className="btn-theme bg-blue-500 dark:bg-blue-800 text-white w-full py-2 rounded font-semibold hover:bg-opacity-90 transition duration-300 hover:scale-105 mt-auto flex-shrink-0">
        Take Test
      </button>
    </div>
  );
}
