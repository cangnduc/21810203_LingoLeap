import React from "react";
import { BookOpen, Headphones, Pen } from "lucide-react";
import TestCard from "./TestCard";

export default function FeaturedTests() {
  const tests = [
    {
      name: "IELTS Practice Test",
      icon: <BookOpen size={24} />,
      description: "Comprehensive practice for all IELTS sections",
      skills: ["Reading", "Writing", "Listening", "Speaking"],
      difficulty: "Intermediate",
    },
    {
      name: "TOEFL Reading Comprehension",
      icon: <BookOpen size={24} />,
      description: "Improve your TOEFL reading skills",
      skills: ["Reading", "Writing"],
      difficulty: "Advanced",
    },
    {
      name: "English Listening Test",
      icon: <Headphones size={24} />,
      description: "Enhance your listening comprehension",
      skills: ["Listening"],
      difficulty: "Beginner",
    },
    {
      name: "Business English Writing",
      icon: <Pen size={24} />,
      description: "Master professional English writing",
      skills: ["Writing", "Reading", "Listening"],
      difficulty: "Intermediate",
    },
  ];

  return (
    <section className="py-16 px-4">
      {/* Background Line*/}
      <div className="relative w-full h-1 mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-gray-900 dark:text-gray-300 text-3xl font-bold font-serif text-center mb-4">
          Popular English Tests
        </h2>
        <p className="text-center mb-12">
          Prepare for your language exams with our comprehensive practice tests
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tests.map((test, index) => (
            <TestCard key={index} {...test} />
          ))}
        </div>
        <div className="text-center mt-12">
          <button className="bg-blue-500 dark:bg-blue-800 text-white px-8 py-3 rounded-full text-lg font-bold hover:bg-opacity-90 hover:scale-105 transition duration-300">
            View All Tests
          </button>
        </div>
      </div>
    </section>
  );
}
