import React from "react";

export default function Testimonials() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold font-serif text-center mb-12">
          What Our Students Say
        </h2>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <img
                src="https://via.placeholder.com/64x64?text=Student"
                alt="Student"
                className="w-16 h-16 rounded-full mr-4"
              />
              <div>
                <h3 className="text-xl font-bold">John Doe</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Web Development Graduate
                </p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 italic">
              "The courses on this platform have been instrumental in advancing
              my career. The instructors are knowledgeable, and the content is
              always up-to-date with industry standards."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
