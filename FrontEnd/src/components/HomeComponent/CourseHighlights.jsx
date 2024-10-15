import React from "react";
import { Star } from "lucide-react";

export default function CourseHighlights() {
  return (
    <section className="px-4">
      <div className="relative w-full h-1 mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      </div>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold font-serif text-center mb-12">
          Featured Courses
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Web Development",
              level: "Intermediate",
              rating: 4.5,
            },
            { title: "Data Science", level: "Advanced", rating: 4.8 },
            { title: "Digital Marketing", level: "Beginner", rating: 4.2 },
          ].map((course, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={`https://via.placeholder.com/400x200?text=Course+${
                  index + 1
                }`}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-semibold text-[#01041c] dark:text-[#d1e1e3]">
                    {course.level}
                  </span>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < Math.floor(course.rating)
                            ? "text-yellow-400"
                            : "text-gray-300 dark:text-gray-600"
                        }
                      />
                    ))}
                    <span className="ml-1 text-sm text-gray-600 dark:text-gray-300">
                      {course.rating}
                    </span>
                  </div>
                </div>
                <button className="w-full bg-[#d1e1e3] text-[#01041c] py-2 rounded font-semibold hover:bg-opacity-90">
                  Enroll Now
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <button className="bg-blue-500 dark:bg-blue-800 text-white px-8 py-3 rounded-full text-lg font-bold hover:bg-opacity-90 hover:scale-105 transition duration-300">
            View All Courses
          </button>
        </div>
      </div>
    </section>
  );
}
