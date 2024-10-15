import React from "react";

export default function CallToAction() {
  return (
    <section className="py-16 bg-[#01041c]">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold font-serif mb-4 text-white">
          Ready to Start Learning?
        </h2>
        <p className="text-xl mb-8 text-white">
          Join thousands of students and kickstart your career today!
        </p>
        <button className="bg-[#d1e1e3] text-[#01041c] px-8 py-3 rounded-full text-lg font-bold hover:bg-opacity-90">
          Sign Up Now
        </button>
      </div>
    </section>
  );
}
