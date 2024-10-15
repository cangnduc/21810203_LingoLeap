import React from "react";
import { FaUserTie, FaRegCalendarCheck, FaBookOpen } from "react-icons/fa";
export default function FeaturesOverview() {
  return (
    <section className="py-8 md:py-16 px-4">
      <div className="relative w-full h-1 mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      </div>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-gray-800 dark:text-gray-300 text-3xl font-bold font-serif text-center mb-12">
          Why Choose Us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <FaUserTie size={48} />,
              title: "Expert Instructors",
              description: "Learn from industry professionals",
            },
            {
              icon: <FaRegCalendarCheck size={48} />,
              title: "Flexible Learning",
              description: "Study at your own pace, anytime",
            },
            {
              icon: <FaBookOpen size={48} />,
              title: "Diverse Courses",
              description: "Wide range of subjects to choose from",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-lg shadow-md  hover:scale-105 transition-transform duration-300 border"
            >
              <div className="text-4xl mb-4 text-indigo-500 flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="text-gray-700 dark:text-gray-300 text-xl font-bold mb-2">
                {feature.title}
              </h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
